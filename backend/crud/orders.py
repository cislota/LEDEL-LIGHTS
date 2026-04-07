# CRUD операции для заказов
from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..models.order import Order, OrderItem, OrderStatus
from ..models.product import Product


# === Чтение ===

def get_order(db: Session, order_id: int) -> Optional[Order]:
    """
    Получить заказ по ID.
    
    Args:
        db: Сессия БД
        order_id: ID заказа
        
    Returns:
        Заказ или None
    """
    return (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )


def get_order_by_number(db: Session, order_number: str) -> Optional[Order]:
    """
    Получить заказ по номеру.
    
    Args:
        db: Сессия БД
        order_number: Номер заказа
        
    Returns:
        Заказ или None
    """
    return (
        db.query(Order)
        .filter(Order.order_number == order_number)
        .first()
    )


def get_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[OrderStatus] = None,
    source: Optional[str] = None,
) -> List[Order]:
    """
    Получить список заказов с фильтрацией и пагинацией.
    
    Args:
        db: Сессия БД
        skip: Пропустить N записей
        limit: Максимум записей
        status: Фильтр по статусу
        source: Фильтр по источнику
        
    Returns:
        Список заказов
    """
    query = db.query(Order)

    if status is not None:
        query = query.filter(Order.status == status)

    if source is not None:
        query = query.filter(Order.source == source)

    # Сортировка по дате создания (новые сверху)
    query = query.order_by(desc(Order.created_at))

    return query.offset(skip).limit(limit).all()


def get_orders_count(
    db: Session,
    status: Optional[OrderStatus] = None,
    source: Optional[str] = None,
) -> int:
    """
    Получить количество заказов с фильтрацией.
    
    Args:
        db: Сессия БД
        status: Фильтр по статусу
        source: Фильтр по источнику
        
    Returns:
        Количество заказов
    """
    query = db.query(Order)

    if status is not None:
        query = query.filter(Order.status == status)

    if source is not None:
        query = query.filter(Order.source == source)

    return query.count()


# === Создание ===

def generate_order_number(db: Session) -> str:
    """
    Сгенерировать уникальный номер заказа.
    Формат: ORD-YYYYMMDD-XXXX
    
    Args:
        db: Сессия БД
        
    Returns:
        Номер заказа
    """
    date_str = datetime.now().strftime("%Y%m%d")
    
    # Ищем последний заказ за сегодня
    last_order = (
        db.query(Order)
        .filter(Order.order_number.like(f"ORD-{date_str}-%"))
        .order_by(desc(Order.id))
        .first()
    )

    if last_order and last_order.order_number:
        # Извлекаем номер из формата ORD-YYYYMMDD-XXXX
        try:
            parts = last_order.order_number.split("-")
            last_num = int(parts[-1])
            new_num = last_num + 1
        except (ValueError, IndexError):
            new_num = 1
    else:
        new_num = 1

    return f"ORD-{date_str}-{new_num:04d}"


def create_order(
    db: Session,
    name: str,
    phone: str,
    email: Optional[str] = None,
    comment: Optional[str] = None,
    company_name: Optional[str] = None,
    inn: Optional[str] = None,
    delivery_address: Optional[str] = None,
    source: Optional[str] = None,
    items: Optional[List[Dict[str, Any]]] = None,
) -> Order:
    """
    Создать новый заказ.
    
    Args:
        db: Сессия БД
        name: Имя клиента
        phone: Телефон
        email: Email (опционально)
        comment: Комментарий
        company_name: Название компании
        inn: ИНН
        delivery_address: Адрес доставки
        source: Источник заявки
        items: Список позиций заказа
        
    Returns:
        Созданный заказ
    """
    # Генерируем номер заказа
    order_number = generate_order_number(db)

    # Создаём заказ
    db_order = Order(
        order_number=order_number,
        name=name,
        phone=phone,
        email=email,
        comment=comment,
        company_name=company_name,
        inn=inn,
        delivery_address=delivery_address,
        source=source,
        status=OrderStatus.PROCESSING,  # По умолчанию "В обработке"
        total_amount=0.0,  # Будет вычислено после добавления позиций
    )

    db.add(db_order)
    db.flush()  # Получаем ID заказа

    # Добавляем позиции заказа
    total_amount = 0.0
    
    if items:
        for item_data in items:
            product_id = item_data.get("product_id")
            product_uid = item_data.get("product_uid")
            
            # Ищем товар в БД
            product = None
            if product_id:
                product = db.query(Product).filter(Product.id == product_id).first()
            elif product_uid:
                product = db.query(Product).filter(
                    (Product.uid == product_uid) | (Product.tilda_id == product_uid)
                ).first()
            
            # Создаём позицию
            db_item = OrderItem(
                order_id=db_order.id,
                product_id=product.id if product else None,
                product_uid=product.uid if product else product_uid,
                product_name=item_data.get("product_name") or (product.title if product else "Товар не найден"),
                product_sku=product.article if product else item_data.get("product_sku"),
                quantity=item_data.get("quantity", 1),
                price=item_data.get("price") or (product.price if product else 0),
                comment=item_data.get("comment"),
            )
            
            # Вычисляем подытог
            db_item.subtotal = db_item.quantity * db_item.price
            total_amount += db_item.subtotal
            
            db.add(db_item)

    # Обновляем общую сумму заказа
    db_order.total_amount = total_amount

    db.commit()
    db.refresh(db_order)

    # Логирование создания заказа
    from ..services.order_notifications import log_order_created
    log_order_created(db_order)

    return db_order


# === Обновление ===

def update_order_status(
    db: Session,
    order_id: int,
    status: OrderStatus,
    manager_comment: Optional[str] = None,
) -> Optional[Order]:
    """
    Обновить статус заказа.
    
    Args:
        db: Сессия БД
        order_id: ID заказа
        status: Новый статус
        manager_comment: Комментарий менеджера
        
    Returns:
        Обновлённый заказ или None
    """
    db_order = get_order(db, order_id)
    
    if db_order is None:
        return None

    old_status = db_order.status
    
    # Обновляем статус
    db_order.status = status
    db_order.status_changed_at = datetime.utcnow()
    
    # Обновляем комментарий менеджера
    if manager_comment is not None:
        db_order.manager_comment = manager_comment

    db.commit()
    db.refresh(db_order)

    # Логирование изменения статуса
    from ..services.order_notifications import log_order_status_changed
    log_order_status_changed(db_order, old_status, status)

    return db_order


def update_order(
    db: Session,
    order_id: int,
    **kwargs,
) -> Optional[Order]:
    """
    Обновить заказ (произвольные поля).
    
    Args:
        db: Сессия БД
        order_id: ID заказа
        **kwargs: Поля для обновления
        
    Returns:
        Обновлённый заказ или None
    """
    db_order = get_order(db, order_id)
    
    if db_order is None:
        return None

    # Обновляем переданные поля
    for field, value in kwargs.items():
        if hasattr(db_order, field):
            setattr(db_order, field, value)

    db_order.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(db_order)

    return db_order


# === Удаление ===

def cancel_order(
    db: Session,
    order_id: int,
    manager_comment: Optional[str] = None,
) -> Optional[Order]:
    """
    Отменить заказ.
    
    Args:
        db: Сессия БД
        order_id: ID заказа
        manager_comment: Комментарий менеджера
        
    Returns:
        Отменённый заказ или None
    """
    return update_order_status(
        db,
        order_id,
        OrderStatus.CANCELLED,
        manager_comment,
    )


def complete_order(
    db: Session,
    order_id: int,
    manager_comment: Optional[str] = None,
) -> Optional[Order]:
    """
    Завершить заказ.
    
    Args:
        db: Сессия БД
        order_id: ID заказа
        manager_comment: Комментарий менеджера
        
    Returns:
        Завершённый заказ или None
    """
    return update_order_status(
        db,
        order_id,
        OrderStatus.COMPLETED,
        manager_comment,
    )
