# PowerShell script to install all dependencies
# Run with: .\setup.ps1

Write-Host "Setting up E-Commerce Platform..." -ForegroundColor Green
Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install service dependencies
$services = @("user-service", "product-service", "cart-service", "order-service", "payment-service", "notification-service")

foreach ($service in $services) {
    Write-Host "Installing dependencies for $service..." -ForegroundColor Yellow
    Push-Location "services\$service"
    npm install
    Pop-Location
    Write-Host "$service dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "All dependencies installed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create .env file: Copy-Item env.example .env" -ForegroundColor White
Write-Host "2. Edit .env and set your DATABASE_URL and JWT_SECRET" -ForegroundColor White
Write-Host "3. Start services: npm start" -ForegroundColor White

