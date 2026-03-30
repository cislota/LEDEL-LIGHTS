# SQLAlchemy модели данных
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from .database import Base


class OrderStatus(str, enum.Enum):
    """Статусы заказа"""
    NEW = "new"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Product(Base):
    """
    Модель товара (светильника).
    Данные синхронизируются с Tilda API.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, unique=True, index=True, nullable=True)  # Tilda UID
    recid = Column(String, nullable=True)  # Tilda RECID
    
    # Основная информация
    title = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=True)
    description = Column(Text, nullable=True)
    text = Column(Text, nullable=True)  # Полное описание
    
    # Цена
    price = Column(Float, nullable=True)
    currency = Column(String, default="RUB")
    
    # Изображения
    image_url = Column(String, nullable=True)
    gallery = Column(Text, nullable=True)  # JSON массив с изображениями
    
    # Категории и тип
    category = Column(String, index=True, nullable=True)
    type = Column(String, nullable=True)  # Тип светильника
    
    # Дополнительные поля из Tilda
    name_main = Column(String, nullable=True)  # Основное название
    name_spec = Column(String, nullable=True)  # Спецификация
    article = Column(String, nullable=True)  # Артикул
    brand = Column(String, nullable=True)  # Бренд
    
    # Технические характеристики (JSON)
    specs = Column(Text, nullable=True)
    
    # Статусы
    is_available = Column(Boolean, default=True)
    is_visible = Column(Boolean, default=True)
    
    # Временные метки
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи
    order_items = relationship("OrderItem", back_populates="product")


class Category(Base):
    """
    Модель категории товаров.
    """
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=True)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Связи
    parent = relationship("Category", remote_side=[id], backref="children")
    # products relationship удалён, т.к. Product.category — это строка, а не ForeignKey


class Order(Base):
    """
    Модель заказа/заявки от клиента.
    """
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=True)
    
    # Контактные данные клиента
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    
    # Дополнительная информация
    comment = Column(Text, nullable=True)
    company_name = Column(String, nullable=True)
    inn = Column(String, nullable=True)
    
    # Статус заказа
    status = Column(String, default=OrderStatus.NEW.value)
    
    # Источник заявки
    source = Column(String, nullable=True)  # 'contact_form', 'quiz', 'product_request', etc.
    
    # Временные метки
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """
    Позиция в заказе.
    """
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    
    # Информация о товаре
    product_name = Column(String, nullable=False)
    product_uid = Column(String, nullable=True)
    
    # Количество и цена
    quantity = Column(Integer, default=1)
    price = Column(Float, nullable=True)
    
    # Комментарий к позиции
    comment = Column(String, nullable=True)
    
    # Связи
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class QuizResult(Base):
    """
    Результаты прохождения квиза.
    """
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    
    # Контактные данные
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Данные квиза (JSON)
    answers = Column(Text, nullable=False)  # JSON с ответами
    result_type = Column(String, nullable=True)  # Тип результата
    recommended_products = Column(Text, nullable=True)  # JSON с рекомендованными товарами
    
    # Статус обработки
    is_processed = Column(Boolean, default=False)
    manager_comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class ContactFormSubmission(Base):
    """
    Заявки из формы обратной связи.
    """
    __tablename__ = "contact_form_submissions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Контактные данные
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Сообщение
    message = Column(Text, nullable=True)
    subject = Column(String, nullable=True)
    
    # Источник формы
    form_type = Column(String, nullable=True)  # 'footer', 'contact_section', etc.
    
    # Статус обработки
    is_processed = Column(Boolean, default=False)
    manager_comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class SyncLog(Base):
    """
    Лог синхронизации с Tilda API.
    """
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, index=True)
    
    # Информация о синхронизации
    sync_type = Column(String, nullable=False)  # 'products', 'categories', etc.
    status = Column(String, nullable=False)  # 'success', 'error', 'partial'
    
    # Статистика
    items_processed = Column(Integer, default=0)
    items_created = Column(Integer, default=0)
    items_updated = Column(Integer, default=0)
    items_failed = Column(Integer, default=0)
    
    # Ошибки
    error_message = Column(Text, nullable=True)
    
    # Временные метки
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
