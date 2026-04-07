# Pydantic схемы для валидации данных

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from enum import Enum


# Product Schemas

class ProductBase(BaseModel):
    """Базовая схема продукта"""
    title: str = Field(..., min_length=1, max_length=500)
    slug: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    text: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    currency: str = "RUB"
    image_url: Optional[str] = None
    gallery: Optional[str] = None  # JSON string
    category: Optional[str] = None
    type: Optional[str] = None
    name_main: Optional[str] = None
    name_spec: Optional[str] = None
    article: Optional[str] = None
    brand: Optional[str] = None
    specs: Optional[str] = None  # JSON string
    is_available: bool = True
    is_visible: bool = True


class ProductCreate(ProductBase):
    """Схема для создания продукта"""
    uid: Optional[str] = None
    recid: Optional[str] = None


class ProductUpdate(BaseModel):
    """Схема для обновления продукта"""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    slug: Optional[str] = None
    description: Optional[str] = None
    text: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    image_url: Optional[str] = None
    gallery: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    name_main: Optional[str] = None
    name_spec: Optional[str] = None
    article: Optional[str] = None
    brand: Optional[str] = None
    specs: Optional[str] = None
    is_available: Optional[bool] = None
    is_visible: Optional[bool] = None


class ProductResponse(ProductBase):
    """Схема ответа продукта"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    uid: Optional[str] = None
    recid: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ProductListResponse(BaseModel):
    """Схема списка продуктов с пагинацией"""
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int



# Category Schemas


class CategoryBase(BaseModel):
    """Базовая схема категории"""
    name: str = Field(..., min_length=1, max_length=200)
    slug: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    """Схема для создания категории"""
    pass


class CategoryUpdate(BaseModel):
    """Схема для обновления категории"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    slug: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    """Схема ответа категории"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: datetime
    children: List["CategoryResponse"] = []



# Order Schemas


class OrderStatusEnum(str, Enum):
    """
    Статусы заказа.
    Соответствуют OrderStatus в models.order
    """
    PROCESSING = "processing"  # В обработке
    CONFIRMED = "confirmed"    # Подтверждён
    CANCELLED = "cancelled"    # Отменён
    COMPLETED = "completed"    # Выполнен
    SHIPPED = "shipped"        # Отправлен


class OrderItemBase(BaseModel):
    """Базовая схема позиции заказа"""
    product_id: Optional[int] = None
    product_name: str
    product_uid: Optional[str] = None
    quantity: int = Field(1, ge=1)
    price: Optional[float] = Field(None, ge=0)
    comment: Optional[str] = None


class OrderItemCreate(OrderItemBase):
    """Схема для создания позиции заказа"""
    pass


class OrderBase(BaseModel):
    """Базовая схема заказа"""
    name: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=10, max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    comment: Optional[str] = None
    company_name: Optional[str] = None
    inn: Optional[str] = None
    source: Optional[str] = None


class OrderCreate(OrderBase):
    """Схема для создания заказа"""
    items: List[OrderItemCreate] = []


class OrderUpdate(BaseModel):
    """Схема для обновления заказа"""
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    comment: Optional[str] = None
    status: Optional[OrderStatusEnum] = None
    company_name: Optional[str] = None
    inn: Optional[str] = None
    manager_comment: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    """Схема для обновления статуса заказа"""
    status: OrderStatusEnum
    manager_comment: Optional[str] = None


class OrderItemResponse(OrderItemBase):
    """Схема ответа позиции заказа"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    order_id: int


class OrderResponse(OrderBase):
    """Схема ответа заказа"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: Optional[str] = None
    status: str
    source: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []
    
    # Новые поля
    total_amount: Optional[float] = None
    currency: str = "RUB"
    delivery_address: Optional[str] = None
    manager_comment: Optional[str] = None
    status_changed_at: Optional[datetime] = None


class OrderListResponse(BaseModel):
    """Схема списка заказов"""
    items: List[OrderResponse]
    total: int
    page: int
    page_size: int



# Quiz Result Schemas


class QuizResultBase(BaseModel):
    """Базовая схема результата квиза"""
    name: Optional[str] = Field(None, max_length=200)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    answers: str  # JSON string
    result_type: Optional[str] = None
    recommended_products: Optional[str] = None  # JSON string


class QuizResultCreate(QuizResultBase):
    """Схема для создания результата квиза"""
    pass


class QuizResultResponse(QuizResultBase):
    """Схема ответа результата квиза"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    is_processed: bool
    manager_comment: Optional[str] = None
    created_at: datetime



# Contact Form Schemas


class ContactFormBase(BaseModel):
    """Базовая схема формы обратной связи"""
    name: str = Field(..., min_length=1, max_length=200)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    message: Optional[str] = None
    subject: Optional[str] = None
    form_type: Optional[str] = None


class ContactFormCreate(ContactFormBase):
    """Схема для создания заявки из формы"""
    pass


class ContactFormResponse(ContactFormBase):
    """Схема ответа заявки из формы"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    is_processed: bool
    manager_comment: Optional[str] = None
    created_at: datetime



# Sync Log Schemas


class SyncLogBase(BaseModel):
    """Базовая схема лога синхронизации"""
    sync_type: str
    status: str
    items_processed: int = 0
    items_created: int = 0
    items_updated: int = 0
    items_failed: int = 0
    error_message: Optional[str] = None


class SyncLogResponse(SyncLogBase):
    """Схема ответа лога синхронизации"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    started_at: datetime
    completed_at: Optional[datetime] = None



# API Response Schemas


class APIResponse(BaseModel):
    """Базовая схема ответа API"""
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None


class HealthResponse(BaseModel):
    """Схема ответа health check"""
    status: str
    database: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# Auth Schemas


class LoginRequest(BaseModel):
    """Схема для запроса логина"""
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """Схема для ответа с токеном"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # секунды до истечения
