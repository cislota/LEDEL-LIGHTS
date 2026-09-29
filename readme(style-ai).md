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

## О проекте

**LEDEL-LIGHTS** — интернет-магазин светильников, перенесённый с Tilda на собственную архитектуру. Приложение включает каталог товаров, формы заявок, оформление заказов и панель управления для менеджера.

Каталог автоматически загружается из **Tilda Store API**, нормализуется и сохраняется в PostgreSQL. Повторная синхронизация обновляет существующие товары без дублирования.

> [!NOTE]
> Проект предназначен для демонстрационного и локального запуска.

## Технологии

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

## Архитектура

```mermaid
flowchart LR
    USER["Пользователь"]

    subgraph APP["LEDEL-LIGHTS · Docker Compose"]
        NGINX["Nginx<br/>reverse proxy"]
        NGINX -->|"/"| FRONT["Next.js / React<br/>пользовательский интерфейс"]
        NGINX -->|"/api/*"| ROUTERS["FastAPI routers<br/>auth · products · orders · quiz"]
        FRONT -->|"REST / JSON"| ROUTERS

        ROUTERS --> SERVICES["Сервисный слой<br/>auth · tilda_sync · scheduler · notifications"]
        SERVICES --> MODELS["SQLAlchemy models<br/>и операции с данными"]
        MODELS --> DB[("PostgreSQL<br/>products · categories · orders · users · sync_logs")]
        MIGRATIONS["Alembic migrations"] --> DB
    end

    USER --> NGINX
    SERVICES --> TILDA["Tilda Store API"]

    classDef edge fill:#eef2ff,stroke:#4f46e5,color:#1e1b4b;
    classDef app fill:#ecfeff,stroke:#0891b2,color:#164e63;
    classDef data fill:#f0fdf4,stroke:#16a34a,color:#14532d;
    classDef external fill:#fff7ed,stroke:#ea580c,color:#7c2d12;

    class USER edge;
    class NGINX,FRONT,ROUTERS,SERVICES app;
    class MODELS,DB,MIGRATIONS data;
    class TILDA external;
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

## Разработка с OpenAI Codex

При разработке LEDEL-LIGHTS часть функциональности создавалась вручную, часть — с использованием OpenAI Codex. Агент подключался к отдельным задачам во frontend, backend, базе данных и инфраструктурной конфигурации. До начала реализации определялись границы изменения, затрагиваемые сервисы и допустимые изменения API и структуры данных.

Контекст проекта и ограничения передавались через Markdown-инструкции. В публичной версии репозитория этот подход оформлен в виде [`AGENTS.md`](./AGENTS.md) с общими правилами работы и отдельной инструкции [`tilda-catalog-sync`](./.agents/skills/tilda-catalog-sync/SKILL.md) для задач синхронизации каталога. Codex подготавливал изменения в пределах поставленной задачи, после чего полученный diff проходил сборку и функциональную проверку наравне с кодом, написанным вручную.

<div align="center">

[![OpenAI Codex](https://img.shields.io/badge/OpenAI-Codex-000000?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/codex/)
[![AGENTS.md](https://img.shields.io/badge/AGENTS.md-правила_проекта-4F46E5?style=for-the-badge&logo=markdown&logoColor=white)](./AGENTS.md)
[![SKILL.md](https://img.shields.io/badge/SKILL.md-Tilda_синхронизация-7C3AED?style=for-the-badge&logo=markdown&logoColor=white)](./.agents/skills/tilda-catalog-sync/SKILL.md)

</div>

### Место Codex в процессе разработки

Ручная и агентная разработка не разделялись на два независимых процесса. Codex использовался внутри общего цикла: после проработки задачи и до проверки готового изменения.

```mermaid
flowchart LR
    TASK["Требование или дефект"] --> ANALYSIS["Разбор потока данных<br/>и затрагиваемых контрактов"]
    ANALYSIS --> DESIGN["Архитектурное решение<br/>и границы изменения"]
    DESIGN --> MODE{"Способ реализации"}

    MODE -->|"вручную"| MANUAL["Изменение кода"]
    MODE -->|"с Codex"| PACKAGE["Пакет контекста задачи"]

    subgraph CONTEXT["Контекст для Codex"]
        RULES["AGENTS.md<br/>правила репозитория"]
        SKILL["SKILL.md<br/>сценарий синхронизации"]
        FILES["Связанные файлы<br/>и текущий поток данных"]
        CRITERIA["Ограничения<br/>и критерии готовности"]
    end

    RULES --> PACKAGE
    SKILL --> PACKAGE
    FILES --> PACKAGE
    CRITERIA --> PACKAGE

    PACKAGE --> CODEX["Codex<br/>анализ и подготовка изменений"]
    CODEX --> DIFF["Diff и список<br/>затронутых файлов"]
    MANUAL --> REVIEW
    DIFF --> REVIEW["Проверка области изменения<br/>API · данные · зависимости · секреты"]
    REVIEW --> CHECKS["Сборка и проверки<br/>frontend · backend · БД · инфраструктура"]
    CHECKS --> DECISION{"Изменение готово?"}
    DECISION -->|"нет"| REVISION["Уточнение задачи<br/>или ручная доработка"]
    REVISION --> PACKAGE
    REVISION --> MANUAL
    DECISION -->|"да"| INTEGRATION["Commit и интеграция"]

    classDef input fill:#eef2ff,stroke:#4f46e5,color:#1e1b4b;
    classDef agent fill:#f5f3ff,stroke:#7c3aed,color:#4c1d95;
    classDef check fill:#ecfeff,stroke:#0891b2,color:#164e63;
    classDef result fill:#f0fdf4,stroke:#16a34a,color:#14532d;

    class TASK,ANALYSIS,DESIGN,MODE input;
    class PACKAGE,RULES,SKILL,FILES,CRITERIA,CODEX,DIFF agent;
    class MANUAL,REVIEW,CHECKS,DECISION,REVISION check;
    class INTEGRATION result;
```

Для агента собирался только контекст, относящийся к текущему изменению. Общие ограничения проекта не повторялись в каждой задаче: они находились в `AGENTS.md`. Последовательность действий для повторяемого сценария задавалась в `SKILL.md`, а конкретная задача содержала ожидаемое поведение, границы изменения и критерии готовности.

```text
LEDEL-LIGHTS/
├── AGENTS.md
├── .agents/
│   └── skills/
│       └── tilda-catalog-sync/
│           ├── SKILL.md
│           └── references/
│               └── product-contract.md
├── frontend/
├── backend/
│   ├── routers/
│   ├── services/
│   ├── models/
│   └── alembic/
├── nginx/
└── docker-compose.yml
```

`AGENTS.md` применяется ко всему репозиторию: описывает структуру проекта, допустимые границы изменений и обязательные проверки. Инструкция `tilda-catalog-sync` загружается для задач, связанных с Tilda Store API, нормализацией товаров, сопоставлением категорий, обновлением записей в PostgreSQL и журналированием синхронизации. Файл `references/product-contract.md` содержит схему входных данных, правила преобразования полей и условия upsert; для несвязанных задач агенту не требуется его загружать.

### Пример задачи для агента

Ниже приведён сокращённый пример инструкции для изменения синхронизации каталога. Общие правила репозитория и порядок работы со сценарием агент получает из `AGENTS.md` и `SKILL.md`, поэтому в самой задаче остаются только требования к конкретному изменению.

```text
Используй $tilda-catalog-sync.

Задача
Доработать синхронизацию каталога из Tilda Store API: повторный запуск
должен обновлять существующие товары и не создавать дубликаты.

Текущее поведение
Ответ Tilda обрабатывается в backend/services/tilda_sync.py. Товары
сохраняются в PostgreSQL через существующие модели SQLAlchemy. Результат
операции должен фиксироваться в sync_logs.

Перед изменением
1. Восстанови текущий путь данных от ответа Tilda до записи в PostgreSQL.
2. Определи действующее правило идентификации товара по uid / tilda_id.
3. Укажи, требуется ли изменение API-контракта, моделей или схемы БД.
4. Не изменяй код, не связанный с синхронизацией каталога.

Ограничения
- Сохрани существующие публичные API-маршруты.
- Не переноси логику синхронизации в backend/routers/.
- Не добавляй поля ответа Tilda, которых нет в текущем контракте или фикстуре.
- Не записывай необработанный production-ответ и учётные данные в репозиторий.
- Если потребуется изменение схемы БД, добавь миграцию Alembic.
- Ошибка обработки одного товара не должна повреждать ранее сохранённые данные.

Критерии готовности
- повторная синхронизация одной фикстуры не создаёт новые строки товаров;
- товар с тем же идентификатором и изменёнными данными обновляется;
- результат операции и ошибки сохраняются в sync_logs;
- docker compose config и сборка backend завершаются успешно;
- после запуска backend endpoint /api/health отвечает успешно.

В результате укажи изменённые файлы, изменения контрактов и схемы БД,
выполненные команды, результаты проверок и оставшиеся ограничения.
```

### Проверка изменений

Изменения, подготовленные Codex, проходили тот же путь, что и ручная разработка. Для frontend выполнялись lint и production-сборка. Для backend и инфраструктуры проверялись конфигурация Docker Compose, сборка и запуск затронутых сервисов, health-check и журналы выполнения. Изменения структуры данных проверялись через миграции Alembic и повторный запуск синхронизации на тестовой фикстуре.

Если результат не соответствовал контракту или затрагивал лишние файлы, задача уточнялась либо код дорабатывался вручную. В репозиторий включался проверенный результат, а не исходный ответ агента.

## Быстрый запуск

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

## Адреса сервисов

| Сервис | Адрес |
|---|---|
| Приложение через Nginx | <http://localhost> |
| Frontend | <http://localhost:3000> |
| Backend API | <http://localhost:8000> |
| Swagger UI | <http://localhost:8000/docs> |
| Панель администратора | <http://localhost:8000/admin> |

Остановка приложения:

```bash
docker compose down
```

Просмотр журналов:

```bash
docker compose logs -f
```

## API

| Возможность | Маршруты | Назначение |
|---|---|---|
| Состояние | `GET /api/health` | Проверка API и PostgreSQL |
| Авторизация | `/api/auth/*` | Получение и проверка JWT |
| Каталог | `/api/products/*`, `/api/categories/*` | Товары, фильтры и категории |
| Заказы | `/api/orders/*` | Создание заказов и изменение статусов |
| Формы | `/api/quiz/*`, `/api/contact/*` | Сохранение обращений посетителей |
| Синхронизация | `/api/sync/*` | Обновление каталога и просмотр результата |

Полная интерактивная документация доступна в [Swagger UI](http://localhost:8000/docs). Защищённые запросы используют заголовок `Authorization: Bearer <token>`.

## Синхронизация каталога

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

## Основные настройки

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

## Проверка изменений

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

## Дополнительная документация

- [Правила работы с проектом](./AGENTS.md)
- [Резервное копирование](./scripts/README.md)
- [Настройка SSL](./nginx/ssl/README.md)
- [Навык синхронизации каталога](./.agents/skills/tilda-catalog-sync/SKILL.md)

---

<div align="center">

</div>

