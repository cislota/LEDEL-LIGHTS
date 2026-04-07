# Фоновый планировщик для автоматической синхронизации
import logging
import threading
import time
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..services.tilda_sync import sync_all_products

logger = logging.getLogger(__name__)


class TildaSyncScheduler:
    """
    Планировщик для автоматической синхронизации с Tilda API.
    Использует threading.Timer для периодического запуска.
    """

    def __init__(self, interval_minutes: int = 60):
        """
        Инициализация планировщика.

        Args:
            interval_minutes: Интервал между синхронизациями (в минутах)
        """
        self.interval_minutes = interval_minutes
        self._timer: Optional[threading.Timer] = None
        self._running = False
        self._last_sync: Optional[datetime] = None
        self._last_result: Optional[dict] = None

    def start(self) -> None:
        """Запустить планировщик."""
        if self._running:
            logger.warning("Планировщик уже запущен")
            return

        self._running = True
        logger.info(f"Запуск планировщика синхронизации Tilda (интервал: {self.interval_minutes} мин)")

        # Запускаем первый цикл
        self._schedule_next()

    def stop(self) -> None:
        """Остановить планировщик."""
        if self._timer:
            self._timer.cancel()
            self._timer = None

        self._running = False
        logger.info("Планировщик остановлен")

    def _schedule_next(self) -> None:
        """Запланировать следующую синхронизацию."""
        if not self._running:
            return

        self._timer = threading.Timer(
            interval=self.interval_minutes * 60,  # конвертируем в секунды
            function=self._run_sync,
        )
        self._timer.daemon = True  # Завершается при выходе из основного процесса
        self._timer.start()

        logger.info(
            f"Следующая синхронизация запланирована через {self.interval_minutes} минут"
        )

    def _run_sync(self) -> None:
        """
        Выполнить синхронизацию и запланировать следующую.
        Вызывается в отдельном потоке.
        """
        try:
            logger.info("=== Запуск автоматической синхронизации с Tilda ===")
            self._last_sync = datetime.utcnow()

            # Создаём сессию БД
            db = SessionLocal()
            try:
                self._last_result = sync_all_products(db)
                logger.info(f"Автоматическая синхронизация завершена: {self._last_result}")
            finally:
                db.close()

        except Exception as e:
            logger.error(f"Ошибка автоматической синхронизации: {e}", exc_info=True)
            self._last_result = {
                "status": "error",
                "error": str(e),
            }
        finally:
            # Планируем следующую синхронизацию
            self._schedule_next()

    def get_status(self) -> dict:
        """
        Получить статус планировщика.

        Returns:
            Словарь со статусом
        """
        return {
            "running": self._running,
            "interval_minutes": self.interval_minutes,
            "last_sync": self._last_sync.isoformat() if self._last_sync else None,
            "last_result": self._last_result,
            "next_sync": (
                (self._last_sync + timedelta(minutes=self.interval_minutes)).isoformat()
                if self._last_sync
                else None
            ),
        }


# Глобальный экземпляр планировщика
scheduler = TildaSyncScheduler(interval_minutes=60)  # По умолчанию каждый час


def start_scheduler(interval_minutes: int = 60) -> None:
    """
    Запустить глобальный планировщик.
    Вызывается при старте приложения.
    """
    scheduler.interval_minutes = interval_minutes
    scheduler.start()


def stop_scheduler() -> None:
    """Остановить глобальный планировщик."""
    scheduler.stop()


def get_scheduler_status() -> dict:
    """Получить статус планировщика."""
    return scheduler.get_status()
