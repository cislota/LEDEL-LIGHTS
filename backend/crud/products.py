# CRUD операции для продуктов
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_

from .. import models, schemas


def get_product(db: Session, product_id: int) -> Optional[models.Product]:
    """Получить продукт по ID"""
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_product_by_uid(db: Session, uid: str) -> Optional[models.Product]:
    """Получить продукт по UID (Tilda)"""
    return db.query(models.Product).filter(models.Product.uid == uid).first()


def get_product_by_slug(db: Session, slug: str) -> Optional[models.Product]:
    """Получить продукт по slug"""
    return db.query(models.Product).filter(models.Product.slug == slug).first()


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    product_type: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    is_available: Optional[bool] = None,
    is_visible: Optional[bool] = None,
) -> List[models.Product]:
    """
    Получить список продуктов с фильтрацией и пагинацией.
    """
    query = db.query(models.Product)

    if category is not None:
        query = query.filter(models.Product.category == category)

    if product_type is not None:
        query = query.filter(models.Product.type == product_type)

    if brand is not None:
        query = query.filter(models.Product.brand == brand)

    if search is not None:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Product.title.ilike(search_term),
                models.Product.description.ilike(search_term),
                models.Product.article.ilike(search_term),
                models.Product.brand.ilike(search_term),
            )
        )

    if is_available is not None:
        query = query.filter(models.Product.is_available == is_available)

    if is_visible is not None:
        query = query.filter(models.Product.is_visible == is_visible)

    return query.offset(skip).limit(limit).all()


def get_products_count(
    db: Session,
    category: Optional[str] = None,
    product_type: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    is_available: Optional[bool] = None,
    is_visible: Optional[bool] = None,
) -> int:
    """Получить количество продуктов с фильтрацией"""
    query = db.query(models.Product)

    if category is not None:
        query = query.filter(models.Product.category == category)

    if product_type is not None:
        query = query.filter(models.Product.type == product_type)

    if brand is not None:
        query = query.filter(models.Product.brand == brand)

    if search is not None:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Product.title.ilike(search_term),
                models.Product.description.ilike(search_term),
                models.Product.article.ilike(search_term),
                models.Product.brand.ilike(search_term),
            )
        )

    if is_available is not None:
        query = query.filter(models.Product.is_available == is_available)

    if is_visible is not None:
        query = query.filter(models.Product.is_visible == is_visible)

    return query.count()


def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    """Создать новый продукт"""
    db_product = models.Product(
        uid=product.uid,
        recid=product.recid,
        title=product.title,
        slug=product.slug,
        description=product.description,
        text=product.text,
        price=product.price,
        currency=product.currency,
        image_url=product.image_url,
        gallery=product.gallery,
        category=product.category,
        type=product.type,
        name_main=product.name_main,
        name_spec=product.name_spec,
        article=product.article,
        brand=product.brand,
        specs=product.specs,
        is_available=product.is_available,
        is_visible=product.is_visible,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(
    db: Session, product_id: int, product_update: schemas.ProductUpdate
) -> Optional[models.Product]:
    """Обновить продукт"""
    db_product = get_product(db, product_id)
    if db_product is None:
        return None

    update_data = product_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int) -> bool:
    """Удалить продукт"""
    db_product = get_product(db, product_id)
    if db_product is None:
        return False

    db.delete(db_product)
    db.commit()
    return True


def upsert_product(
    db: Session, product_data: schemas.ProductCreate
) -> tuple[models.Product, bool]:
    """
    Создать или обновить продукт по UID.
    Возвращает (продукт, is_created).
    """
    existing = get_product_by_uid(db, product_data.uid)

    if existing:
        # Обновление
        update_data = product_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing, False
    else:
        # Создание
        return create_product(db, product_data), True


def get_categories(db: Session) -> List[str]:
    """Получить список уникальных категорий"""
    result = db.query(models.Product.category).filter(
        models.Product.category.isnot(None)
    ).distinct().all()
    return [cat[0] for cat in result if cat[0]]


def get_brands(db: Session) -> List[str]:
    """Получить список уникальных брендов"""
    result = db.query(models.Product.brand).filter(
        models.Product.brand.isnot(None)
    ).distinct().all()
    return [brand[0] for brand in result if brand[0]]


def get_types(db: Session) -> List[str]:
    """Получить список уникальных типов продуктов"""
    result = db.query(models.Product.type).filter(
        models.Product.type.isnot(None)
    ).distinct().all()
    return [t[0] for t in result if t[0]]
