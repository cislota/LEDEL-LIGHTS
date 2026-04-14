# Админ-панель на основе SQLAdmin
import json
from typing import Any, Optional

from sqladmin import Admin, ModelView
from sqlalchemy import select
from starlette.requests import Request

from .models import (
    Product,
    Category,
    Order,
    OrderItem,
    QuizResult,
    ContactFormSubmission,
    SyncLog,
)
from .database import engine, get_db
from .config import ADMIN_USERNAME, ADMIN_PASSWORD


# Авторизация (HTTP Basic Auth)


class AdminAuthMiddleware:
    """Middleware для защиты админ-панели"""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope["path"]
            # Защищаем только SQLAdmin (/admin/sql)
            if path.startswith("/admin/sql"):
                # Проверяем авторизацию
                auth = None
                for name, value in scope.get("headers", []):
                    if name == b"authorization":
                        auth = value.decode()
                        break

                if not auth or not self._check_auth(auth):
                    # Возвращаем 401
                    from starlette.responses import Response
                    response = Response(
                        content="Unauthorized",
                        status_code=401,
                        headers={"WWW-Authenticate": "Basic"},
                    )
                    await response(scope, receive, send)
                    return

        await self.app(scope, receive, send)

    def _check_auth(self, auth_header: str) -> bool:
        try:
            scheme, credentials = auth_header.split()
            if scheme.lower() != "basic":
                return False

            import base64
            decoded = base64.b64decode(credentials).decode("utf-8")
            username, password = decoded.split(":", 1)

            return username == ADMIN_USERNAME and password == ADMIN_PASSWORD
        except Exception:
            return False



# Админ-представления



class ProductAdmin(ModelView, model=Product):
    """Админ-панель для управления продуктами"""

    name = "Продукты"
    name_plural = "Продукты"
    icon = "fa-solid fa-box"

    # Отображаемые колонки в списке
    column_list = [
        Product.id,
        Product.title,
        Product.article,
        Product.brand,
        Product.category,
        Product.price,
        Product.is_available,
        Product.is_visible,
    ]

    # Колонки для экспорта
    column_export_list = [
        Product.id,
        Product.title,
        Product.article,
        Product.brand,
        Product.category,
        Product.price,
        Product.is_available,
    ]

    # Поиск по полям
    column_searchable_list = [
        Product.title,
        Product.article,
        Product.brand,
        Product.description,
    ]

    # Фильтры
    column_filters = [
        Product.category,
        Product.brand,
        Product.is_available,
        Product.is_visible,
        Product.created_at,
    ]

    # Сортировка
    column_default_sort = (Product.id, True)

    # Поля для формы создания/редактирования
    form_columns = [
        Product.uid,
        Product.recid,
        Product.title,
        Product.slug,
        Product.description,
        Product.text,
        Product.price,
        Product.currency,
        Product.image_url,
        Product.gallery,
        Product.category,
        Product.type,
        Product.name_main,
        Product.name_spec,
        Product.article,
        Product.brand,
        Product.specs,
        Product.is_available,
        Product.is_visible,
    ]

    # Поля, доступные только для чтения
    column_readonly_list = [Product.uid, Product.recid, Product.created_at, Product.updated_at]

    # Форматирование JSON полей
    column_formatters = {
        Product.gallery: lambda m, a: "📷" if m.gallery else "—",
        Product.specs: lambda m, a: "⚙️" if m.specs else "—",
    }


class CategoryAdmin(ModelView, model=Category):
    """Админ-панель для управления категориями"""

    name = "Категория"
    name_plural = "Категории"
    icon = "fa-solid fa-folder"

    column_list = [
        Category.id,
        Category.name,
        Category.slug,
        Category.is_active,
        Category.sort_order,
        Category.created_at,
    ]

    column_searchable_list = [Category.name, Category.description]
    column_filters = [Category.is_active, Category.parent_id]
    column_default_sort = (Category.sort_order, False)

    form_columns = [
        Category.name,
        Category.slug,
        Category.description,
        Category.parent_id,
        Category.sort_order,
        Category.is_active,
    ]


class OrderItemInline(ModelView, model=OrderItem, inline=True):
    """Inline-представление для позиций заказа"""

    name = "Позиция"
    name_plural = "Позиции"
    icon = "fa-solid fa-list"

    column_list = [
        OrderItem.product_name,
        OrderItem.quantity,
        OrderItem.price,
        OrderItem.comment,
    ]


class OrderAdmin(ModelView, model=Order):
    """Админ-панель для управления заказами"""

    name = "Заказ"
    name_plural = "Заказы"
    icon = "fa-solid fa-cart-shopping"

    column_list = [
        Order.id,
        Order.order_number,
        Order.name,
        Order.phone,
        Order.status,
        Order.source,
        Order.created_at,
    ]

    column_export_list = [
        Order.id,
        Order.order_number,
        Order.name,
        Order.phone,
        Order.email,
        Order.status,
        Order.source,
        Order.created_at,
    ]

    column_searchable_list = [
        Order.name,
        Order.phone,
        Order.email,
        Order.order_number,
    ]

    column_filters = [
        Order.status,
        Order.source,
        Order.created_at,
    ]

    column_default_sort = (Order.created_at, True)

    form_columns = [
        Order.order_number,
        Order.name,
        Order.phone,
        Order.email,
        Order.comment,
        Order.company_name,
        Order.inn,
        Order.status,
        Order.source,
    ]

    # Inline позиции заказа
    form_args = {
        "items": {"label": "Позиции заказа"},
    }

    # Действия
    action_defaults = False
    actions = ["mark_as_new", "mark_as_in_progress", "mark_as_completed", "mark_as_cancelled"]

    async def mark_as_new(self, request: Request, objs: list[Order]) -> None:
        async with self._get_session(request) as session:
            for order in objs:
                order.status = "new"
                session.add(order)
            await session.commit()

    async def mark_as_in_progress(self, request: Request, objs: list[Order]) -> None:
        async with self._get_session(request) as session:
            for order in objs:
                order.status = "in_progress"
                session.add(order)
            await session.commit()

    async def mark_as_completed(self, request: Request, objs: list[Order]) -> None:
        async with self._get_session(request) as session:
            for order in objs:
                order.status = "completed"
                session.add(order)
            await session.commit()

    async def mark_as_cancelled(self, request: Request, objs: list[Order]) -> None:
        async with self._get_session(request) as session:
            for order in objs:
                order.status = "cancelled"
                session.add(order)
            await session.commit()

    async def _get_session(self, request: Request):
        from sqlalchemy.ext.asyncio import AsyncSession
        async with AsyncSession(engine) as session:
            yield session


class QuizResultAdmin(ModelView, model=QuizResult):
    """Админ-панель для результатов квиза"""

    name = "Результат квиза"
    name_plural = "Результаты квиза"
    icon = "fa-solid fa-clipboard-question"

    column_list = [
        QuizResult.id,
        QuizResult.name,
        QuizResult.phone,
        QuizResult.email,
        QuizResult.result_type,
        QuizResult.is_processed,
        QuizResult.created_at,
    ]

    column_searchable_list = [QuizResult.name, QuizResult.phone, QuizResult.email]
    column_filters = [QuizResult.is_processed, QuizResult.result_type, QuizResult.created_at]
    column_default_sort = (QuizResult.created_at, True)

    form_columns = [
        QuizResult.name,
        QuizResult.phone,
        QuizResult.email,
        QuizResult.answers,
        QuizResult.result_type,
        QuizResult.recommended_products,
        QuizResult.is_processed,
        QuizResult.manager_comment,
    ]

    # Форматирование JSON полей
    column_formatters = {
        QuizResult.answers: lambda m, a: "📋" if m.answers else "—",
        QuizResult.recommended_products: lambda m, a: "🎯" if m.recommended_products else "—",
    }

    # Действия
    actions = ["mark_processed", "mark_unprocessed"]

    async def mark_processed(self, request: Request, objs: list[QuizResult]) -> None:
        async with self._get_session(request) as session:
            for result in objs:
                result.is_processed = True
                session.add(result)
            await session.commit()

    async def mark_unprocessed(self, request: Request, objs: list[QuizResult]) -> None:
        async with self._get_session(request) as session:
            for result in objs:
                result.is_processed = False
                session.add(result)
            await session.commit()


class ContactFormAdmin(ModelView, model=ContactFormSubmission):
    """Админ-панель для заявок из форм"""

    name = "Заявка"
    name_plural = "Заявки из форм"
    icon = "fa-solid fa-envelope"

    column_list = [
        ContactFormSubmission.id,
        ContactFormSubmission.name,
        ContactFormSubmission.phone,
        ContactFormSubmission.email,
        ContactFormSubmission.form_type,
        ContactFormSubmission.is_processed,
        ContactFormSubmission.created_at,
    ]

    column_searchable_list = [
        ContactFormSubmission.name,
        ContactFormSubmission.phone,
        ContactFormSubmission.email,
    ]

    column_filters = [
        ContactFormSubmission.is_processed,
        ContactFormSubmission.form_type,
        ContactFormSubmission.created_at,
    ]

    column_default_sort = (ContactFormSubmission.created_at, True)

    form_columns = [
        ContactFormSubmission.name,
        ContactFormSubmission.phone,
        ContactFormSubmission.email,
        ContactFormSubmission.message,
        ContactFormSubmission.subject,
        ContactFormSubmission.form_type,
        ContactFormSubmission.is_processed,
        ContactFormSubmission.manager_comment,
    ]

    # Действия
    actions = ["mark_processed", "mark_unprocessed"]

    async def mark_processed(self, request: Request, objs: list[ContactFormSubmission]) -> None:
        async with self._get_session(request) as session:
            for submission in objs:
                submission.is_processed = True
                session.add(submission)
            await session.commit()

    async def mark_unprocessed(self, request: Request, objs: list[ContactFormSubmission]) -> None:
        async with self._get_session(request) as session:
            for submission in objs:
                submission.is_processed = False
                session.add(submission)
            await session.commit()


class SyncLogAdmin(ModelView, model=SyncLog):
    """Админ-панель для логов синхронизации"""

    name = "Лог синхронизации"
    name_plural = "Логи синхронизации"
    icon = "fa-solid fa-arrows-rotate"

    # Только просмотр
    can_create = False
    can_edit = False
    can_delete = False

    column_list = [
        SyncLog.id,
        SyncLog.sync_type,
        SyncLog.status,
        SyncLog.items_processed,
        SyncLog.items_created,
        SyncLog.items_updated,
        SyncLog.items_failed,
        SyncLog.started_at,
        SyncLog.completed_at,
    ]

    column_filters = [SyncLog.sync_type, SyncLog.status, SyncLog.started_at]
    column_default_sort = (SyncLog.started_at, True)

    column_formatters = {
        SyncLog.status: lambda m, a: (
            "✅" if m.status == "success" else "⚠️" if m.status == "partial" else "❌"
        ),
    }



# Инициализация админ-панели


# Admin будет инициализирован в setup_admin_panel с передачей app
admin: Optional[Admin] = None


def setup_admin_panel(app):
    """Подключить админ-панель к FastAPI приложению.
    
    ВНИМАНИЕ: SQLAdmin доступен по пути /admin/sql
    Основной /admin/* используется Next.js приложением.
    """
    global admin

    # Инициализируем админ-панель на отдельном пути (чтобы не конфликтовать с Next.js)
    admin = Admin(app=app, engine=engine, base_url="/admin/sql")
    
    # Регистрация представлений
    admin.add_view(ProductAdmin)
    admin.add_view(CategoryAdmin)
    admin.add_view(OrderAdmin)
    admin.add_view(QuizResultAdmin)
    admin.add_view(ContactFormAdmin)
    admin.add_view(SyncLogAdmin)

    # Добавляем middleware авторизации
    app.add_middleware(AdminAuthMiddleware)
