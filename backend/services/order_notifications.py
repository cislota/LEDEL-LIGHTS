# Сервис уведомлений для заказов
import logging
from datetime import datetime
from typing import Optional

from ..models.order import Order, OrderStatus

logger = logging.getLogger(__name__)


def log_order_created(order: Order) -> None:
    """
    Логирование создания заказа (заглушка для будущих уведомлений).
    
    Args:
        order: Созданный заказ
    """
    logger.info(
        f"📦 НОВЫЙ ЗАКАЗ #{order.id} ({order.order_number})\n"
        f"  Клиент: {order.name}\n"
        f"  Телефон: {order.phone}\n"
        f"  Email: {order.email or 'не указан'}\n"
        f"  Сумма: {order.total_amount or 0:.2f} {order.currency}\n"
        f"  Статус: {order.status.value}\n"
        f"  Источник: {order.source or 'не указан'}"
    )
    
    # TODO: Отправка email клиенту
    # TODO: Отправка уведомления менеджеру в Telegram
    # TODO: Создание задачи в CRM


def log_order_status_changed(
    order: Order,
    old_status: OrderStatus,
    new_status: OrderStatus,
) -> None:
    """
    Логирование изменения статуса заказа.
    
    Args:
        order: Заказ
        old_status: Старый статус
        new_status: Новый статус
    """
    status_labels = {
        OrderStatus.PROCESSING: "В обработке",
        OrderStatus.CONFIRMED: "Подтверждён",
        OrderStatus.CANCELLED: "Отменён",
        OrderStatus.COMPLETED: "Выполнен",
        OrderStatus.SHIPPED: "Отправлен",
    }
    
    logger.info(
        f"🔄 СТАТУС ЗАКАЗА #{order.id} изменён\n"
        f"  Заказ: {order.order_number}\n"
        f"  Клиент: {order.name}\n"
        f"  Было: {status_labels.get(old_status, old_status.value)}\n"
        f"  Стало: {status_labels.get(new_status, new_status.value)}\n"
        f"  Менеджер: {order.manager_comment or 'без комментария'}"
    )
    
    # TODO: Отправка email клиенту при смене статуса
    # TODO: Отправка SMS при статусе "Отправлен"
    # TODO: Обновление статуса в CRM


def send_order_confirmation_email(order: Order) -> None:
    """
    Отправка email подтверждения заказа (заглушка).
    
    Args:
        order: Заказ
    """
    if not order.email:
        logger.warning(f"Заказ #{order.id}: email не указан, уведомление не отправлено")
        return
    
    logger.info(
        f"✉️ ОТПРАВКА EMAIL подтверждение заказа #{order.id}\n"
        f"  Получатель: {order.email}\n"
        f"  Номер заказа: {order.order_number}\n"
        f"  Сумма: {order.total_amount or 0:.2f} {order.currency}"
    )
    
    # TODO: Реализовать отправку через SMTP или сервис (SendGrid, etc.)


def send_order_status_email(order: Order) -> None:
    """
    Отправка email о смене статуса заказа (заглушка).
    
    Args:
        order: Заказ
    """
    if not order.email:
        return
    
    logger.info(
        f"✉️ ОТПРАВКА EMAIL о смене статуса заказа #{order.id}\n"
        f"  Получатель: {order.email}\n"
        f"  Новый статус: {order.status.value}"
    )
    
    # TODO: Реализовать отправку


def notify_manager_telegram(order: Order) -> None:
    """
    Уведомление менеджера в Telegram (заглушка).
    
    Args:
        order: Заказ
    """
    logger.info(
        f"🔔 УВЕДОМЛЕНИЕ МЕНЕДЖЕРУ в Telegram\n"
        f"  Новый заказ #{order.id}: {order.name}, {order.phone}"
    )
    
    # TODO: Отправка через Telegram Bot API
