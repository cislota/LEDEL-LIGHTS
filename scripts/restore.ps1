# ============================================
# Скрипт для восстановления из бэкапа PostgreSQL (Windows PowerShell)
# Запуск: powershell -ExecutionPolicy Bypass -File restore.ps1 [файл_бэкапа]
# Пример: .\restore.ps1 backups\postgres\ledl_db_20260413_120000.sql.gz
# ============================================

$ErrorActionPreference = "Stop"

# ============================================
# Настройки
# ============================================
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectDir = Split-Path -Parent $ScriptDir

# Загружаем .env
$EnvFile = Join-Path $ProjectDir ".env"
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | Where-Object { $_ -match '^\w+=' } | ForEach-Object {
        $key, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Параметры БД
$DBUser = $env:POSTGRES_USER ?? "ledl_user"
$DBPassword = $env:POSTGRES_PASSWORD ?? "ledl_pass"
$DBName = $env:POSTGRES_DB ?? "ledl_db"

# Параметры бэкапа
$BackupDir = Join-Path $ProjectDir "backups\postgres"
$LogDir = Join-Path $ProjectDir "backups"
$LogFile = Join-Path $LogDir "restore.log"

# ============================================
# Функции
# ============================================

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Write-Host $logEntry
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    Add-Content -Path $LogFile -Value $logEntry
}

function List-Backups {
    Write-Log ""
    Write-Log "📁 Доступные бэкапы в $BackupDir:"
    Write-Log ""
    
    if (-not (Test-Path $BackupDir)) {
        Write-Log "   ⚠️  Бэкапы не найдены"
        Write-Log ""
        Write-Log "Сначала создайте бэкап: .\scripts\backup.ps1"
        exit 1
    }
    
    $backups = Get-ChildItem -Path $BackupDir -Filter "ledl_db_*.sql.gz" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-Log "   ⚠️  Бэкапы не найдены"
        exit 1
    }
    
    $i = 1
    foreach ($backup in $backups) {
        $sizeMB = [math]::Round($backup.Length / 1MB, 2)
        Write-Log "   $i) $($backup.Name) ($sizeMB MB) — $($backup.LastWriteTime)"
        $i++
    }
    Write-Log ""
}

function Select-Backup {
    param([string]$BackupFile)
    
    if (-not $BackupFile) {
        # Интерактивный выбор
        List-Backups
        
        $choice = Read-Host "Введите номер бэкапа для восстановления"
        
        if (-not $choice -or [int]$choice -lt 1) {
            Write-Log "❌ Неверный выбор"
            exit 1
        }
        
        $backups = Get-ChildItem -Path $BackupDir -Filter "ledl_db_*.sql.gz" | Sort-Object LastWriteTime -Descending
        $selectedBackup = $backups[[int]$choice - 1]
        
        if (-not $selectedBackup) {
            Write-Log "❌ Бэкап с номером $choice не найден"
            exit 1
        }
        
        return $selectedBackup.FullName
    } else {
        if (-not (Test-Path $BackupFile)) {
            $BackupFile = Join-Path $BackupDir (Split-Path $BackupFile -Leaf)
            
            if (-not (Test-Path $BackupFile)) {
                Write-Log "❌ Файл бэкапа не найден: $BackupFile"
                exit 1
            }
        }
        
        return $BackupFile
    }
}

# ============================================
# Основная логика
# ============================================

Write-Log "========================================="
Write-Log "Восстановление из бэкапа PostgreSQL"
Write-Log "========================================="

# Выбор файла бэкапа
$BackupFile = Select-Backup -BackupFile $args[0]

# Проверяем контейнер БД
$containers = docker ps --format '{{.Names}}'
$DbContainer = $containers | Where-Object { $_ -like "*db*" } | Select-Object -First 1

if (-not $DbContainer) {
    Write-Log "❌ ОШИБКА: Контейнер БД не запущен"
    Write-Log "   Запустите: docker compose up -d db"
    exit 1
}

# ПРЕДУПРЕЖДЕНИЕ
Write-Log ""
Write-Log "⚠️  ВНИМАНИЕ: Восстановление удалит все текущие данные в базе!"
Write-Log "   База данных: $DBName"
Write-Log "   Контейнер: $DbContainer"
Write-Log "   Файл бэкапа: $BackupFile"
Write-Log ""

# Проверяем флаг --force
if ($args -contains "--force") {
    Write-Log "⏩ Флаг --force обнаружен, пропускаем подтверждение"
} else {
    $confirm = Read-Host "Вы уверены? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Log "❌ Восстановление отменено"
        exit 0
    }
}

# Создаём бэкап текущей базы перед восстановлением
Write-Log ""
Write-Log "💾 Создание бэкапа текущей базы..."

$Date = Get-Date -Format "yyyyMMdd_HHmmss"
$PreRestoreBackup = Join-Path $BackupDir "ledl_db_pre_restore_$Date.sql.gz"

try {
    docker exec -t $DbContainer pg_dump -U $DBUser -d $DBName --clean --if-exists --no-owner --no-privileges | docker run --rm -i alpine gzip > $PreRestoreBackup
    Write-Log "✅ Бэкап текущей базы создан: $PreRestoreBackup"
} catch {
    Write-Log "⚠️  Не удалось создать бэкап текущей базы, продолжаем..."
}

# Восстанавливаем из бэкапа
Write-Log ""
Write-Log "⏳ Восстановление из бэкапа..."

try {
    # Копируем файл в контейнер
    docker cp $BackupFile "$DbContainer`:/tmp/restore.sql.gz"
    
    # Выполняем восстановление
    docker exec $DbContainer bash -c "
        export PGPASSWORD=$DBPassword
        gunzip -c /tmp/restore.sql.gz | psql -U $DBUser -d $DBName
    "
    
    Write-Log ""
    Write-Log "✅ Восстановление завершён успешно!"
    
    # Считаем количество записей
    Write-Log ""
    Write-Log "📊 Статистика:"
    
    $stats = docker exec $DbContainer bash -c "
        export PGPASSWORD=$DBPassword
        psql -U $DBUser -d $DBName -t -c \"
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
    "
    
    $stats | ForEach-Object { Write-Log "   $_" }
    
    Write-Log ""
    Write-Log "💡 Для перезапуска сервисов выполните:"
    Write-Log "   docker compose restart"
    
} catch {
    Write-Log "❌ ОШИБКА при восстановлении!"
    Write-Log "   Восстановление из резервной копии:"
    Write-Log "   .\scripts\restore.ps1 $PreRestoreBackup --force"
    exit 1
}

Write-Log "========================================="
Write-Log "Восстановление завершено"
Write-Log "========================================="

exit 0
