# LEDS-LIGHTS

Full-stack веб-приложение для каталога светотехнической продукции: публичный сайт, каталог товаров, формы заявок, квиз, административная панель, REST API и синхронизация товарных данных с Tilda.

Проект сделан как практический кейс по разработке интернет-магазина с backend-логикой, базой данных, Docker-инфраструктурой и AI-assisted engineering workflow.

## Что реализовано

- Публичный сайт на Next.js с каталогом, карточками товаров, формами заявок и квизом.
- Backend API на FastAPI для товаров, категорий, заказов, контактных форм, квиза, авторизации и синхронизации.
- Административная зона для управления заказами, товарами, заявками и результатами квиза.
- PostgreSQL-база данных с моделями, связями, индексами и миграциями Alembic.
- Интеграция с Tilda Store API: загрузка, парсинг, нормализация и upsert товаров.
- Nginx reverse proxy для frontend, backend, Swagger UI и SQLAdmin.
- Docker Compose-окружение для локального и серверного запуска.
- Скрипты резервного копирования и восстановления PostgreSQL.

## Стек

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, Axios  
**Backend:** Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn  
**Database:** PostgreSQL, Alembic  
**Infrastructure:** Docker, Docker Compose, Nginx  
**Auth/Admin:** JWT, HTTP Bearer, SQLAdmin  
**Integration:** Tilda Store API  
**Documentation:** FastAPI Swagger/OpenAPI через `/docs` и `/openapi.json`

## Архитектура

```text

```

Основные сервисы:

- `frontend` - Next.js-приложение, публичные страницы и админские интерфейсы.
- `backend` - FastAPI API, бизнес-логика, CRUD, авторизация, синхронизация Tilda.
- `db` - PostgreSQL.
- `nginx` - единая точка входа, проксирование frontend/backend.

## AI

Проект разрабатывался в workflow совместной работы с ИИ-агентом Codex. Цель была не просто получить сгенерированный код, а выстроить управляемый процесс разработки: ставить задачи агенту, задавать контекст, проверять результат, уточнять архитектуру и доводить изменения до рабочего состояния.

В рамках проекта выполнялась работа с AI-агентом как с инженерным исполнителем:

- формулирование задач для агента на уровне фич, модулей и технических ограничений;
- декомпозиция задач: frontend, backend, база данных, интеграция, Docker-инфраструктура;
- постановка архитектурного направления: Next.js + FastAPI + PostgreSQL + Nginx + Docker Compose;
- управление контекстом через Markdown-описания, правила проекта и уточняющие инструкции;
- написание и уточнение промптов для генерации, исправления и рефакторинга кода;
- ревью изменений агента: проверка структуры, зависимостей, маршрутов, моделей, миграций и конфигов;
- итерационная доработка результата: запуск, диагностика ошибок, корректировка требований;
- контроль соответствия кода стеку проекта и уже выбранным паттернам;
- настройка окружения и оркестрация сервисов через Docker Compose;
- работа с документацией и проверка того, как агент использует проектный контекст;
- изучение подхода к skills/rules для AI-агента и настройке устойчивого рабочего процесса.

Фактически проект демонстрирует навык **AI-augmented development**: умение не только писать код, но и управлять ИИ-агентом как частью инженерного пайплайна.

## Что это демонстрирует

- Умение проектировать full-stack приложение и разделять ответственность между frontend, backend и infrastructure.
- Умение работать с REST API, Swagger/OpenAPI, ORM-моделями и миграциями.
- Умение проектировать таблицы, связи one-to-many и связующие сущности для заказов и товаров.
- Умение разворачивать приложение в Docker-окружении и настраивать reverse proxy.
- Умение интегрировать внешний источник данных, нормализовать данные и сохранять их в БД.
- Умение применять AI-агентов в разработке: ставить задачи, задавать правила, управлять контекстом, проверять и курировать результат.

## База данных

Основные таблицы:

- `products` - товары, загруженные и нормализованные из Tilda.
- `categories` - категории товаров.
- `orders` - заказы и заявки.
- `order_items` - позиции заказа, связь заказа с товарами.
- `quiz_results` - результаты квиза.
- `contact_form_submissions` - заявки из форм обратной связи.
- `sync_logs` - логи синхронизации с Tilda.

Используются:

- SQLAlchemy ORM-модели;
- Alembic-миграции;
- индексы для поиска и фильтрации;
- внешние ключи;
- enum-статусы заказов;
- связи one-to-many: `orders -> order_items`, `products -> order_items`, `categories -> categories`.

## API

FastAPI автоматически предоставляет:

- Swagger UI: `/docs`
- OpenAPI schema: `/openapi.json`
- Health check: `/api/health`

Основные группы API:

- `/api/products` - товары, фильтрация, категории, бренды, синхронизация Tilda.
- `/api/orders` - создание и обработка заказов.
- `/api/categories` - категории.
- `/api/contact` - заявки из форм.
- `/api/quiz` - результаты квиза.
- `/api/auth` - авторизация администратора.
- `/api/sync` - синхронизация и статус.
- `/api/scheduler` - статус планировщика синхронизации.

## Интеграция с Tilda

Синхронизация товаров реализована через Tilda Store API:

- запрос товаров по `storepartuid`, `recid` и `slice`;
- обработка пагинации Tilda;
- нормализация структуры товара;
- генерация slug;
- извлечение изображений и характеристик;
- категоризация товаров;
- upsert в PostgreSQL по `uid` / `tilda_id`;
- логирование результата синхронизации.

## Локальный запуск

Создать `.env` на основе `.env.example`, затем запустить сервисы:

```bash
docker compose up --build
```

После запуска:

- сайт: `http://localhost`
- backend docs: `http://localhost/docs`
- health check: `http://localhost/health`
- SQLAdmin: `http://localhost/admin/sql`

## Полезные команды

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
```

Backend:

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

Docker:

```bash
docker compose up --build
docker compose logs backend
docker compose logs frontend
docker compose logs nginx
```

> Разработал full-stack веб-приложение на Next.js, FastAPI и PostgreSQL с Docker Compose-инфраструктурой, Nginx reverse proxy, REST API, Swagger/OpenAPI, Alembic-миграциями и интеграцией с Tilda Store API. Работал в AI-assisted workflow с Codex: формулировал задачи и промпты, задавал правила и контекст, управлял декомпозицией, проверял изменения, проводил ревью кода и курировал доработки до рабочего результата.
