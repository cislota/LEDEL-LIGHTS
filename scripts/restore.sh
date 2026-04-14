#!/bin/bash
# ============================================
# Скрипт для восстановления из бэкапа PostgreSQL
# Запуск: ./restore.sh [файл_бэкапа]
# Пример: ./restore.sh backups/postgres/ledl_db_20260413_120000.sql.gz
# ============================================

set -e

# ============================================
# Настройки
# ============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Загружаем .env
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

# Параметры БД
DB_USER="${POSTGRES_USER:-ledl_user}"
DB_PASSWORD="${POSTGRES_PASSWORD:-ledl_pass}"
DB_NAME="${POSTGRES_DB:-ledl_db}"

# Параметры бэкапа
BACKUP_DIR="${PROJECT_DIR}/backups/postgres"
LOG_FILE="$PROJECT_DIR/backups/restore.log"

# ============================================
# Функции
# ============================================

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log "❌ ОШИБКА: Docker не установлен"
        exit 1
    fi
}

list_backups() {
    log ""
    log "📁 Доступные бэкапы в $BACKUP_DIR:"
    log ""
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        log "   ⚠️  Бэкапы не найдены"
        log ""
        log "Сначала создайте бэкап: ./scripts/backup.sh"
        exit 1
    fi
    
    # Нумерованный список
    i=1
    ls -lht "$BACKUP_DIR"/ledl_db_*.sql.gz 2>/dev/null | while read line; do
        filename=$(echo "$line" | awk '{print $NF}')
        filesize=$(echo "$line" | awk '{print $5}')
        filedate=$(echo "$line" | awk '{print $6, $7, $8}')
        log "   $i) $(basename "$filename") ($filesize) — $filedate"
        i=$((i + 1))
    done
    log ""
}

select_backup() {
    if [ -z "$1" ]; then
        # Интерактивный выбор
        list_backups
        
        read -p "Введите номер бэкапа для восстановления: " choice
        
        if [[ -z "$choice" ]] || [[ "$choice" -lt 1 ]]; then
            log "❌ Неверный выбор"
            exit 1
        fi
        
        BACKUP_FILE=$(ls -t "$BACKUP_DIR"/ledl_db_*.sql.gz 2>/dev/null | sed -n "${choice}p")
        
        if [ -z "$BACKUP_FILE" ]; then
            log "❌ Бэкап с номером $choice не найден"
            exit 1
        fi
    else
        BACKUP_FILE="$1"
        
        if [ ! -f "$BACKUP_FILE" ]; then
            # Пробуем найти в директории бэкапов
            BACKUP_FILE="$BACKUP_DIR/$(basename "$1")"
            
            if [ ! -f "$BACKUP_FILE" ]; then
                log "❌ Файл бэкапа не найден: $1"
                exit 1
            fi
        fi
    fi
    
    log "📦 Выбранный файл: $BACKUP_FILE"
}

# ============================================
# Основная логика
# ============================================

log "========================================="
log "Восстановление из бэкапа PostgreSQL"
log "========================================="

# Проверки
check_docker

# Выбор файла бэкапа
select_backup "$1"

# Проверяем контейнер БД
DB_CONTAINER=$(docker ps --filter "name=db" --format '{{.Names}}' | head -n1)

if [ -z "$DB_CONTAINER" ]; then
    log "❌ ОШИБКА: Контейнер БД не запущен"
    log "   Запустите: docker compose up -d db"
    exit 1
fi

# ПРЕДУПРЕЖДЕНИЕ
log ""
log "⚠️  ВНИМАНИЕ: Восстановление удалит все теку данные в базе!"
log "   База данных: $DB_NAME"
log "   Контейнер: $DB_CONTAINER"
log "   Файл бэкапа: $BACKUP_FILE"
log ""

# Проверяем флаг --force
if [ "$1" = "--force" ] || [ "$2" = "--force" ]; then
    log "⏩ Флаг --force обнаружен, пропускаем подтверждение"
else
    read -p "Вы уверены? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log "❌ Восстановление отменено"
        exit 0
    fi
fi

# Создаём бэкап текущей базы перед восстановлением
log ""
log "💾 Создание бэкапа текущей базы..."

DATE=$(date +%Y%m%d_%H%M%S)
PRE_RESTORE_BACKUP="$BACKUP_DIR/ledl_db_pre_restore_${DATE}.sql.gz"

docker exec -t "$DB_CONTAINER" pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    | gzip > "$PRE_RESTORE_BACKUP"

log "✅ Бэкап текущей базы создан: $PRE_RESTORE_BACKUP"

# Восстанавливаем из бэкапа
log ""
log "⏳ Восстановление из бэкапа..."

# Копируем файл в контейнер
docker cp "$BACKUP_FILE" "$DB_CONTAINER:/tmp/restore.sql.gz"

# Выполняем восстановление
docker exec "$DB_CONTAINER" bash -c "
    export PGPASSWORD=$DB_PASSWORD
    gunzip -c /tmp/restore.sql.gz | psql -U $DB_USER -d $DB_NAME
"

# Проверяем результат
if [ $? -eq 0 ]; then
    log ""
    log "✅ Восстановление завершён успешно!"
    log ""
    log "📊 Статистика:"
    
    # Считаем количество записей в основных таблицах
    docker exec "$DB_CONTAINER" bash -c "
        export PGPASSWORD=$DB_PASSWORD
        psql -U $DB_USER -d $DB_NAME -t -c \"
            SELECT 'products: ' || COUNT(*) FROM products
            UNION ALL
            SELECT 'orders: ' || COUNT(*) FROM orders
            UNION ALL
            SELECT 'quiz_results: ' || COUNT(*) FROM quiz_results
            UNION ALL
            SELECT 'contact_forms: ' || COUNT(*) FROM contact_form_submissions
            UNION ALL
            SELECT 'categories: ' || COUNT(*) FROM categories
        ;\"
    " | while read line; do
        log "   $line"
    done
    
    log ""
    log "💡 Для перезапуска сервисов выполните:"
    log "   docker compose restart"
    
else
    log "❌ ОШИБКА при восстановлении!"
    log "   Восстановление из резервной копии:"
    log "   ./scripts/restore.sh $PRE_RESTORE_BACKUP --force"
    exit 1
fi

log "========================================="
log "Восстановление завершено"
log "========================================="

exit 0
