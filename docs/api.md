# API

Backend работает на FastAPI. При локальном запуске интерактивная документация доступна по адресу <http://localhost:8000/docs>.

## Авторизация

`POST /api/auth/login` принимает имя и пароль администратора. Защищённые запросы используют заголовок:

```http
Authorization: Bearer <token>
```

Токен подписывается алгоритмом HS256. Срок действия задаётся через `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`.

## Основные маршруты

| Метод и путь | Доступ | Назначение |
|---|---|---|
| `GET /api/health` | Публичный | Проверка API и PostgreSQL |
| `POST /api/auth/login` | Публичный | Получение JWT |
| `GET /api/auth/me` | Администратор | Данные текущего пользователя |
| `POST /api/auth/verify` | Администратор | Проверка токена |
| `GET /api/products` | Публичный | Каталог с пагинацией и фильтрами |
| `GET /api/products/{slug}` | Публичный | Товар по slug |
| `GET /api/categories` | Публичный | Категории |
| `POST /api/orders` | Публичный | Создание заказа |
| `GET /api/orders` | Администратор | Список заказов |
| `PATCH /api/orders/{id}/status` | Администратор | Изменение статуса заказа |
| `POST /api/contact/submit` | Публичный | Отправка формы связи |
| `POST /api/quiz/results` | Публичный | Сохранение результата квиза |
| `POST /api/sync/products` | Администратор | Ручная синхронизация каталога |
| `GET /api/scheduler/status` | Администратор | Состояние планировщика |

## Фильтры каталога

`GET /api/products` поддерживает параметры `page`, `page_size`, `category`, `type`, `brand`, `search` и `is_available`.

## Статусы заказов

Допустимые значения:

- `processing`;
- `confirmed`;
- `cancelled`;
- `completed`;
- `shipped`.

## Текущие ограничения

Маршруты чтения и изменения заявок из квиза и формы связи сейчас не используют `require_admin`. Перед публикацией их нужно защитить или ограничить на уровне reverse proxy.

При изменении маршрутов синхронно обновляйте routers, `backend/schemas.py`, frontend-клиент и этот документ.

