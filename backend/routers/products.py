# API роутеры для продуктов
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import math

from ..database import get_db
from .. import schemas, crud

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
