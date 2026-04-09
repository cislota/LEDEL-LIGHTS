# Сервис синхронизации с Tilda API
import requests
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List, Tuple
from sqlalchemy.orm import Session

from ..config import TILDA_API_URL, TILDA_STORE_PART_UID, TILDA_RECID
from ..models.product import Product
from ..models.sync_log import SyncLog

logger = logging.getLogger(__name__)


class TildaSyncService:
    """
    Сервис для синхронизации данных с Tilda API.
    Реализует upsert логику (обновить или создать).
    """

    def __init__(self, db: Session):
        """
        Инициализация сервиса.
        
        Args:
            db: Сессия базы данных
        """
        self.db = db
        self.api_url = TILDA_API_URL
        self.store_part_uid = TILDA_STORE_PART_UID
        self.recid = TILDA_RECID

    def fetch_products(self) -> Optional[Dict[str, Any]]:
        """
        Получить список продуктов из Tilda API.
        """
        try:
            params = {
                "storepartuid": self.store_part_uid,
                "recid": self.recid,
            }

            logger.info(f"Запрос к Tilda API: {self.api_url}")
            response = requests.get(self.api_url, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()
            logger.info(f"Tilda API ответ: status={data.get('status')}, products={len(data.get('products', []))}")

            # Tilda API может вернуть статус "OK" или просто массив products
            if data.get("status") == "OK" or "products" in data:
                return data
            else:
                logger.error(f"Tilda API вернул ошибку: {data}")
                return None

        except requests.Timeout:
            logger.error("Timeout при запросе к Tilda API (30 сек)")
            return None
        except requests.ConnectionError as e:
            logger.error(f"Ошибка соединения с Tilda API: {e}")
            return None
        except requests.HTTPError as e:
            logger.error(f"HTTP ошибка при запросе к Tilda API: {e}")
            return None
        except Exception as e:
            logger.error(f"Неожиданная ошибка при запросе к Tilda API: {e}")
            return None

    def _categorize_product(self, title: str) -> str:
        """
        Определяет категорию товара по ключевым словам в названии.
        Аналогично логике frontend (product-helpers.ts: categorizeProduct).
        
        Маппинг:
            L-street      → Уличное освещение
            L-office      → Офисное освещение
            L-fusion Retail → Коммерческое освещение
            L-contour/L-facade → Архитектурно-парковое освещение
            По умолчанию  → Промышленное освещение
        """
        name_main = title.split("/")[0].strip().lower()

        if "l-street" in name_main:
            return "Уличное освещение"
        if "l-office" in name_main or "l-fusion office" in name_main:
            return "Офисное освещение"
        if "l-fusion retail" in name_main:
            return "Коммерческое освещение"
        if "l-contour" in name_main or "l-facade" in name_main:
            return "Архитектурно-парковое освещение"
        # Промышленное — по умолчанию (L-industry, L-banner, и др.)
        return "Промышленное освещение"

    def parse_product(self, tilda_product: Dict[str, Any]) -> Dict[str, Any]:
        """
        Преобразовать продукт из формата Tilda в словарь для сохранения в БД.
        
        Реальный формат Tilda API (проверено 09.04.2026):
        {
            "uid": 191969491032,          // ЧИСЛО, не строка
            "title": "Светильник...",     // НЕ "name"!
            "text": "600 Вт/69130Лм...",  // НЕ "description"!
            "descr": "Проектор",          // Описание/категория
            "price": null,                // Часто null
            "gallery": "[{...}]",         // JSON СТРОКА, не массив!
            "brand": "LEDEL",
            "characteristics": [...],     // Характеристики
            "editions": [...],            // Модификации
        }
        """
        # === Идентификаторы ===
        uid_raw = tilda_product.get("uid")
        uid = str(uid_raw) if uid_raw is not None else None
        recid = tilda_product.get("recid")

        # === Основная информация ===
        title = tilda_product.get("title", "")
        # text — полное описание, descr — краткое/категория
        description = tilda_product.get("descr", "")
        text = tilda_product.get("text", "")

        # Разбиваем название на основную часть и спецификацию (по "/")
        name_parts = title.split("/")
        name_main = name_parts[0].strip() if name_parts else title
        name_spec = "/".join(name_parts[1:]).strip() if len(name_parts) > 1 else ""

        # === Цена (часто null у Tilda) ===
        price_raw = tilda_product.get("price")
        price = float(price_raw) if price_raw else None
        currency = tilda_product.get("currency", "RUB")

        # === Изображения ===
        image_url = None
        gallery = None

        # Обработка gallery — это JSON СТРОКА, не массив
        gallery_str = tilda_product.get("gallery")
        if gallery_str:
            try:
                gallery_data = json.loads(gallery_str) if isinstance(gallery_str, str) else gallery_str
                gallery = json.dumps(gallery_data, ensure_ascii=False)

                # Извлекаем первое изображение
                if isinstance(gallery_data, list) and len(gallery_data) > 0:
                    first_img = gallery_data[0]
                    if isinstance(first_img, dict):
                        image_url = first_img.get("img") or first_img.get("url") or first_img.get("1080")
                    elif isinstance(first_img, str):
                        image_url = first_img
                elif isinstance(gallery_data, dict):
                    image_url = gallery_data.get("img") or gallery_data.get("url")
            except json.JSONDecodeError:
                logger.warning(f"Не удалось распарсить gallery: {gallery_str[:100]}")
                gallery = gallery_str

        # Характеристики — characteristics или json_options
        specs = None
        characteristics = tilda_product.get("characteristics")
        if characteristics and isinstance(characteristics, list):
            specs = json.dumps(characteristics, ensure_ascii=False)

        # === Категоризация ===
        # Tilda отдаёт descr="Проектор"/"Светильник" — это не категория!
        # Всегда определяем категорию по ключевым словам в title
        category = self._categorize_product(title)
        product_type = tilda_product.get("type")

        # === Дополнительные поля ===
        article = tilda_product.get("sku") or tilda_product.get("article")
        brand = tilda_product.get("brand")

        # === Генерация slug ===
        slug = self._generate_slug(title)

        # === Статусы ===
        is_available = tilda_product.get("is_available", True)
        is_visible = tilda_product.get("is_visible", True)

        # === Остаток на складе ===
        stock = tilda_product.get("quantity", 0)
        try:
            stock = int(stock) if stock else 0
        except (ValueError, TypeError):
            stock = 0

        return {
            # Идентификаторы
            "uid": uid,
            "recid": str(recid) if recid else None,
            "tilda_id": uid,
            # Основная информация
            "title": title,
            "slug": slug,
            "description": description[:500] if description else None,
            "text": text,
            "name_main": name_main,
            "name_spec": name_spec,
            # Цена
            "price": price,
            "currency": currency,
            # Изображения
            "image_url": image_url,
            "gallery": gallery,
            # Категоризация
            "category": category,
            "type": product_type,
            # Характеристики
            "article": article,
            "brand": brand,
            "specs": specs,
            # Статусы
            "is_available": is_available,
            "is_visible": is_visible,
            "stock": stock,
        }

    def _generate_slug(self, title: str) -> str:
        """
        Сгенерировать URL-слаг из названия товара.
        
        Args:
            title: Название товара
            
        Returns:
            URL-слаг (транслитерация)
        """
        if not title:
            return ""

        # Транслитерация русских символов
        translit = {
            "а": "a", "б": "b", "в": "v", "г": "g", "д": "d",
            "е": "e", "ё": "yo", "ж": "zh", "з": "z", "и": "i",
            "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
            "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
            "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch",
            "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "",
            "э": "e", "ю": "yu", "я": "ya",
            " ": "-", "_": "-",
        }

        # Приводим к нижнему регистру
        slug = title.lower()

        # Транслитерируем
        result = ""
        for char in slug:
            if char in translit:
                result += translit[char]
            elif char.isalnum():
                result += char
            else:
                result += "-"

        # Удаляем повторяющиеся дефисы
        while "--" in result:
            result = result.replace("--", "-")

        # Ограничиваем длину и удаляем дефисы по краям
        return result[:200].strip("-")

    def upsert_product(self, product_data: Dict[str, Any]) -> Tuple[Product, bool]:
        """
        Создать или обновить товар в БД.
        
        Args:
            product_data: Словарь с данными товара
            
        Returns:
            Кортеж (Product, is_created) где is_created=True если создан новый
        """
        # Ищем существующий товар по Tilda UID
        existing_product = (
            self.db.query(Product)
            .filter(
                (Product.uid == product_data["uid"]) |
                (Product.tilda_id == product_data["tilda_id"])
            )
            .first()
        )

        if existing_product:
            # === ОБНОВЛЕНИЕ существующего товара ===
            for key, value in product_data.items():
                if hasattr(existing_product, key):
                    setattr(existing_product, key, value)
            
            # Обновляем время синхронизации
            existing_product.last_synced_at = datetime.utcnow()
            existing_product.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(existing_product)
            
            logger.debug(f"Обновлён товар: {existing_product.title}")
            return existing_product, False
        else:
            # === СОЗДАНИЕ нового товара ===
            new_product = Product(
                **product_data,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                last_synced_at=datetime.utcnow(),
            )
            
            self.db.add(new_product)
            self.db.commit()
            self.db.refresh(new_product)
            
            logger.debug(f"Создан товар: {new_product.title}")
            return new_product, True

    def sync_products(self) -> Dict[str, int]:
        """
        Синхронизировать все товары из Tilda API.
        Tilda API использует пагинацию (slice) — нужно загрузить все страницы.
        """
        stats = {
            "created": 0,
            "updated": 0,
            "failed": 0,
            "total": 0,
        }

        slice_num = 0
        total_from_api = 0

        while True:
            slice_num += 1
            logger.info(f"Загрузка slice #{slice_num}...")

            # Запрашиваем с указанием slice
            params = {
                "storepartuid": self.store_part_uid,
                "recid": self.recid,
                "slice": str(slice_num),
            }

            try:
                response = requests.get(self.api_url, params=params, timeout=30)
                response.raise_for_status()
                data = response.json()
            except Exception as e:
                logger.error(f"Ошибка загрузки slice #{slice_num}: {e}")
                break

            products = data.get("products", [])
            total_from_api = data.get("total", total_from_api)
            next_slice = data.get("nextslice")

            logger.info(f"Slice #{slice_num}: получено {len(products)} товаров (всего: {total_from_api})")

            if not products:
                break

            # Обрабатываем каждый товар из текущего slice
            for tilda_product in products:
                try:
                    product_data = self.parse_product(tilda_product)
                    product, is_created = self.upsert_product(product_data)

                    if is_created:
                        stats["created"] += 1
                    else:
                        stats["updated"] += 1

                except Exception as e:
                    logger.error(
                        f"Ошибка синхронизации товара {tilda_product.get('uid')}: {e}",
                        exc_info=True
                    )
                    stats["failed"] += 1

            # Если есть следующий slice — продолжаем
            if next_slice:
                continue
            else:
                break

        stats["total"] = total_from_api

        logger.info(
            f"Синхронизация завершена (slice: {slice_num}): "
            f"создано={stats['created']}, обновлено={stats['updated']}, "
            f"ошибок={stats['failed']}, всего в Tilda={total_from_api}"
        )

        return stats

    def create_sync_log(
        self,
        sync_type: str,
        status: str,
        stats: Dict[str, int],
        error_message: Optional[str] = None,
    ) -> SyncLog:
        """
        Создать запись в логе синхронизации.
        
        Args:
            sync_type: Тип синхронизации ('products', 'categories', etc.)
            status: Статус ('success', 'partial', 'error')
            stats: Статистика синхронизации
            error_message: Сообщение об ошибке (если есть)
            
        Returns:
            Созданный SyncLog
        """
        sync_log = SyncLog(
            sync_type=sync_type,
            status=status,
            items_processed=stats.get("total", 0),
            items_created=stats.get("created", 0),
            items_updated=stats.get("updated", 0),
            items_failed=stats.get("failed", 0),
            error_message=error_message,
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
        )
        
        self.db.add(sync_log)
        self.db.commit()
        self.db.refresh(sync_log)
        
        return sync_log


def sync_all_products(db: Session) -> Dict[str, Any]:
    """
    Выполнить полную синхронизацию товаров (точка входа для API).
    
    Args:
        db: Сессия базы данных
        
    Returns:
        Результат синхронизации со статистикой
    """
    logger.info("=== Запуск синхронизации товаров с Tilda ===")
    started_at = datetime.utcnow()

    # Создаём сервис и выполняем синхронизацию
    sync_service = TildaSyncService(db)
    stats = sync_service.sync_products()

    completed_at = datetime.utcnow()
    duration = (completed_at - started_at).total_seconds()

    # Определяем статус синхронизации
    if stats["failed"] == 0 and stats["total"] > 0:
        status = "success"
        error_message = None
    elif stats["failed"] < stats["total"]:
        status = "partial"
        error_message = f"Не удалось синхронизировать {stats['failed']} из {stats['total']} товаров"
    else:
        status = "error"
        error_message = "Все товары не удалось синхронизировать"

    # Создаём запись в логе
    sync_log = sync_service.create_sync_log(
        sync_type="products",
        status=status,
        stats=stats,
        error_message=error_message,
    )

    logger.info(
        f"=== Синхронизация завершена за {duration:.2f} сек ===\n"
        f"Статус: {status}\n"
        f"Всего: {stats['total']}, Создано: {stats['created']}, "
        f"Обновлено: {stats['updated']}, Ошибок: {stats['failed']}"
    )

    return {
        "status": status,
        "stats": stats,
        "duration_seconds": duration,
        "log_id": sync_log.id,
        "started_at": started_at.isoformat(),
        "completed_at": completed_at.isoformat(),
    }
