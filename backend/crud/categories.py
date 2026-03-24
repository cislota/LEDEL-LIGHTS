# CRUD операции для категорий
from typing import Optional, List
from sqlalchemy.orm import Session

from .. import models, schemas


def get_category(db: Session, category_id: int) -> Optional[models.Category]:
    """Получить категорию по ID"""
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def get_category_by_slug(db: Session, slug: str) -> Optional[models.Category]:
    """Получить категорию по slug"""
    return db.query(models.Category).filter(models.Category.slug == slug).first()


def get_categories(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    parent_id: Optional[int] = None,
    is_active: Optional[bool] = None,
) -> List[models.Category]:
    """Получить список категорий с фильтрацией"""
    query = db.query(models.Category)

    if parent_id is not None:
        query = query.filter(models.Category.parent_id == parent_id)

    if is_active is not None:
        query = query.filter(models.Category.is_active == is_active)

    return query.order_by(models.Category.sort_order).offset(skip).limit(limit).all()


def get_categories_tree(db: Session) -> List[models.Category]:
    """Получить дерево категорий (только корневые)"""
    return (
        db.query(models.Category)
        .filter(models.Category.parent_id.is_(None))
        .filter(models.Category.is_active == True)
        .order_by(models.Category.sort_order)
        .all()
    )


def create_category(db: Session, category: schemas.CategoryCreate) -> models.Category:
    """Создать новую категорию"""
    db_category = models.Category(
        name=category.name,
        slug=category.slug,
        description=category.description,
        parent_id=category.parent_id,
        sort_order=category.sort_order,
        is_active=category.is_active,
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def update_category(
    db: Session, category_id: int, category_update: schemas.CategoryUpdate
) -> Optional[models.Category]:
    """Обновить категорию"""
    db_category = get_category(db, category_id)
    if db_category is None:
        return None

    update_data = category_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_category, field, value)

    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int) -> bool:
    """Удалить категорию"""
    db_category = get_category(db, category_id)
    if db_category is None:
        return False

    db.delete(db_category)
    db.commit()
    return True
