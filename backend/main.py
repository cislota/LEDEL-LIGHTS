# LEDS-LIGHTS Backend API
import logging
import atexit
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .config import ALLOWED_ORIGINS, DEBUG
from . import schemas
from .routers import (
    products_router, orders_router, categories_router,
    quiz_router, contact_router, auth_router,
)
from .admin import setup_admin_panel
from .services.scheduler import start_scheduler, stop_scheduler, get_scheduler_status
from .services.auth import require_admin

# Настройка логирования
logging.basicConfig(
    level=logging.INFO if DEBUG else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Управление жизненным циклом приложения.
    Запускаем планировщик при старте, останавливаем при завершении.
    """
    # Startup
    logger.info("Запуск приложения LEDS-LIGHTS API...")
    start_scheduler(interval_minutes=60)  # Синхронизация каждый час
    logger.info("Планировщик синхронизации Tilda запущен")

    yield

    # Shutdown
    logger.info("Остановка приложения...")
    stop_scheduler()
    logger.info("Планировщик остановлен")


# Инициализация приложения
app = FastAPI(
    title="LEDS-LIGHTS API",
    description="API для интернет-магазина светильников",
    version="2.0.0",
    debug=DEBUG,
    lifespan=lifespan,
)

# Настройка CORS (используем ALLOWED_ORIGINS из .env)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(categories_router)
app.include_router(quiz_router)
app.include_router(contact_router)

# Подключение админ-панели
setup_admin_panel(app)


# Health & Info Endpoints

@app.get("/api/health", response_model=schemas.HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """
    Проверка здоровья API.
    """
    from sqlalchemy import text
    
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return schemas.HealthResponse(
        status="ok",
        database=db_status,
        timestamp=datetime.utcnow(),
    )


@app.get("/api/", response_model=schemas.APIResponse)
def root():
    """
    Корневой эндпоинт API.
    """
    return schemas.APIResponse(
        success=True,
        message="LEDS-LIGHTS API v1.0.0",
        data={
            "docs": "/docs",
            "health": "/api/health",
            "init-db": "/api/init-db",
        },
    )


@app.post("/api/init-db", response_model=schemas.APIResponse)
def init_database():
    """
    Инициализировать базу данных (создать все таблицы).
    Выполняется только при подключенной БД.
    """
    try:
        Base.metadata.create_all(bind=engine)
        return schemas.APIResponse(
            success=True,
            message="База данных успешно инициализирована",
            data={"tables": list(Base.metadata.tables.keys())},
        )
    except Exception as e:
        logger.error(f"Database init error: {e}")
        return schemas.APIResponse(
            success=False,
            message=f"Ошибка инициализации БД: {str(e)}",
        )



# Sync Endpoints


@app.post("/api/sync/products", response_model=schemas.APIResponse)
def sync_products(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Синхронизировать продукты с Tilda API.
    Требуется JWT аутентификация администратора.
    """
    try:
        result = sync_all_products(db)
        return schemas.APIResponse(
            success=True,
            message="Синхронизация завершена",
            data=result,
        )
    except Exception as e:
        logger.error(f"Sync error: {e}")
        return schemas.APIResponse(
            success=False,
            message=f"Ошибка синхронизации: {str(e)}",
        )


@app.get("/api/sync/status", response_model=schemas.APIResponse)
def get_sync_status(db: Session = Depends(get_db)):
    """
    Получить статус последней синхронизации.
    """
    from . import models

    last_sync = (
        db.query(models.SyncLog)
        .order_by(models.SyncLog.started_at.desc())
        .first()
    )

    if last_sync:
        return schemas.APIResponse(
            success=True,
            message="Статус синхронизации получен",
            data={
                "sync_type": last_sync.sync_type,
                "status": last_sync.status,
                "items_processed": last_sync.items_processed,
                "items_created": last_sync.items_created,
                "items_updated": last_sync.items_updated,
                "items_failed": last_sync.items_failed,
                "started_at": last_sync.started_at.isoformat(),
                "completed_at": last_sync.completed_at.isoformat()
                if last_sync.completed_at
                else None,
            },
        )
    else:
        return schemas.APIResponse(
            success=True,
            message="Синхронизация еще не выполнялась",
            data=None,
        )


# Scheduler Endpoints (Админ)


@app.get("/api/scheduler/status", response_model=schemas.APIResponse)
def get_scheduler_status_endpoint(
    admin: dict = Depends(require_admin),
):
    """
    Получить статус планировщика автоматической синхронизации.
    Требуется JWT аутентификация администратора.
    """
    status = get_scheduler_status()
    return schemas.APIResponse(
        success=True,
        message="Статус планировщика получен",
        data=status,
    )
