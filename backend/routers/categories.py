# API роутеры для категорий
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=List[schemas.CategoryResponse])
def list_categories(
    parent_id: Optional[int] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db),
):
    """
    Получить список категорий.
    """
    return crud.get_categories(
        db=db,
        parent_id=parent_id,
        is_active=is_active,
    )


@router.get("/tree", response_model=List[schemas.CategoryResponse])
def get_categories_tree(db: Session = Depends(get_db)):
    """
    Получить дерево категорий (только активные корневые категории).
    """
    return crud.get_categories_tree(db)


@router.get("/{category_id}", response_model=schemas.CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """
    Получить категорию по ID.
    """
    category = crud.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/slug/{slug}", response_model=schemas.CategoryResponse)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    """
    Получить категорию по slug.
    """
    category = crud.get_category_by_slug(db, slug)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category
