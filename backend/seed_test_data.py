#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Скрипт для заполнения БД тестовыми данными.
Запускать из папки backend:
    cd backend
    python seed_test_data.py
"""
import sys
import os
import json
from datetime import datetime, timedelta

# Добавляем корень проекта в путь
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models.product import Product
from models.order import Order, OrderItem, OrderStatus
from models.quiz_result import QuizResult
from models.contact_form import ContactFormSubmission
from models.sync_log import SyncLog

db = SessionLocal()


def seed_products():
    """Создаём тестовые товары"""
    print("📦 Создание товаров...")

    products = [
        {
            "uid": "tilda-001",
            "tilda_id": "tilda-001",
            "title": "Светильник L-street Pro / 50W / IP65",
            "slug": "svetilnik-l-street-pro-50w-ip65",
            "name_main": "Светильник L-street Pro",
            "name_spec": "50W / IP65",
            "description": "Уличный светодиодный светильник для освещения дорог и парковок",
            "text": "Профессиональный светодиодный светильник для уличного освещения. Мощность 50Вт, защита IP65. Срок службы 50 000 часов.",
            "price": 15000.00,
            "currency": "RUB",
            "image_url": "https://via.placeholder.com/600x400/d5302c/ffffff?text=L-street+Pro",
            "category": "Уличное освещение",
            "type": "Светильник",
            "brand": "Ledel",
            "article": "L-STR-50W",
            "is_available": True,
            "is_visible": True,
            "stock": 150,
        },
        {
            "uid": "tilda-002",
            "tilda_id": "tilda-002",
            "title": "Светильник L-office Premium / 40W",
            "slug": "svetilnik-l-office-premium-40w",
            "name_main": "Светильник L-office Premium",
            "name_spec": "40W",
            "description": "Офисный светодиодный светильник с равномерным освещением",
            "text": "Офисный светильник с мощностью 40Вт. Равномерное освещение без мерцания. Подходит для офисов, школ, больниц.",
            "price": 8500.00,
            "currency": "RUB",
            "image_url": "https://via.placeholder.com/600x400/2196f3/ffffff?text=L-office+Premium",
            "category": "Офисное освещение",
            "type": "Светильник",
            "brand": "Ledel",
            "article": "L-OFF-40W",
            "is_available": True,
            "is_visible": True,
            "stock": 300,
        },
        {
            "uid": "tilda-003",
            "tilda_id": "tilda-003",
            "title": "Прожектор L-fusion Retail / 100W",
            "slug": "prozhktor-l-fusion-retail-100w",
            "name_main": "Прожектор L-fusion Retail",
            "name_spec": "100W",
            "description": "Прожектор для коммерческого освещения магазинов и ТЦ",
            "text": "Мощный прожектор для коммерческого использования. 100Вт, высокая яркость, точечное освещение.",
            "price": 25000.00,
            "currency": "RUB",
            "image_url": "https://via.placeholder.com/600x400/4caf50/ffffff?text=L-fusion+Retail",
            "category": "Коммерческое освещение",
            "type": "Прожектор",
            "brand": "Ledel",
            "article": "L-FUS-100W",
            "is_available": True,
            "is_visible": True,
            "stock": 75,
        },
        {
            "uid": "tilda-004",
            "tilda_id": "tilda-004",
            "title": "Светильник L-contour Facade / 30W",
            "slug": "svetilnik-l-contour-facade-30w",
            "name_main": "Светильник L-contour Facade",
            "name_spec": "30W",
            "description": "Архитектурный светильник для подсветки фасадов зданий",
            "text": "Архитектурно-парковый светильник для декоративной подсветки фасадов. Мощность 30Вт, широкий угол рассеивания.",
            "price": 12000.00,
            "currency": "RUB",
            "image_url": "https://via.placeholder.com/600x400/ff9800/ffffff?text=L-contour+Facade",
            "category": "Архитектурно-парковое освещение",
            "type": "Светильник",
            "brand": "Ledel",
            "article": "L-CON-30W",
            "is_available": True,
            "is_visible": True,
            "stock": 200,
        },
        {
            "uid": "tilda-005",
            "tilda_id": "tilda-005",
            "title": "Прожектор L-industrial / 200W",
            "slug": "prozhktor-l-industrial-200w",
            "name_main": "Прожектор L-industrial",
            "name_spec": "200W",
            "description": "Промышленный прожектор для складов и производственных помещений",
            "text": "Мощный промышленный прожектор. 200Вт, IP54, для складов, цехов, производственных помещений.",
            "price": 45000.00,
            "currency": "RUB",
            "image_url": "https://via.placeholder.com/600x400/9c27b0/ffffff?text=L-industrial",
            "category": "Промышленное освещение",
            "type": "Прожектор",
            "brand": "Ledel",
            "article": "L-IND-200W",
            "is_available": True,
            "is_visible": True,
            "stock": 50,
        },
    ]

    for data in products:
        product = db.query(Product).filter(Product.uid == data["uid"]).first()
        if not product:
            product = Product(**data, created_at=datetime.utcnow(), updated_at=datetime.utcnow())
            db.add(product)
            print(f"  ✅ Добавлен: {data['title']}")
        else:
            print(f"  ⏭️ Пропущен: {data['title']} (уже есть)")

    db.commit()
    print(f"  📊 Всего товаров: {db.query(Product).count()}\n")


def seed_orders():
    """Создаём тестовые заказы"""
    print("🛒 Создание заказов...")

    products = db.query(Product).all()

    orders = [
        {
            "order_number": "ORD-20260407-0001",
            "name": "Иван Петров",
            "phone": "+79991234567",
            "email": "ivan@example.com",
            "comment": "Доставка после 18:00",
            "status": OrderStatus.PROCESSING,
            "source": "website",
        },
        {
            "order_number": "ORD-20260407-0002",
            "name": "ООО «СветСтрой»",
            "phone": "+74951234567",
            "email": "info@svetstroy.ru",
            "comment": "Освещение для торгового центра, 50 шт",
            "company_name": "ООО «СветСтрой»",
            "inn": "7701234567",
            "status": OrderStatus.CONFIRMED,
            "source": "quiz",
            "delivery_address": "г. Москва, ул. Ленина, д. 10",
        },
        {
            "order_number": "ORD-20260407-0003",
            "name": "Мария Сидорова",
            "phone": "+79123456789",
            "email": "maria.s@example.com",
            "status": OrderStatus.COMPLETED,
            "source": "contact_form",
            "delivery_address": "г. Санкт-Петербург, Невский пр., д. 25",
        },
        {
            "order_number": "ORD-20260407-0004",
            "name": "Алексей Козлов",
            "phone": "+79234567890",
            "email": "alex.kozlov@mail.ru",
            "comment": "Нужна консультация по выбору",
            "status": OrderStatus.CANCELLED,
            "source": "website",
        },
        {
            "order_number": "ORD-20260407-0005",
            "name": "ИП Смирнов А.В.",
            "phone": "+79345678901",
            "email": "smirnov@business.ru",
            "company_name": "ИП Смирнов А.В.",
            "inn": "770123456789",
            "comment": "Освещение склада, 20 светильников",
            "status": OrderStatus.SHIPPED,
            "source": "product_request",
            "delivery_address": "г. Казань, ул. Промышленная, д. 5",
        },
    ]

    for i, order_data in enumerate(orders):
        order = db.query(Order).filter(Order.order_number == order_data["order_number"]).first()
        if not order:
            order = Order(
                **order_data,
                total_amount=0.0,
                created_at=datetime.utcnow() - timedelta(hours=i * 2),
                updated_at=datetime.utcnow(),
            )
            db.add(order)
            db.flush()

            # Добавляем позиции
            total = 0.0
            for j in range(1, 3):
                product = products[j % len(products)]
                qty = j + 1
                price = product.price
                item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    product_uid=product.uid,
                    product_name=product.title,
                    product_sku=product.article,
                    quantity=qty,
                    price=price,
                    subtotal=qty * price,
                    created_at=datetime.utcnow(),
                )
                db.add(item)
                total += qty * price

            order.total_amount = total
            order.status_changed_at = order.created_at + timedelta(hours=1)
            print(f"  ✅ Заказ {order_data['order_number']}: {order_data['name']} — {total:,.0f} ₽")
        else:
            print(f"  ⏭️ Заказ {order_data['order_number']} пропущен")

    db.commit()
    print(f"  📊 Всего заказов: {db.query(Order).count()}\n")


def seed_quiz_results():
    """Создаём тестовые результаты квиза"""
    print("📝 Создание результатов квиза...")

    results = [
        {
            "name": "Дмитрий Волков",
            "phone": "+79001112233",
            "email": "volkov@mail.ru",
            "answers": json.dumps({
                "object_type": "Офисное здание",
                "budget": "от 500 тыс. руб.",
                "factors": ["Энергоэффективность", "Гарантийное обслуживание"],
                "problems": ["Высокая стоимость"],
                "calculation": "Да",
                "consultation": "Да",
            }, ensure_ascii=False),
            "result_type": "Офисное освещение — L-office Premium",
            "recommended_products": json.dumps([
                {"title": "L-office Premium 40W", "price": 8500},
                {"title": "L-fusion Office 60W", "price": 12000},
            ]),
            "is_processed": False,
        },
        {
            "name": "Елена Кузнецова",
            "phone": "+79002223344",
            "email": "kuznetsova@gmail.com",
            "answers": json.dumps({
                "object_type": "Магазин или склад",
                "budget": "от 100 тыс. руб.",
                "factors": ["Эстетика", "Быстрая доставка"],
                "problems": ["Сложности в подборе"],
                "calculation": "Нет",
                "consultation": "Да",
            }, ensure_ascii=False),
            "result_type": "Коммерческое освещение — L-fusion Retail",
            "recommended_products": json.dumps([
                {"title": "L-fusion Retail 100W", "price": 25000},
            ]),
            "is_processed": False,
        },
        {
            "name": "Сергей Новиков",
            "phone": "+79003334455",
            "email": "novikov@yandex.ru",
            "answers": json.dumps({
                "object_type": "Жилой дом",
                "budget": "до 100 тыс. руб.",
                "factors": ["Долговечность"],
                "problems": ["Задержки в поставке"],
                "calculation": "Нет",
                "consultation": "Нет",
            }, ensure_ascii=False),
            "result_type": "Уличное освещение — L-street Pro",
            "is_processed": True,
            "manager_comment": "Клиенту отправлено КП на email",
        },
    ]

    for data in results:
        exists = db.query(QuizResult).filter(
            QuizResult.email == data["email"]
        ).first()
        if not exists:
            result = QuizResult(
                **data,
                created_at=datetime.utcnow(),
            )
            db.add(result)
            print(f"  ✅ Квиз: {data['name']} — {data['result_type']}")
        else:
            print(f"  ⏭️ Квиз пропущен: {data['name']}")

    db.commit()
    print(f"  📊 Всего результатов квиза: {db.query(QuizResult).count()}\n")


def seed_contact_forms():
    """Создаём тестовые заявки из форм"""
    print("✉️ Создание заявок из форм...")

    submissions = [
        {
            "name": "Анна Морозова",
            "phone": "+79004445566",
            "email": "morozova@company.ru",
            "message": "Добрый день! Интересует оптовая закупка светильников для офиса на 200 м². Прошу направить коммерческое предложение.",
            "subject": "Оптовая закупка",
            "form_type": "contact_section",
            "is_processed": False,
        },
        {
            "name": "Павел Орлов",
            "phone": "+79005556677",
            "email": "orlov@mail.ru",
            "message": "Нужна консультация по установке светильников на производственном предприятии.",
            "subject": "Консультация",
            "form_type": "callback",
            "is_processed": False,
        },
        {
            "name": "Ольга Белова",
            "phone": "+79006667788",
            "email": "belova@design.ru",
            "message": "Спасибо за быструю доставку! Качество светильников отличное.",
            "form_type": "footer",
            "is_processed": True,
            "manager_comment": "Благодарность передана руководству",
        },
    ]

    for data in submissions:
        exists = db.query(ContactFormSubmission).filter(
            ContactFormSubmission.email == data.get("email")
        ).first()
        if not exists:
            submission = ContactFormSubmission(
                **data,
                created_at=datetime.utcnow(),
            )
            db.add(submission)
            print(f"  ✅ Заявка: {data['name']} — {data.get('subject', 'без темы')}")
        else:
            print(f"  ⏭️ Заявка пропущена: {data['name']}")

    db.commit()
    print(f"  📊 Всего заявок из форм: {db.query(ContactFormSubmission).count()}\n")


def seed_sync_logs():
    """Создаём тестовые логи синхронизации"""
    print("🔄 Создание логов синхронизации...")

    logs = [
        {
            "sync_type": "products",
            "status": "success",
            "items_processed": 50,
            "items_created": 45,
            "items_updated": 5,
            "items_failed": 0,
            "started_at": datetime.utcnow() - timedelta(hours=2),
            "completed_at": datetime.utcnow() - timedelta(hours=2, minutes=15),
        },
        {
            "sync_type": "products",
            "status": "partial",
            "items_processed": 50,
            "items_created": 40,
            "items_updated": 5,
            "items_failed": 5,
            "error_message": "Не удалось синхронизировать 5 из 50 товаров",
            "started_at": datetime.utcnow() - timedelta(hours=24),
            "completed_at": datetime.utcnow() - timedelta(hours=23, minutes=40),
        },
    ]

    for data in logs:
        log = SyncLog(**data)
        db.add(log)
        print(f"  ✅ Лог: {data['sync_type']} — {data['status']} ({data['items_processed']} шт)")

    db.commit()
    print(f"  📊 Всего логов: {db.query(SyncLog).count()}\n")


if __name__ == "__main__":
    print("=" * 60)
    print("  ЗАПОЛНЕНИЕ БД ТЕСТОВЫМИ ДАННЫМИ — LEDS-LIGHTS")
    print("=" * 60 + "\n")

    try:
        seed_products()
        seed_orders()
        seed_quiz_results()
        seed_contact_forms()
        seed_sync_logs()

        print("=" * 60)
        print("  ✅ ТЕСТОВЫЕ ДАННЫЕ УСПЕШНО СОЗДАНЫ!")
        print("=" * 60)
        print()
        print("📊 Итого в базе данных:")
        print(f"   • Товары:          {db.query(Product).count()}")
        print(f"   • Заказы:          {db.query(Order).count()}")
        print(f"   • Результаты квиза:{db.query(QuizResult).count()}")
        print(f"   • Заявки из форм:  {db.query(ContactFormSubmission).count()}")
        print(f"   • Логи синхрониз.: {db.query(SyncLog).count()}")
        print()
        print("🌐 Frontend админка: http://localhost:3000/admin/login")
        print("   Логин: admin / Пароль: admin123")
        print()
        print("🔧 Backend SQLAdmin:  http://localhost:8000/admin")
        print("   Логин: admin / Пароль: admin123")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ ОШИБКА: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()
