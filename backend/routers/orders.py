# API роутеры для заказов
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import math

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("", response_model=schemas.OrderListResponse)
def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Получить список заказов с фильтрацией и пагинацией.
    """
    skip = (page - 1) * page_size

    orders = crud.get_orders(
        db=db,
        skip=skip,
        limit=page_size,
        status=status,
        source=source,
    )

    total = crud.get_orders_count(
        db=db,
        status=status,
        source=source,
    )

    return schemas.OrderListResponse(
        items=orders,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    Создать новый заказ.
    """
    return crud.create_order(db=db, order=order)


@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """
    Получить заказ по ID.
    """
    order = crud.get_order(db, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
