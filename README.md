# E-Commerce Microservices Platform

A scalable e-commerce platform built with microservices architecture using Node.js, Express, PostgreSQL, Redis, and Docker.

## Architecture

The platform consists of 7 services:

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| **API Gateway** | 8000 | - | Central entry point for all API requests |
| **User Service** | 3001 | PostgreSQL | User registration, authentication, and profiles |
| **Product Service** | 3002 | PostgreSQL | Product listings, categories, and inventory |
| **Cart Service** | 3003 | Redis | Shopping cart management (fast in-memory) |
| **Order Service** | 3004 | PostgreSQL | Order processing and tracking |
| **Payment Service** | 3005 | - | Payment processing via Stripe |
| **Notification Service** | 3006 | - | Email and SMS notifications |

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+ (or use Docker Compose)
- Redis 7+ (or use Docker Compose)
- **Optional:** Stripe account (mock mode available)
- **Optional:** SendGrid account (mock mode available)
- **Optional:** Twilio account (mock mode available)

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone and setup environment
cp env.example .env
# Edit .env with your configuration

# 2. Start all services (use --build to rebuild images)
docker-compose up -d --build

# 3. Verify services are running
docker-compose ps
```

All services will be available at `http://localhost:8000` via the API Gateway.

### Option 2: Local Development

```bash
# 1. Install dependencies
.\setup.ps1          # Windows PowerShell
# OR
./setup.sh           # Linux/Mac

# 2. Start databases with Docker
docker-compose up -d postgres-users postgres-products postgres-orders redis

# 3. Start services locally
npm start
```

## API Endpoints

All endpoints are accessed through the **API Gateway** at `http://localhost:8000`.

### Health Check
```
GET /health
```

### User Service (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | User login (returns JWT) | No |
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" }
}
```

### Product Service (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/products` | Get all products |
| GET | `/api/products/products/:id` | Get product by ID |
| GET | `/api/products/categories` | Get all categories |
| POST | `/api/products/products` | Create product |
| PUT | `/api/products/products/:id` | Update product |
| PUT | `/api/products/products/:id/inventory` | Update inventory |

**Create Product Request:**
```json
{
  "name": "iPhone 15",
  "description": "Latest smartphone",
  "price": 999.99,
  "inventory": 50,
  "category_id": 1,
  "image_url": "https://example.com/image.jpg"
}
```

### Cart Service (`/api/cart`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/cart/:userId` | Get user's cart |
| POST | `/api/cart/cart/items` | Add item to cart |
| PUT | `/api/cart/cart/items/:itemId` | Update item quantity |
| DELETE | `/api/cart/cart/items/:itemId` | Remove item |
| DELETE | `/api/cart/cart/:userId/clear` | Clear entire cart |

**Add to Cart Request:**
```json
{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}
```

### Order Service (`/api/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/orders` | Create order from cart |
| GET | `/api/orders/orders/:id` | Get order by ID |
| GET | `/api/orders/orders/user/:userId` | Get user's orders |
| PUT | `/api/orders/orders/:id/status` | Update order status |
| POST | `/api/orders/orders/process` | Create order with payment |
| POST | `/api/orders/orders/confirm-payment` | Confirm payment |

**Create Order Request:**
```json
{
  "userId": 1,
  "shippingAddress": "123 Main St, New York, NY 10001"
}
```

**Update Status Request:**
```json
{
  "status": "processing"  // pending, processing, shipped, delivered, cancelled
}
```

### Payment Service (`/api/payments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/payments/intent` | Create payment intent |
| POST | `/api/payments/payments/confirm` | Confirm payment |
| POST | `/api/payments/payments/refund` | Process refund |

**Create Payment Intent Request:**
```json
{
  "amount": 99.99,
  "currency": "usd",
  "orderId": 1,
  "userId": 1
}
```

### Notification Service (`/api/notifications`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/notifications/email` | Send email |
| POST | `/api/notifications/notifications/sms` | Send SMS |

**Send Email Request:**
```json
{
  "to": "user@example.com",
  "subject": "Order Confirmation",
  "text": "Your order has been placed!"
}
```

**Send SMS Request:**
```json
{
  "to": "+1234567890",
  "message": "Your order has been shipped!"
}
```

## Complete Workflow Example

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login (save the token)
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Create Products
```bash
curl -X POST http://localhost:8000/api/products/products \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone 15","description":"Latest smartphone","price":999.99,"inventory":50}'
```

### 3. Add to Cart
```bash
curl -X POST http://localhost:8000/api/cart/cart/items \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":1,"quantity":2}'
```

### 4. Create Order
```bash
curl -X POST http://localhost:8000/api/orders/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"shippingAddress":"123 Main St, NYC"}'
```

### 5. Process Payment
```bash
curl -X POST http://localhost:8000/api/payments/payments/intent \
  -H "Content-Type: application/json" \
  -d '{"amount":1999.98,"orderId":1,"userId":1}'
```

## Docker Commands

```bash
# Start all services (with rebuild)
docker-compose up -d --build

# Start without rebuild (faster, uses cached images)
docker-compose up -d

# View status
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f cart-service

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Docker Compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Redis (for Cart Service)
REDIS_URL=redis://localhost:6379

# Stripe (optional - mock mode if not set)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# SendGrid (optional - mock mode if not set)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@example.com

# Twilio (optional - mock mode if not set)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## Using Supabase

For cloud deployment, use a single Supabase database:

1. Create a project at https://supabase.com
2. Get connection string: Settings > Database > Connection string
3. Add to `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
   ```
4. Run services locally (not Docker) to connect to Supabase

## Project Structure

```
Ecommerce/
├── gateway/                 # API Gateway
├── services/
│   ├── user-service/       # User management
│   ├── product-service/    # Product catalog
│   ├── cart-service/       # Shopping cart
│   ├── order-service/      # Order processing
│   ├── payment-service/    # Payment processing
│   └── notification-service/ # Notifications
├── docker-compose.yml      # Docker orchestration
├── start-services.js       # Local startup script
├── .env                    # Environment variables
└── README.md
```

## License

MIT
