# Установка и настройка

## Требования

- Git;
- Docker Engine или Docker Desktop;
- Docker Compose.

## Подготовка

```bash
git clone https://github.com/cislota/LEDEL-LIGHTS.git
cd LEDEL-LIGHTS
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux и macOS:

```bash
cp .env.example .env
```

Замените шаблонные значения:

- `JWT_SECRET_KEY` - случайный ключ подписи JWT;
- `ADMIN_USERNAME` - имя администратора;
- `ADMIN_PASSWORD` - уникальный пароль длиной не менее 16 символов.

Ключ JWT можно создать командой:

```bash
openssl rand -hex 32
```

## Запуск

```bash
docker compose up -d --build
docker compose ps
```

Проверьте приложение:

```bash
curl http://localhost:8000/api/health
```

Остановка:

```bash
docker compose down
```

Просмотр журналов:

```bash
docker compose logs -f backend
```

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `POSTGRES_USER` | Пользователь PostgreSQL |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL |
| `POSTGRES_DB` | Имя базы данных |
| `DATABASE_URL` | Строка подключения backend к PostgreSQL |
| `ALLOWED_ORIGINS` | Разрешённые источники CORS через запятую |
| `JWT_SECRET_KEY` | Ключ подписи JWT |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Срок действия токена |
| `ADMIN_USERNAME` | Имя администратора |
| `ADMIN_PASSWORD` | Пароль администратора |
| `TILDA_API_URL` | Адрес Tilda Store API |
| `TILDA_STORE_PART_UID` | Идентификатор части магазина |
| `TILDA_RECID` | Идентификатор блока Tilda |
| `NEXT_PUBLIC_API_BASE_URL` | Базовый адрес API для frontend |
| `NEXT_PUBLIC_APP_NAME` | Название приложения во frontend |
| `SSL_DOMAIN` | Домен для HTTPS |
| `BACKUP_RETENTION_DAYS` | Срок хранения резервных копий |

Не используйте шаблонные значения из `.env.example` в опубликованной среде.

