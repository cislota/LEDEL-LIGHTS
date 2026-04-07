# Модель товара (Product)
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, Index
from sqlalchemy.orm import relationship

try:
    from ..database import Base
except ImportError:
    from database import Base


class Product(Base):
    """
    Модель товара (светильника).
    Данные синхронизируются с Tilda API.
    """
    __tablename__ = "products"

    # === Идентификаторы ===
    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, unique=True, index=True, nullable=True)  # Tilda UID
    recid = Column(String, nullable=True)  # Tilda RECID
    tilda_id = Column(String, unique=True, index=True, nullable=True)  # Алиас для uid

    # === Основная информация ===
    title = Column(String, index=True, nullable=False)  # Название из Tilda (name)
    slug = Column(String, unique=True, index=True, nullable=True)  # URL-слаг (генерируется)
    description = Column(Text, nullable=True)  # Краткое описание (до 500 символов)
    text = Column(Text, nullable=True)  # Полное описание

    # === Название (разбитое на части) ===
    name_main = Column(String, nullable=True)  # Основная часть (до "/")
    name_spec = Column(String, nullable=True)  # Спецификация (после "/")

    # === Цена ===
    price = Column(Float, nullable=True)  # Цена в рублях
    currency = Column(String, default="RUB")  # Валюта

    # === Изображения ===
    image_url = Column(String, nullable=True)  # Основное изображение
    gallery = Column(Text, nullable=True)  # JSON массив с изображениями

    # === Категоризация ===
    category = Column(String, index=True, nullable=True)  # Категория из Tilda
    type = Column(String, nullable=True)  # Тип светильника
    brand = Column(String, nullable=True)  # Бренд

    # === Характеристики ===
    article = Column(String, nullable=True)  # Артикул
    specs = Column(Text, nullable=True)  # JSON с техническими характеристиками

    # === Статусы ===
    is_available = Column(Boolean, default=True)  # Доступность (из Tilda)
    is_visible = Column(Boolean, default=True)  # Видимость на сайте
    stock = Column(Integer, default=0)  # Остаток на складе (если есть в Tilda)

    # === Временные метки ===
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_synced_at = Column(DateTime, nullable=True)  # Время последней синхронизации

    # === Индексы для производительности ===
    __table_args__ = (
        Index('ix_products_category_type', 'category', 'type'),
        Index('ix_products_price', 'price'),
        Index('ix_products_is_available', 'is_available'),
    )

    # === Связи ===
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Product(id={self.id}, title='{self.title}', price={self.price})>"
