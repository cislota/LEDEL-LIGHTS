# Скрипт для генерации self-signed SSL сертификатов (для тестирования)
# Запуск: powershell -ExecutionPolicy Bypass -File generate-self-signed.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Генерация Self-Signed SSL Сертификатов" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$sslDir = Join-Path $PSScriptRoot "ssl"
$certFile = Join-Path $sslDir "fullchain.pem"
$keyFile = Join-Path $sslDir "privkey.pem"

# Проверяем существование директории
if (-not (Test-Path $sslDir)) {
    Write-Host "Создание директории: $sslDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $sslDir -Force | Out-Null
}

# Проверяем существуют ли уже сертификаты
if ((Test-Path $certFile) -and (Test-Path $keyFile)) {
    Write-Host "⚠️  SSL сертификаты уже существуют:" -ForegroundColor Yellow
    Write-Host "   $certFile" -ForegroundColor Gray
    Write-Host "   $keyFile" -ForegroundColor Gray
    Write-Host ""
    $overwrite = Read-Host "Перезаписать? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Отменено." -ForegroundColor Yellow
        exit
    }
}

Write-Host "Генерация self-signed сертификата..." -ForegroundColor Green

# Генерируем приватный ключ
Write-Host "  → Создание приватного ключа..." -ForegroundColor Gray
openssl genrsa -out $keyFile 2048 2>&1 | Out-Null

# Генерируем сертификат
Write-Host "  → Создание SSL сертификата..." -ForegroundColor Gray
openssl req -new -x509 -key $keyFile -out $certFile -days 365 -nodes `
    -subj "/C=RU/ST=Moscow/L=Moscow/O=LEDS-LIGHTS/OU=IT/CN=localhost" 2>&1 | Out-Null

# Проверяем результат
if ((Test-Path $certFile) -and (Test-Path $keyFile)) {
    Write-Host ""
    Write-Host "✅ SSL сертификаты успешно сгенерированы!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Файлы:" -ForegroundColor Cyan
    Write-Host "   Сертификат: $certFile" -ForegroundColor Gray
    Write-Host "   Приватный ключ: $keyFile" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  ВНИМАНИЕ: Это self-signed сертификат для тестирования!" -ForegroundColor Yellow
    Write-Host "   Браузер будет показывать предупреждение о безопасности." -ForegroundColor Yellow
    Write-Host "   Для production используйте Let's Encrypt (см. README.md)" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Ошибка генерации сертификатов!" -ForegroundColor Red
    Write-Host "   Убедитесь что OpenSSL установлен в системе." -ForegroundColor Red
    Write-Host "   Windows: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Red
    exit 1
}
