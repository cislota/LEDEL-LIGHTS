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
        
        Returns:
            Данные API или None при ошибке
        """
        try:
            # Параметры запроса с пагинацией для получения всех товаров
            params = {
                "storepartuid": self.store_part_uid,
                "recid": self.recid,
                "getparts": "true",
                "size": "500",  # Максимальное количество за раз
                "slice": "0",  # Начиная с первого
            }

            logger.info(f"Запрос к Tilda API: {self.api_url}")
            response = requests.get(self.api_url, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()
            logger.info(f"Tilda API ответ: status={data.get('status')}")

            if data.get("status") == "OK":
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

    def parse_product(self, tilda_product: Dict[str, Any]) -> Dict[str, Any]:
        """
        Преобразовать продукт из формата Tilda в словарь для сохранения в БД.
        
        Args:
            tilda_product: Сырые данные продукта из Tilda API
            
        Returns:
            Словарь с данными для сохранения в БД
        """
        # === Идентификаторы ===
        uid = tilda_product.get("uid")
        recid = tilda_product.get("recid")

        # === Основная информация ===
        title = tilda_product.get("name", "")
        description = tilda_product.get("description", "")

        # Разбиваем название на основную часть и спецификацию
        name_parts = title.split("/")
        name_main = name_parts[0].strip() if name_parts else title
        name_spec = "/".join(name_parts[1:]).strip() if len(name_parts) > 1 else ""

        # === Цена ===
        price = tilda_product.get("price")
        currency = tilda_product.get("currency", "RUB")

        # === Изображения ===
        image_url = None
        gallery = None

        # Обработка основного изображения
        picture = tilda_product.get("picture")
        if picture:
            if isinstance(picture, str):
                image_url = picture
            elif isinstance(picture, dict):
                # Приоритет полей: url -> img -> 1080 -> 600
                image_url = (
                    picture.get("url")
                    or picture.get("img")
                    or picture.get("1080")
                    or picture.get("600")
                )

        # Обработка галереи
        gallery_data = tilda_product.get("gallery")
        if gallery_data:
            if isinstance(gallery_data, (list, dict)):
                gallery = json.dumps(gallery_data, ensure_ascii=False)

        # === Характеристики ===
        specs = None
        specs_data = tilda_product.get("specs")
        if specs_data:
            if isinstance(specs_data, (list, dict)):
                specs = json.dumps(specs_data, ensure_ascii=False)

        # === Категоризация ===
        category = tilda_product.get("category")
        product_type = tilda_product.get("type")

        # === Дополнительные поля ===
        article = tilda_product.get("article")
        brand = tilda_product.get("brand")

        # === Генерация slug ===
        slug = self._generate_slug(title)

        # === Статусы ===
        is_available = tilda_product.get("is_available", True)
        is_visible = tilda_product.get("is_visible", True)

        # === Остаток на складе (если есть) ===
        stock = tilda_product.get("stock", 0)

        return {
            # Идентификаторы
            "uid": uid,
            "recid": recid,
            "tilda_id": uid,  # Дублируем для совместимости
            # Основная информация
            "title": title,
            "slug": slug,
            "description": description[:500] if description else None,
            "text": description,
            "name_main": name_main,
            "name_spec": name_spec,
            # Цена
            "price": float(price) if price else None,
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
            "stock": stock if stock else 0,
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
        Выполнить полную синхронизацию товаров.
        
        Returns:
            Статистика: {created, updated, failed, total}
        """
        stats = {
            "created": 0,
            "updated": 0,
            "failed": 0,
            "total": 0,
        }

        # Получаем данные из Tilda API
        data = self.fetch_products()
        if not data:
            logger.error("Не удалось получить данные из Tilda API")
            return stats

        products_data = data.get("products", [])
        stats["total"] = len(products_data)

        logger.info(f"Начало синхронизации {stats['total']} товаров...")

        # Обрабатываем каждый товар
        for tilda_product in products_data:
            try:
                # Парсим данные
                product_data = self.parse_product(tilda_product)
                
                # Создаём или обновляем
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

        logger.info(
            f"Синхронизация завершена: "
            f"{stats['created']} создано, "
            f"{stats['updated']} обновлено, "
            f"{stats['failed']} ошибок"
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
