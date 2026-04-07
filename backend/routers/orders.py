# API роутеры для заказов
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
import math

from ..database import get_db
from .. import schemas, crud
from ..models.order import OrderStatus
from ..services.auth import require_admin

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("", response_model=schemas.OrderListResponse)
def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    source: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Получить список заказов с фильтрацией и пагинацией.
    Требуется JWT аутентификация администратора.
    """
    skip = (page - 1) * page_size

    # Преобразуем строку статуса в Enum
    status_enum = None
    if status_filter:
        try:
            status_enum = OrderStatus(status_filter)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Неверный статус заказа. Допустимые значения: {[s.value for s in OrderStatus]}"
            )

    orders = crud.get_orders(
        db=db,
        skip=skip,
        limit=page_size,
        status=status_enum,
        source=source,
    )

    total = crud.get_orders_count(
        db=db,
        status=status_enum,
        source=source,
    )

    return schemas.OrderListResponse(
        items=orders,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=schemas.OrderResponse)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
):
    """
    Создать новый заказ.
    Доступно для всех пользователей (публичный эндпоинт).
    """
    try:
        # Преобразуем Pydantic модель в данные для CRUD
        order_data = order.model_dump()
        items = order_data.pop("items", [])
        
        # Создаём заказ через CRUD
        db_order = crud.create_order(
            db=db,
            items=items,
            **order_data,
        )
        
        return db_order
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при создании заказа: {str(e)}"
        )


@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Получить заказ по ID.
    Требуется JWT аутентификация администратора.
    """
    order = crud.get_order(db, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# === Управление статусами заказов (Админ-функции) ===

@router.patch("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status_endpoint(
    order_id: int,
    status_data: schemas.OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Обновить статус заказа.
    Требуется JWT аутентификация администратора.
    
    Статусы:
    - processing: "В обработке" (по умолчанию)
    - confirmed: "Подтверждён"
    - cancelled: "Отменён"
    - completed: "Выполнен"
    - shipped: "Отправлен"
    """
    # Преобразуем строку статуса в Enum
    try:
        new_status = OrderStatus(status_data.status)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Неверный статус заказа. Допустимые значения: {[s.value for s in OrderStatus]}"
        )
    
    # Обновляем статус через CRUD
    order = crud.update_order_status(
        db=db,
        order_id=order_id,
        status=new_status,
        manager_comment=status_data.manager_comment,
    )
    
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order


@router.post("/{order_id}/cancel", response_model=schemas.OrderResponse)
def cancel_order_endpoint(
    order_id: int,
    comment: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Отменить заказ.
    Требуется JWT аутентификация администратора.
    """
    order = crud.cancel_order(
        db=db,
        order_id=order_id,
        manager_comment=comment,
    )
    
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order


@router.post("/{order_id}/complete", response_model=schemas.OrderResponse)
def complete_order_endpoint(
    order_id: int,
    comment: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Завершить заказ.
    Требуется JWT аутентификация администратора.
    """
    order = crud.complete_order(
        db=db,
        order_id=order_id,
        manager_comment=comment,
    )
    
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order


# === Статистика по заказам (Админ-функции) ===

@router.get("/admin/stats/summary", response_model=schemas.APIResponse)
def get_orders_summary(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Получить сводную статистику по заказам.
    Требуется JWT аутентификация администратора.
    """
    # Общее количество
    total = crud.get_orders_count(db)
    
    # По статусам
    status_counts = {}
    for s in OrderStatus:
        count = crud.get_orders_count(db, status=s)
        status_counts[s.value] = count
    
    # Последние заказы
    recent = crud.get_orders(db, limit=5)
    recent_data = [
        {
            "id": o.id,
            "order_number": o.order_number,
            "name": o.name,
            "total_amount": o.total_amount,
            "status": o.status.value,
            "created_at": o.created_at.isoformat(),
        }
        for o in recent
    ]
    
    return schemas.APIResponse(
        success=True,
        message="Статистика получена",
        data={
            "total": total,
            "by_status": status_counts,
            "recent_orders": recent_data,
        },
    )
