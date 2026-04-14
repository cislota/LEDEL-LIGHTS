# Простой скрипт для генерации self-signed SSL сертификатов
# Запуск: powershell -ExecutionPolicy Bypass -File generate-simple.ps1

$sslDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$certFile = Join-Path $sslDir "fullchain.pem"
$keyFile = Join-Path $sslDir "privkey.pem"

Write-Host "Генерация self-signed SSL сертификата..." -ForegroundColor Green

try {
    # Создаём сертификат
    $cert = New-SelfSignedCertificate `
        -DnsName "localhost", "127.0.0.1" `
        -CertStoreLocation "cert:\CurrentUser\My" `
        -NotAfter (Get-Date).AddDays(365) `
        -KeyExportPolicy Exportable `
        -KeyLength 2048

    Write-Host "✅ Сертификат создан: $($cert.Thumbprint)" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Сертификат сохранён в хранилище Windows" -ForegroundColor Cyan
    Write-Host "   Для экспорта в PEM используйте:" -ForegroundColor Gray
    Write-Host "   certutil -store my $($cert.Thumbprint)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  Для nginx создайте файлы вручную или используйте OpenSSL:" -ForegroundColor Yellow
    Write-Host "   https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Yellow
    Write-Host ""

} catch {
    Write-Host "❌ Ошибка: $_" -ForegroundColor Red
    exit 1
}
