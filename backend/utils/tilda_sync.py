# Утилита синхронизации с Tilda API
import requests
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session

from ..config import TILDA_API_URL, TILDA_STORE_PART_UID, TILDA_RECID
from .. import models, schemas, crud

logger = logging.getLogger(__name__)


class TildaSync:
    """Класс для синхронизации данных с Tilda API"""

    def __init__(self, db: Session):
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

            response = requests.get(self.api_url, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()

            if data.get("status") == "OK":
                return data
            else:
                logger.error(f"Tilda API error: {data}")
                return None

        except requests.RequestException as e:
            logger.error(f"Error fetching products from Tilda: {e}")
            return None

    def parse_product(self, tilda_product: Dict[str, Any]) -> schemas.ProductCreate:
        """
        Преобразовать продукт из формата Tilda в схему продукта.
        """
        # Извлекаем данные из структуры Tilda
        uid = tilda_product.get("uid")
        recid = tilda_product.get("recid")
        title = tilda_product.get("name", "")
        description = tilda_product.get("description", "")
        price = tilda_product.get("price")
        currency = tilda_product.get("currency", "RUB")

        # Изображения
        image_url = None
        gallery = None

        if "picture" in tilda_product:
            pic = tilda_product["picture"]
            if isinstance(pic, str):
                image_url = pic
            elif isinstance(pic, dict):
                image_url = pic.get("url") or pic.get("img") or pic.get("1080")

        if "gallery" in tilda_product:
            gallery_data = tilda_product.get("gallery", [])
            if isinstance(gallery_data, list):
                gallery = json.dumps(gallery_data)
            elif isinstance(gallery_data, dict):
                gallery = json.dumps(gallery_data)

        # Технические характеристики
        specs = None
        if "specs" in tilda_product:
            specs_data = tilda_product.get("specs", [])
            if isinstance(specs_data, list):
                specs = json.dumps(specs_data)
            elif isinstance(specs_data, dict):
                specs = json.dumps(specs_data)

        # Категория и тип
        category = tilda_product.get("category")
        product_type = tilda_product.get("type")

        # Дополнительные поля
        article = tilda_product.get("article")
        brand = tilda_product.get("brand")

        # Создаем slug из названия
        slug = self._generate_slug(title)

        # Доступность
        is_available = tilda_product.get("is_available", True)
        is_visible = tilda_product.get("is_visible", True)

        return schemas.ProductCreate(
            uid=uid,
            recid=recid,
            title=title,
            slug=slug,
            description=description[:500] if description else None,
            text=description,
            price=float(price) if price else None,
            currency=currency,
            image_url=image_url,
            gallery=gallery,
            category=category,
            type=product_type,
            article=article,
            brand=brand,
            specs=specs,
            is_available=is_available,
            is_visible=is_visible,
        )

    def _generate_slug(self, title: str) -> str:
        """Сгенерировать slug из названия"""
        if not title:
            return ""

        # Транслитерация и очистка
        slug = title.lower()

        # Замена русских символов
        translit = {
            "а": "a", "б": "b", "в": "v", "г": "g", "д": "d",
            "е": "e", "ё": "yo", "ж": "zh", "з": "z", "и": "i",
            "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
            "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
            "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch",
            "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "",
            "э": "e", "ю": "yu", "я": "ya",
        }

        result = ""
        for char in slug:
            if char in translit:
                result += translit[char]
            elif char.isalnum() or char in " -_":
                result += char
            else:
                result += "-"

        # Замена пробелов на дефисы
        slug = "-".join(result.split())

        # Удаление повторяющихся дефисов
        while "--" in slug:
            slug = slug.replace("--", "-")

        # Ограничение длины
        return slug[:200].strip("-")

    def sync_products(self) -> Dict[str, int]:
        """
        Синхронизировать продукты с Tilda API.
        Возвращает статистику: {created, updated, failed}
        """
        stats = {"created": 0, "updated": 0, "failed": 0}

        data = self.fetch_products()
        if not data:
            return stats

        products_data = data.get("products", [])

        for tilda_product in products_data:
            try:
                product_schema = self.parse_product(tilda_product)
                product, is_created = crud.upsert_product(
                    db=self.db, product_data=product_schema
                )

                if is_created:
                    stats["created"] += 1
                else:
                    stats["updated"] += 1

            except Exception as e:
                logger.error(f"Error syncing product {tilda_product.get('uid')}: {e}")
                stats["failed"] += 1

        return stats

    def create_sync_log(
        self,
        sync_type: str,
        status: str,
        items_processed: int,
        items_created: int,
        items_updated: int,
        items_failed: int,
        error_message: Optional[str] = None,
    ) -> models.SyncLog:
        """Создать запись лога синхронизации"""
        sync_log = models.SyncLog(
            sync_type=sync_type,
            status=status,
            items_processed=items_processed,
            items_created=items_created,
            items_updated=items_updated,
            items_failed=items_failed,
            error_message=error_message,
        )
        self.db.add(sync_log)
        self.db.commit()
        self.db.refresh(sync_log)
        return sync_log


def sync_all_products(db: Session) -> Dict[str, Any]:
    """
    Выполнить полную синхронизацию продуктов.
    """
    logger.info("Starting products sync...")
    started_at = datetime.utcnow()

    sync = TildaSync(db)
    stats = sync.sync_products()

    completed_at = datetime.utcnow()
    total_processed = stats["created"] + stats["updated"] + stats["failed"]

    # Определяем статус
    if stats["failed"] == 0:
        status = "success"
    elif stats["failed"] < total_processed:
        status = "partial"
    else:
        status = "error"

    # Создаем лог
    sync_log = sync.create_sync_log(
        sync_type="products",
        status=status,
        items_processed=total_processed,
        items_created=stats["created"],
        items_updated=stats["updated"],
        items_failed=stats["failed"],
        error_message=None if status == "success" else f"Failed: {stats['failed']}",
    )

    logger.info(
        f"Sync completed: {stats['created']} created, "
        f"{stats['updated']} updated, {stats['failed']} failed"
    )

    return {
        "status": status,
        "stats": stats,
        "log_id": sync_log.id,
        "started_at": started_at.isoformat(),
        "completed_at": completed_at.isoformat(),
    }
