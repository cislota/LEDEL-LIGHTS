<div align="center">

# 💡 LEDEL-LIGHTS

### Интернет-магазин светильников на собственной frontend/backend-архитектуре

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.11-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)

[![Top language](https://img.shields.io/github/languages/top/cislota/LEDEL-LIGHTS?style=flat-square)](https://github.com/cislota/LEDEL-LIGHTS)
[![Last commit](https://img.shields.io/github/last-commit/cislota/LEDEL-LIGHTS?style=flat-square)](https://github.com/cislota/LEDEL-LIGHTS/commits)
[![Repository size](https://img.shields.io/github/repo-size/cislota/LEDEL-LIGHTS?style=flat-square)](https://github.com/cislota/LEDEL-LIGHTS)

</div>

---

## ✨ О проекте

**LEDEL-LIGHTS** — интернет-магазин светильников, перенесённый с Tilda на собственную архитектуру. Приложение включает каталог товаров, формы заявок, оформление заказов и панель управления для менеджера.

Каталог автоматически загружается из **Tilda Store API**, нормализуется и сохраняется в PostgreSQL. Повторная синхронизация обновляет существующие товары без создания дубликатов.

> [!NOTE]
> Проект предназначен для демонстрационного и локального запуска.

## 🧰 Технологии

<div align="center">

[![Technology stack](https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,python,fastapi,postgres,docker,nginx&perline=9)](https://skillicons.dev)

</div>

| Область | Технологии |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2, Alembic |
| **Данные** | PostgreSQL 15, Tilda Store API |
| **Инфраструктура** | Docker Compose, Nginx |
| **Управление** | SQLAdmin, JWT-аутентификация |

## 🏗️ Архитектура

```mermaid
flowchart LR
    USER[Пользователь] --> NGINX[Nginx]
    NGINX -->|Страницы| FRONT[Next.js + React]
    NGINX -->|/api/*| API[FastAPI]
    FRONT -->|REST / JSON| API
    API --> SERVICES[Сервисный слой]
    SERVICES --> DB[(PostgreSQL)]
    SERVICES -->|Импорт каталога| TILDA[Tilda Store API]
    ALEMBIC[Alembic] -->|Миграции| DB

    classDef entry fill:#eef2ff,stroke:#4f46e5,color:#1e1b4b
    classDef app fill:#ecfeff,stroke:#0891b2,color:#164e63
    classDef data fill:#f0fdf4,stroke:#16a34a,color:#14532d
    classDef external fill:#fff7ed,stroke:#ea580c,color:#7c2d12

    class USER entry
    class NGINX,FRONT,API,SERVICES app
    class DB,ALEMBIC data
    class TILDA external
```

<details>
<summary><strong>Структура проекта</strong></summary>

```text
LEDEL-LIGHTS/
├── backend/
│   ├── alembic/       # миграции базы данных
│   ├── models/        # модели SQLAlchemy
│   ├── routers/       # HTTP-маршруты
│   ├── services/      # бизнес-логика и интеграции
│   └── main.py
├── frontend/
│   ├── public/
│   └── src/
├── nginx/
├── scripts/
├── docker-compose.yml
└── .env.example
```

</details>

## 🚀 Быстрый запуск

### Требования

- Git
- Docker Engine или Docker Desktop
- Docker Compose

### Установка

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/cislota/LEDEL-LIGHTS.git
   cd LEDEL-LIGHTS
   ```

2. Создайте локальный файл настроек:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Замените в `.env` демонстрационные значения `JWT_SECRET_KEY`, `ADMIN_USERNAME` и `ADMIN_PASSWORD`.

4. Соберите и запустите приложение:

   ```bash
   docker compose up -d --build
   ```

5. Проверьте состояние сервисов:

   ```bash
   docker compose ps
   ```

## 🔗 Адреса сервисов

| Сервис | Адрес |
|---|---|
| 🌐 Приложение через Nginx | <http://localhost> |
| ⚛️ Frontend | <http://localhost:3000> |
| ⚡ Backend API | <http://localhost:8000> |
| 📚 Swagger UI | <http://localhost:8000/docs> |
| 🔐 Панель администратора | <http://localhost:8000/admin> |

Остановка приложения:

```bash
docker compose down
```

Просмотр журналов:

```bash
docker compose logs -f
```

## 🔌 API

| Возможность | Маршруты | Назначение |
|---|---|---|
| ❤️ Состояние | `GET /api/health` | Проверка API и PostgreSQL |
| 🔑 Авторизация | `/api/auth/*` | Получение и проверка JWT |
| 💡 Каталог | `/api/products/*`, `/api/categories/*` | Товары, фильтры и категории |
| 🛒 Заказы | `/api/orders/*` | Создание заказов и изменение статусов |
| 📝 Формы | `/api/quiz/*`, `/api/contact/*` | Сохранение обращений посетителей |
| 🔄 Синхронизация | `/api/sync/*` | Обновление каталога и просмотр результата |

Полная интерактивная документация доступна в [Swagger UI](http://localhost:8000/docs). Защищённые запросы используют заголовок `Authorization: Bearer <token>`.

## 🔄 Синхронизация каталога

```mermaid
flowchart LR
    TILDA[Tilda Store API] --> LOAD[Постраничная загрузка]
    LOAD --> NORMALIZE[Нормализация]
    NORMALIZE --> CATEGORIES[Категоризация]
    CATEGORIES --> UPSERT[Upsert товаров]
    UPSERT --> DB[(PostgreSQL)]
    UPSERT --> LOGS[sync_logs]
```

Синхронизация автоматически выполняется каждый час после запуска приложения. Её также можно запустить вручную через защищённый API.

- загружаются все страницы товаров;
- данные приводятся к внутреннему формату;
- существующие записи обновляются;
- дубликаты не создаются;
- результат сохраняется в `sync_logs`.

## ⚙️ Основные настройки

Все параметры перечислены в `.env.example`.

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | Подключение backend к PostgreSQL |
| `JWT_SECRET_KEY` | Ключ подписи JWT |
| `ADMIN_USERNAME` | Имя администратора |
| `ADMIN_PASSWORD` | Пароль администратора |
| `TILDA_API_URL` | Адрес Tilda Store API |
| `TILDA_STORE_PART_UID` | Идентификатор части магазина |
| `TILDA_RECID` | Идентификатор блока Tilda |
| `NEXT_PUBLIC_API_BASE_URL` | Базовый адрес API для frontend |

> [!WARNING]
> В `.env` указаны демонстрационные параметры (пароли, токены и т.д.).

## 🤖 Разработка с OpenAI Codex

Часть задач в **LEDEL-LIGHTS** выполнялась вручную, а часть — с помощью **OpenAI Codex**. AI-агент использовался как помощник при работе с frontend, backend, базой данных и инфраструктурой.

Codex не является частью работающего приложения и не требуется для его запуска. В репозиторий попадает проверенный код, а не исходный ответ AI.

<div align="center">

[![OpenAI Codex](https://img.shields.io/badge/OpenAI-Codex-000000?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/codex/)
[![AGENTS.md](https://img.shields.io/badge/AGENTS.md-правила_проекта-4F46E5?style=for-the-badge&logo=markdown&logoColor=white)](./AGENTS.md)
[![SKILL.md](https://img.shields.io/badge/SKILL.md-Tilda_синхронизация-7C3AED?style=for-the-badge&logo=markdown&logoColor=white)](./.agents/skills/tilda-catalog-sync/SKILL.md)

</div>

### Контекст для AI-агента

| Файл | Назначение |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | Общие правила репозитория, архитектурные границы и обязательные проверки |
| [`SKILL.md`](./.agents/skills/tilda-catalog-sync/SKILL.md) | Сценарий работы с синхронизацией каталога Tilda |
| [`product-contract.md`](./.agents/skills/tilda-catalog-sync/references/product-contract.md) | Контракт товара и правила преобразования данных |

Специализированный навык `tilda-catalog-sync` помогает проследить путь товара от Tilda до PostgreSQL, проверить загрузку всех страниц, нормализовать поля, сопоставить категории, выполнить идемпотентное обновление и записать результат в `sync_logs`.

```mermaid
flowchart LR
    TASK[Задача] --> CONTEXT[Контекст проекта]
    AGENTS[AGENTS.md] --> CONTEXT
    SKILL[SKILL.md] --> CONTEXT
    CONTRACT[Контракты данных] --> CONTEXT
    CONTEXT --> CODEX[OpenAI Codex]
    CODEX --> DIFF[Изменения кода]
    DIFF --> REVIEW[Проверка diff]
    REVIEW --> TESTS[Сборка и тесты]
    TESTS --> RESULT[Проверенный результат]

    classDef input fill:#eef2ff,stroke:#4f46e5,color:#1e1b4b
    classDef agent fill:#f5f3ff,stroke:#7c3aed,color:#4c1d95
    classDef check fill:#ecfeff,stroke:#0891b2,color:#164e63
    classDef result fill:#f0fdf4,stroke:#16a34a,color:#14532d

    class TASK,CONTEXT,AGENTS,SKILL,CONTRACT input
    class CODEX,DIFF agent
    class REVIEW,TESTS check
    class RESULT result
```

Пример задачи для Codex:

```text
Используй $tilda-catalog-sync.

Доработай синхронизацию каталога: повторный запуск должен обновлять
существующие товары и не создавать дубликаты.

Сохрани публичные API-маршруты, оставь бизнес-логику в сервисном слое
и фиксируй результат в sync_logs. Если меняется схема БД, добавь миграцию.

Проверь повторный запуск на локальной обезличенной фикстуре, конфигурацию
Docker Compose, сборку backend и ответ GET /api/health.
```

> [!IMPORTANT]
> Изменения, подготовленные Codex, проходят те же проверки, что и код, написанный вручную: ревью области изменений, проверку контрактов, сборку и тестирование затронутых компонентов.

## ✅ Проверка изменений

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### Backend и инфраструктура

```bash
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs backend
```

После запуска проверьте `GET /api/health`. При изменении структуры данных необходимо добавить и применить миграцию Alembic.

## 📖 Дополнительная документация

- [Правила работы с проектом](./AGENTS.md)
- [Резервное копирование](./scripts/README.md)
- [Настройка SSL](./nginx/ssl/README.md)
- [Навык синхронизации каталога](./.agents/skills/tilda-catalog-sync/SKILL.md)

---

<div align="center">

</div>
