# Модель заказа (Order) и статусы
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, Enum, Index
from sqlalchemy.orm import relationship
import enum

try:
    from ..database import Base
except ImportError:
    from database import Base


class OrderStatus(str, enum.Enum):
    """
    Статусы заказа.
    Используются в PostgreSQL как ENUM type.
    Значения — lowercase для соответствия с PostgreSQL ENUM.
    """
    PROCESSING = "processing"  # "В обработке" — по умолчанию
    CONFIRMED = "confirmed"    # "Подтверждён"
    CANCELLED = "cancelled"    # "Отменён"
    COMPLETED = "completed"    # "Выполнен"
    SHIPPED = "shipped"        # "Отправлен"


class Order(Base):
    """
    Модель заказа/заявки от клиента.
    Содержит данные клиента, состав заказа и статус.
    """
    __tablename__ = "orders"

    # === Идентификаторы ===
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=True)  # Человекочитаемый номер

    # === Контактные данные клиента ===
    name = Column(String, nullable=False, index=True)  # Имя
    phone = Column(String, nullable=False, index=True)  # Телефон
    email = Column(String, nullable=True, index=True)  # Email

    # === Дополнительная информация ===
    comment = Column(Text, nullable=True)  # Комментарий к заказу
    company_name = Column(String, nullable=True)  # Название компании (для юрлиц)
    inn = Column(String, nullable=True)  # ИНН (для юрлиц)
    delivery_address = Column(Text, nullable=True)  # Адрес доставки

    # === Статус заказа ===
    status = Column(
        Enum(OrderStatus, values_callable=lambda e: [x.value for x in e]),
        default=OrderStatus.PROCESSING,
        nullable=False,
        index=True
    )

    # === Источник заявки ===
    source = Column(String, nullable=True, index=True)  # 'contact_form', 'quiz', 'product_request', 'website'

    # === Финансы ===
    total_amount = Column(Float, nullable=True)  # Общая сумма заказа
    currency = Column(String, default="RUB")  # Валюта

    # === Временные метки ===
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    status_changed_at = Column(DateTime, nullable=True)  # Время последнего изменения статуса

    # === Менеджер ===
    manager_comment = Column(Text, nullable=True)  # Внутренний комментарий менеджера
    manager_id = Column(Integer, nullable=True)  # ID менеджера (для будущей CRM)

    # === Индексы для производительности ===
    __table_args__ = (
        Index('ix_orders_status_created', 'status', 'created_at'),
        Index('ix_orders_source', 'source'),
    )

    # === Связи ===
    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="selectin"  # Eager loading для позиций
    )

    def __repr__(self):
        return f"<Order(id={self.id}, number='{self.order_number}', status={self.status.value})>"

    def get_status_label(self) -> str:
        """Возвращает человекочитаемое название статуса."""
        labels = {
            OrderStatus.PROCESSING: "В обработке",
            OrderStatus.CONFIRMED: "Подтверждён",
            OrderStatus.CANCELLED: "Отменён",
            OrderStatus.COMPLETED: "Выполнен",
            OrderStatus.SHIPPED: "Отправлен",
        }
        return labels.get(self.status, self.status.value)


class OrderItem(Base):
    """
    Позиция в заказе.
    Связывает заказ с товаром и хранит информацию о количестве и цене.
    """
    __tablename__ = "order_items"

    # === Идентификаторы ===
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)

    # === Связь с товаром ===
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    product_uid = Column(String, nullable=True)  # Tilda UID товара (на случай удаления из БД)

    # === Информация о товаре (снимок на момент заказа) ===
    product_name = Column(String, nullable=False)  # Название товара
    product_sku = Column(String, nullable=True)  # Артикул товара

    # === Количество и цена ===
    quantity = Column(Integer, default=1, nullable=False)
    price = Column(Float, nullable=False)  # Цена за единицу на момент заказа
    subtotal = Column(Float, nullable=True)  # Подытог (quantity * price, вычисляется)

    # === Комментарий к позиции ===
    comment = Column(String, nullable=True)

    # === Временные метки ===
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # === Индексы ===
    __table_args__ = (
        Index('ix_order_items_product', 'product_id', 'order_id'),
    )

    # === Связи ===
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem(id={self.id}, product='{self.product_name}', qty={self.quantity})>"
