# LEDS-LIGHTS

Веб-приложение интернет-магазина светильников с админ-панелью, API на FastAPI и фронтендом на Next.js.

## О проекте

Проект состоит из нескольких частей:

- Backend: FastAPI + SQLAlchemy + PostgreSQL
- Frontend: Next.js + React + TypeScript
- Nginx: проксирование и статический входной узел
- База данных: PostgreSQL 15
- Админ-панель: SQLAdmin
- Синхронизация каталога: интеграция с Tilda API

## Стек технологий

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy 2
- PostgreSQL
- Alembic
- JWT-аутентификация
- SQLAdmin

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Infra
- Docker
- Docker Compose
- Nginx

---

## Структура проекта

```text
LEDEL-LIGHTS/
├── backend/
│   ├── alembic/
│   ├── crud/
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── utils/
│   ├── admin.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── nginx/
│   ├── nginx.conf
│   ├── nginx-dev.conf
│   └── ssl/
├── docker-compose.yml
├── .env.example
├── README.md
└── scripts/
```

---

## Требования

Перед запуском установите:

- Docker Desktop или Docker Engine
- Docker Compose
- Git

Для локальной разработки без Docker может потребоваться:

- Python 3.11
- Node.js 20+
- PostgreSQL 15

---

## Быстрый запуск

1. Скопируйте пример переменных окружения:

```bash
copy .env.example .env
```

2. Проверьте и при необходимости измените значения в `.env`.

3. Запустите проект:

```bash
docker compose up -d --build
```

4. Проверьте статус контейнеров:

```bash
docker compose ps
```

5. Откройте приложение:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- Admin panel: http://localhost:8000/admin

---

## Переменные окружения

В корне проекта есть файл `.env.example` с базовыми настройками. Основные параметры:

```env
POSTGRES_USER=ledl_user
POSTGRES_PASSWORD=ledl_pass
POSTGRES_DB=ledl_db

DEBUG=True
DATABASE_URL=postgresql://ledl_user:ledl_pass@db:5432/ledl_db

ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
JWT_SECRET_KEY=...
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=480

ADMIN_USERNAME=admin
ADMIN_PASSWORD=...

TILDA_API_URL=https://store.tildacdn.com/api/getproductslist/
TILDA_STORE_PART_UID=508199045462
TILDA_RECID=766672722

NEXT_PUBLIC_APP_NAME=LEDS-LIGHTS
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

> Важно: `JWT_SECRET_KEY`, `ADMIN_USERNAME` и `ADMIN_PASSWORD` должны быть заданы в реальном `.env` файле. Не используйте значения по умолчанию в production.

---

## Команды Docker

### Запуск

```bash
docker compose up -d
```

### Перезапуск после изменений

```bash
docker compose up -d --build
```

### Остановка

```bash
docker compose down
```

### Просмотр логов

```bash
docker compose logs -f
```

### Пересборка конкретного сервиса

```bash
docker compose build backend
docker compose up -d backend
```

---

## Запуск без Docker

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### База данных

Нужно иметь локально работающий PostgreSQL, либо использовать контейнер `db` из `docker-compose.yml`.

---

## API

Основные точки доступа:

- `/api/` — корневой эндпоинт API
- `/api/health` — проверка состояния сервиса
- `/api/init-db` — инициализация структуры базы данных
- `/api/sync/products` — синхронизация товаров с Tilda
- `/api/sync/status` — статус последней синхронизации
- `/api/scheduler/status` — статус планировщика

Swagger доступен по адресу:

```text
http://localhost:8000/docs
```

---

## Администрирование

В проекте предусмотрена админ-панель и JWT-аутентификация для административных операций.

Учетные данные задаются через переменные:

```env
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
```

После запуска можно использовать административные эндпоинты через авторизацию и панель `/admin`.

---

## Синхронизация с Tilda

Проект поддерживает синхронизацию товаров с Tilda API через настройки:

```env
TILDA_API_URL=https://store.tildacdn.com/api/getproductslist/
TILDA_STORE_PART_UID=508199045462
TILDA_RECID=766672722
```

Синхронизация запускается автоматически по расписанию и также доступна через API.

---

## Полезные команды для разработки

### Проверить состояние контейнеров

```bash
docker compose ps
```

### Посмотреть логи backend

```bash
docker compose logs -f backend
```

### Посмотреть логи frontend

```bash
docker compose logs -f frontend
```

### Остановить все контейнеры

```bash
docker compose down
```

---

## Примечания

- Для production рекомендуется заменить `nginx-dev.conf` на `nginx.conf` и настроить SSL-сертификаты.
- Не храните секретные значения в репозитории; используйте `.env` и убедитесь, что он добавлен в `.gitignore`.
- Для разработки данные и база хранятся в Docker volume `postgres_data`.

---

## Лицензия

Проект предназначен для внутреннего использования и разработки. При необходимости уточните условия использования у владельца проекта.
