# CRUD операции для заказов
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session

from .. import models, schemas


def get_order(db: Session, order_id: int) -> Optional[models.Order]:
    """Получить заказ по ID"""
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def get_order_by_number(db: Session, order_number: str) -> Optional[models.Order]:
    """Получить заказ по номеру"""
    return db.query(models.Order).filter(models.Order.order_number == order_number).first()


def get_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    source: Optional[str] = None,
) -> List[models.Order]:
    """Получить список заказов с фильтрацией"""
    query = db.query(models.Order)

    if status is not None:
        query = query.filter(models.Order.status == status)

    if source is not None:
        query = query.filter(models.Order.source == source)

    return query.order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()


def get_orders_count(
    db: Session,
    status: Optional[str] = None,
    source: Optional[str] = None,
) -> int:
    """Получить количество заказов"""
    query = db.query(models.Order)

    if status is not None:
        query = query.filter(models.Order.status == status)

    if source is not None:
        query = query.filter(models.Order.source == source)

    return query.count()


def generate_order_number(db: Session) -> str:
    """Сгенерировать номер заказа"""
    date_str = datetime.now().strftime("%Y%m%d")
    last_order = (
        db.query(models.Order)
        .filter(models.Order.order_number.like(f"ORD-{date_str}-%"))
        .order_by(models.Order.id.desc())
        .first()
    )

    if last_order and last_order.order_number:
        try:
            last_num = int(last_order.order_number.split("-")[-1])
            new_num = last_num + 1
        except (ValueError, IndexError):
            new_num = 1
    else:
        new_num = 1

    return f"ORD-{date_str}-{new_num:04d}"


def create_order(db: Session, order: schemas.OrderCreate) -> models.Order:
    """Создать новый заказ"""
    order_number = generate_order_number(db)

    db_order = models.Order(
        order_number=order_number,
        name=order.name,
        phone=order.phone,
        email=order.email,
        comment=order.comment,
        company_name=order.company_name,
        inn=order.inn,
        source=order.source,
        status=models.OrderStatus.NEW.value,
    )
    db.add(db_order)
    db.flush()  # Получаем ID заказа

    # Добавляем позиции заказа
    for item_data in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item_data.product_id,
            product_name=item_data.product_name,
            product_uid=item_data.product_uid,
            quantity=item_data.quantity,
            price=item_data.price,
            comment=item_data.comment,
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)
    return db_order


def update_order(
    db: Session, order_id: int, order_update: schemas.OrderUpdate
) -> Optional[models.Order]:
    """Обновить заказ"""
    db_order = get_order(db, order_id)
    if db_order is None:
        return None

    update_data = order_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_order, field, value)

    db.commit()
    db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: int) -> bool:
    """Удалить заказ"""
    db_order = get_order(db, order_id)
    if db_order is None:
        return False

    db.delete(db_order)
    db.commit()
    return True


def add_order_item(
    db: Session,
    order_id: int,
    item_data: schemas.OrderItemCreate,
) -> Optional[models.OrderItem]:
    """Добавить позицию в заказ"""
    db_order = get_order(db, order_id)
    if db_order is None:
        return None

    db_item = models.OrderItem(
        order_id=order_id,
        product_id=item_data.product_id,
        product_name=item_data.product_name,
        product_uid=item_data.product_uid,
        quantity=item_data.quantity,
        price=item_data.price,
        comment=item_data.comment,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def remove_order_item(db: Session, order_id: int, item_id: int) -> bool:
    """Удалить позицию из заказа"""
    db_item = (
        db.query(models.OrderItem)
        .filter(
            models.OrderItem.id == item_id,
            models.OrderItem.order_id == order_id,
        )
        .first()
    )
    if db_item is None:
        return False

    db.delete(db_item)
    db.commit()
    return True
