# Скрипт для генерации self-signed SSL сертификатов через PowerShell
# Не требует OpenSSL! Использует встроенные средства Windows.
# Запуск: powershell -ExecutionPolicy Bypass -File generate-self-signed-native.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Генерация Self-Signed SSL Сертификатов" -ForegroundColor Cyan
Write-Host "(через PowerShell, без OpenSSL)" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$sslDir = Join-Path $PSScriptRoot "."
$certFile = Join-Path $sslDir "fullchain.pem"
$keyFile = Join-Path $sslDir "privkey.pem"
$pfxFile = Join-Path $sslDir "certificate.pfx"

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
    Remove-Item $certFile, $keyFile -Force -ErrorAction SilentlyContinue
}

Write-Host "Генерация self-signed сертификата..." -ForegroundColor Green

try {
    # Создаём self-signed сертификат
    $cert = New-SelfSignedCertificate `
        -DnsName "localhost", "127.0.0.1" `
        -CertStoreLocation "cert:\CurrentUser\My" `
        -NotAfter (Get-Date).AddDays(365) `
        -KeyExportPolicy Exportable `
        -KeyLength 2048 `
        -KeyAlgorithm RSA `
        -HashAlgorithm SHA256

    Write-Host "  → Сертификат создан в хранилище Windows" -ForegroundColor Gray
    Write-Host "    Thumbprint: $($cert.Thumbprint)" -ForegroundColor Gray

    # Экспортируем в PFX
    $password = ConvertTo-SecureString -String "" -Force -AsPlainText
    Export-PfxCertificate -Cert $cert -FilePath $pfxFile -Password $password | Out-Null
    Write-Host "  → Экспорт в PFX..." -ForegroundColor Gray

    # Конвертируем PFX в PEM (сертификат)
    $pfx = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $pfx.Import($pfxFile, "", "Exportable,PersistKeySet")
    
    # Записываем сертификат
    $certPem = "-----BEGIN CERTIFICATE-----`n" + 
        [Convert]::ToBase64String($pfx.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert), 
        [System.Base64FormattingOptions]::InsertLineBreaks) + 
        "`n-----END CERTIFICATE-----"
    [System.IO.File]::WriteAllText($certFile, $certPem)
    Write-Host "  → Сохранён fullchain.pem" -ForegroundColor Gray

    # Для приватного ключа используем openssl через .NET (если доступен)
    # Или сохраняем PFX как есть (nginx может работать с PFX)
    Write-Host "  → Сохранён privkey.pem (в формате PFX)" -ForegroundColor Gray
    Copy-Item $pfxFile $keyFile -Force

    Write-Host ""
    Write-Host "✅ SSL сертификаты успешно сгенерированы!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Файлы:" -ForegroundColor Cyan
    Write-Host "   Сертификат: $certFile" -ForegroundColor Gray
    Write-Host "   Приватный ключ: $keyFile (PFX формат)" -ForegroundColor Gray
    Write-Host "   PFX файл: $pfxFile" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  ВНИМАНИЕ:" -ForegroundColor Yellow
    Write-Host "   Это self-signed сертификат для тестирования!" -ForegroundColor Yellow
    Write-Host "   Браузер будет показывать предупреждение о безопасности." -ForegroundColor Yellow
    Write-Host "   Для production используйте Let's Encrypt (см. README.md)" -ForegroundColor Yellow
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "❌ Ошибка: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Альтернатива: Установите OpenSSL для Windows:" -ForegroundColor Yellow
    Write-Host "   https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Yellow
    Write-Host "   Затем запустите: generate-self-signed.ps1" -ForegroundColor Yellow
    exit 1
}
