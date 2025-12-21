# Quick Start Guide

## Step 1: Set Up Environment Variables

1. **Create `.env` file** in the root directory:
   ```bash
   cp env.example .env
   ```

2. **Edit `.env`** and set at minimum:
   ```env
   # REQUIRED: Your Supabase database connection string
   DATABASE_URL=postgresql://postgres:your_password@db.project.supabase.co:5432/postgres
   
   # REQUIRED: JWT secret (any random string)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

   Leave API keys as placeholders - they'll work in mock mode!

## Step 2: Install Dependencies

Install dependencies for all services:

```bash
# Install root dependencies (for testing)
npm install

# Install dependencies for each service
cd services/user-service && npm install && cd ../..
cd services/product-service && npm install && cd ../..
cd services/cart-service && npm install && cd ../..
cd services/order-service && npm install && cd ../..
cd services/payment-service && npm install && cd ../..
cd services/notification-service && npm install && cd ../..
```

**Or use this one-liner (Windows PowerShell):**
```powershell
Get-ChildItem -Path services -Directory | ForEach-Object { Write-Host "Installing $($_.Name)..."; Set-Location $_.FullName; npm install; Set-Location ..\.. }
```

**Or use this one-liner (Linux/Mac):**
```bash
for dir in services/*/; do echo "Installing $(basename $dir)..."; cd "$dir" && npm install && cd ../..; done
```

## Step 3: Start the Services

### Option A: Start All Services at Once (Recommended)

```bash
node start-services.js
```

This will start all 6 services concurrently. Press `Ctrl+C` to stop all.

### Option B: Start Services Individually

Open 6 terminal windows/tabs and run each service:

**Terminal 1 - User Service:**
```bash
cd services/user-service
npm run dev
```

**Terminal 2 - Product Service:**
```bash
cd services/product-service
npm run dev
```

**Terminal 3 - Cart Service:**
```bash
cd services/cart-service
npm run dev
```

**Terminal 4 - Order Service:**
```bash
cd services/order-service
npm run dev
```

**Terminal 5 - Payment Service:**
```bash
cd services/payment-service
npm run dev
```

**Terminal 6 - Notification Service:**
```bash
cd services/notification-service
npm run dev
```

## Step 4: Verify Services Are Running

Check health endpoints:

```bash
# User Service
curl http://localhost:3001/health

# Product Service
curl http://localhost:3002/health

# Cart Service
curl http://localhost:3003/health

# Order Service
curl http://localhost:3004/health

# Payment Service
curl http://localhost:3005/health

# Notification Service
curl http://localhost:3006/health
```

Or open in browser:
- http://localhost:3001/health
- http://localhost:3002/health
- etc.

## Step 5: Test the Platform

### Using the Integration Test Script:

```bash
npm run test:integration
```

### Or Test Manually:

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:3001/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3001/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Create a product:**
   ```bash
   curl -X POST http://localhost:3002/products \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Product","description":"A test product","price":29.99,"inventory":100}'
   ```

4. **Add to cart:**
   ```bash
   curl -X POST http://localhost:3003/cart/items \
     -H "Content-Type: application/json" \
     -d '{"userId":1,"productId":1,"quantity":2}'
   ```

5. **Create order:**
   ```bash
   curl -X POST http://localhost:3004/orders \
     -H "Content-Type: application/json" \
     -d '{"userId":1,"shippingAddress":"123 Test St"}'
   ```

## Troubleshooting

### Services won't start?
- Check if ports 3001-3006 are available
- Verify `.env` file exists and has `DATABASE_URL` set
- Check Supabase connection string is correct

### Database connection errors?
- Verify Supabase database is running
- Check connection string format
- Ensure database password is correct

### Port already in use?
- Stop other services using those ports
- Or change ports in `.env` file

## Next Steps

- See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development guide
- See [README.md](README.md) for full documentation
- Add real API keys when ready for production

