# API роутеры для продуктов
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
import math

from ..database import get_db
from .. import schemas, crud
from ..services.tilda_sync import sync_all_products
from ..services.auth import require_admin

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=schemas.ProductListResponse)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    product_type: Optional[str] = Query(None, alias="type"),
    brand: Optional[str] = None,
    search: Optional[str] = None,
    is_available: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """
    Получить список продуктов с фильтрацией и пагинацией.
    Данные берутся из локальной БД (синхронизируется с Tilda).
    """
    skip = (page - 1) * page_size

    products = crud.get_products(
        db=db,
        skip=skip,
        limit=page_size,
        category=category,
        product_type=product_type,
        brand=brand,
        search=search,
        is_available=is_available,
        is_visible=True,
    )

    total = crud.get_products_count(
        db=db,
        category=category,
        product_type=product_type,
        brand=brand,
        search=search,
        is_available=is_available,
        is_visible=True,
    )

    pages = math.ceil(total / page_size) if total > 0 else 1

    return schemas.ProductListResponse(
        items=products,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/categories", response_model=List[str])
def get_product_categories(db: Session = Depends(get_db)):
    """Получить список всех категорий продуктов"""
    return crud.get_categories(db)


@router.get("/brands", response_model=List[str])
def get_product_brands(db: Session = Depends(get_db)):
    """Получить список всех брендов"""
    return crud.get_brands(db)


@router.get("/types", response_model=List[str])
def get_product_types(db: Session = Depends(get_db)):
    """Получить список всех типов продуктов"""
    return crud.get_types(db)


@router.get("/{slug}", response_model=schemas.ProductResponse)
def get_product(slug: str, db: Session = Depends(get_db)):
    """
    Получить продукт по slug.
    """
    product = crud.get_product_by_slug(db, slug)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/id/{product_id}", response_model=schemas.ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    """
    Получить продукт по ID.
    """
    product = crud.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# === Админ-функции для управления товарами (защищено JWT) ===

@router.post("/admin/sync/tilda", response_model=schemas.APIResponse)
def sync_tilda_products(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Запустить синхронизацию товаров с Tilda API.
    Требуется JWT аутентификация администратора.
    """
    try:
        result = sync_all_products(db)
        return schemas.APIResponse(
            success=True,
            message="Синхронизация завершена",
            data=result,
        )
    except Exception as e:
        return schemas.APIResponse(
            success=False,
            message=f"Ошибка синхронизации: {str(e)}",
        )


@router.get("/admin/sync/status", response_model=schemas.APIResponse)
def get_sync_status(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Получить статус последней синхронизации.
    Требуется JWT аутентификация администратора.
    """
    from ..models.sync_log import SyncLog

    last_sync = (
        db.query(SyncLog)
        .filter(SyncLog.sync_type == "products")
        .order_by(SyncLog.started_at.desc())
        .first()
    )

    if last_sync:
        return schemas.APIResponse(
            success=True,
            message="Статус синхронизации получен",
            data={
                "sync_type": last_sync.sync_type,
                "status": last_sync.status,
                "items_processed": last_sync.items_processed,
                "items_created": last_sync.items_created,
                "items_updated": last_sync.items_updated,
                "items_failed": last_sync.items_failed,
                "error_message": last_sync.error_message,
                "started_at": last_sync.started_at.isoformat(),
                "completed_at": last_sync.completed_at.isoformat()
                if last_sync.completed_at
                else None,
            },
        )
    else:
        return schemas.APIResponse(
            success=True,
            message="Синхронизация еще не выполнялась",
            data=None,
        )
