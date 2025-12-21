# E-Commerce Microservices Platform

A scalable e-commerce platform built with microservices architecture using Node.js, Express, PostgreSQL, Redis, Traefik, and Docker.

## 🏗️ Architecture

```
                                    ┌─────────────────────────────────────────┐
                                    │           Traefik API Gateway           │
                                    │         (Auto-Discovery + LB)           │
                                    │    Dashboard: http://localhost:8080     │
                                    └───────────────────┬─────────────────────┘
                                                        │
                    ┌───────────────┬───────────────┬───┴───┬───────────────┬───────────────┐
                    │               │               │       │               │               │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │   User    │   │  Product  │   │   Cart    │ │   Order   │ │  Payment  │ │  Notify   │
              │  Service  │   │  Service  │   │  Service  │ │  Service  │ │  Service  │ │  Service  │
              │   :3001   │   │   :3002   │   │   :3003   │ │   :3004   │ │   :3005   │ │   :3006   │
              └─────┬─────┘   └─────┬─────┘   └─────┬─────┘ └─────┬─────┘ └───────────┘ └───────────┘
                    │               │               │             │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐ ┌─────▼─────┐
              │ PostgreSQL│   │ PostgreSQL│   │   Redis   │ │ PostgreSQL│
              │   Users   │   │  Products │   │   Cache   │ │   Orders  │
              └───────────┘   └───────────┘   └───────────┘ └───────────┘
```

## ✅ Features Implemented

| Feature | Status | Technology |
|---------|--------|------------|
| User Service | ✅ Complete | Node.js, Express, PostgreSQL, JWT |
| Product Service | ✅ Complete | Node.js, Express, PostgreSQL |
| Cart Service | ✅ Complete | Node.js, Express, Redis |
| Order Service | ✅ Complete | Node.js, Express, PostgreSQL |
| Payment Service | ✅ Complete | Node.js, Express, Stripe (mock mode) |
| Notification Service | ✅ Complete | Node.js, Express, SendGrid/Twilio (mock mode) |
| **API Gateway** | ✅ Complete | **Traefik v3** (auto-discovery, load balancing) |
| Docker Orchestration | ✅ Complete | Docker Compose |
| Integration Tests | ✅ Complete | 15 test cases covering full workflow |
| Service Discovery | ✅ Built-in | Traefik + Docker DNS |

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone and setup environment
cp env.example .env

# 2. Start all services
docker-compose up -d --build

# 3. Verify services are running
docker-compose ps

# 4. Test the API
curl http://localhost/api/users/health
```

### Access Points

| Service | URL |
|---------|-----|
| **API Gateway** | http://localhost (port 80) |
| **Traefik Dashboard** | http://localhost:8080 |
| **Direct Service Access** | http://localhost:3001-3006 |

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

## 📡 API Endpoints

All endpoints are accessed through **Traefik** at `http://localhost`.

### Health Checks
```bash
curl http://localhost/api/users/health
curl http://localhost/api/products/health
curl http://localhost/api/cart/health
curl http://localhost/api/orders/health
curl http://localhost/api/payments/health
curl http://localhost/api/notifications/health
```

### User Service (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login (returns JWT) |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |

### Product Service (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/products` | Get all products |
| GET | `/api/products/products/:id` | Get product by ID |
| POST | `/api/products/products` | Create product |
| PUT | `/api/products/products/:id` | Update product |

### Cart Service (`/api/cart`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/cart/:userId` | Get user's cart |
| POST | `/api/cart/cart/items` | Add item to cart |
| PUT | `/api/cart/cart/items/:itemId` | Update quantity |
| DELETE | `/api/cart/cart/items/:itemId` | Remove item |

### Order Service (`/api/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/orders` | Create order from cart |
| GET | `/api/orders/orders/:id` | Get order by ID |
| PUT | `/api/orders/orders/:id/status` | Update order status |

### Payment Service (`/api/payments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/payments/intent` | Create payment intent |
| POST | `/api/payments/payments/confirm` | Confirm payment |

### Notification Service (`/api/notifications`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/notifications/email` | Send email |
| POST | `/api/notifications/notifications/sms` | Send SMS |

## 🔧 Scaling Services

With Traefik, scaling is automatic:

```bash
# Scale product-service to 3 instances
docker-compose up -d --scale product-service=3

# Traefik automatically load-balances across all instances!
```

## 🧪 Run Integration Tests

```bash
# Start all services first
docker-compose up -d

# Run tests
node test-integration.js
```

## 📁 Project Structure

```
Ecommerce/
├── traefik/                 # Traefik configuration
│   └── traefik.yml
├── gateway/                 # Legacy Express gateway (replaced by Traefik)
├── services/
│   ├── user-service/        # User management & auth
│   ├── product-service/     # Product catalog
│   ├── cart-service/        # Shopping cart (Redis)
│   ├── order-service/       # Order processing
│   ├── payment-service/     # Payment processing
│   └── notification-service/ # Email & SMS
├── docker-compose.yml       # Docker orchestration with Traefik
├── start-services.js        # Local startup script
├── test-integration.js      # Integration test suite
├── .env                     # Environment variables
└── README.md
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d --build

# View status
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f cart-service

# Scale a service
docker-compose up -d --scale product-service=3

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## ⚙️ Environment Variables

Create a `.env` file:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Stripe (optional - mock mode if not configured)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# SendGrid (optional - mock mode if not configured)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@example.com

# Twilio (optional - mock mode if not configured)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Databases**: PostgreSQL 15, Redis 7
- **API Gateway**: Traefik v3 (auto-discovery, load balancing)
- **Authentication**: JWT
- **Payments**: Stripe API
- **Notifications**: SendGrid (email), Twilio (SMS)
- **Containerization**: Docker, Docker Compose

## 📋 Roadmap

- [x] Core Microservices (User, Product, Cart, Order, Payment, Notification)
- [x] API Gateway (Traefik)
- [x] Redis Caching for Cart
- [x] Docker Orchestration
- [x] Integration Tests
- [ ] Centralized Logging (ELK Stack)
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Kubernetes Deployment

## 📝 License

MIT
