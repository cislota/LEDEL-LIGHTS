# Routers package initialization
from .products import router as products_router
from .orders import router as orders_router
from .categories import router as categories_router
from .quiz import router as quiz_router
from .contact import router as contact_router
from .auth import router as auth_router

__all__ = [
    "products_router",
    "orders_router",
    "categories_router",
    "quiz_router",
    "contact_router",
    "auth_router",
]
