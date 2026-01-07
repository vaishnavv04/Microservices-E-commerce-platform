# E-Commerce Microservices Platform

[![CI](https://github.com/vaishnavv04/Microservices-E-commerce-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/vaishnavv04/Microservices-E-commerce-platform/actions/workflows/ci.yml)
[![Docker Build](https://github.com/vaishnavv04/Microservices-E-commerce-platform/actions/workflows/docker-build.yml/badge.svg)](https://github.com/vaishnavv04/Microservices-E-commerce-platform/actions/workflows/docker-build.yml)

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

The platform consists of 8 components:

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| **Frontend** | 3000 | - | React-based web application |
| **API Gateway** | 8000 | - | Central entry point for all API requests |
| **User Service** | 3001 | PostgreSQL | User registration, authentication, and profiles |
| **Product Service** | 3002 | PostgreSQL | Product listings, categories, and inventory |
| **Cart Service** | 3003 | Redis | Shopping cart management (fast in-memory) |
| **Order Service** | 3004 | PostgreSQL | Order processing and tracking |
| **Payment Service** | 3005 | - | Payment processing via Razorpay |
| **Notification Service** | 3006 | - | Email and SMS notifications |

## ✅ Features Implemented

| Feature | Status | Technology |
|---------|--------|------------|
| User Service | ✅ Complete | Node.js, Express, PostgreSQL, JWT |
| Product Service | ✅ Complete | Node.js, Express, PostgreSQL |
| Cart Service | ✅ Complete | Node.js, Express, Redis |
| Order Service | ✅ Complete | Node.js, Express, PostgreSQL |
| Payment Service | ✅ Complete | Node.js, Express, Razorpay |
| Notification Service | ✅ Complete | Node.js, Express, SendGrid/Twilio |
| **API Gateway** | ✅ Complete | **Traefik v3** (auto-discovery, load balancing) |
| **Frontend** | ✅ Complete | React |
| Docker Orchestration | ✅ Complete | Docker Compose |
| Integration Tests | ✅ Complete | 15 test cases covering full workflow |
| Service Discovery | ✅ Built-in | Traefik + Docker DNS |
| Centralized Logging | ✅ Complete | ELK Stack (Elasticsearch, Logstash, Kibana) |

## 📋 Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+ (or use Supabase/Docker)
- Redis 7+ (or use Docker)
- **Optional:** Razorpay account (mock mode available)
- **Optional:** SendGrid account (mock mode available)
- **Optional:** Twilio account (mock mode available)

## 🚀 Quick Start

### Option 1: Local Development (Recommended for Development)

**Step 1: Setup Environment**
```bash
cp env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
```

**Step 2: Install Dependencies**
```powershell
# Windows PowerShell
npm install
Get-ChildItem -Path services -Directory | ForEach-Object { Set-Location $_.FullName; npm install; Set-Location ..\...; }
cd ecommerce-frontend && npm install && cd ..
```

```bash
# Linux/Mac
npm install
for dir in services/*/; do cd "$dir" && npm install && cd ../..; done
cd ecommerce-frontend && npm install && cd ..
```

**Step 3: Start Redis**
```bash
docker run -d --name redis-ecommerce -p 6379:6379 redis:alpine
```

**Step 4: Start Backend Services**
```bash
node start-services.js
```

**Step 5: Start Frontend** (in a new terminal)
```bash
cd ecommerce-frontend
npm start
```

**Access the Application:**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000

### Option 2: Docker Compose (Full Stack)

```bash
# 1. Setup environment
cp env.example .env

# 2. Start all services
docker-compose up -d --build

# 3. Verify services
docker-compose ps

# 4. Test the API
curl http://localhost/api/users/health
```

### Access Points

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API Gateway** | http://localhost (port 80) |
| **Traefik Dashboard** | http://localhost:8080 |
| **Direct Service Access** | http://localhost:3001-3006 |

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
| POST | `/api/payments/payments/order` | Create Razorpay order |
| POST | `/api/payments/payments/verify` | Verify payment signature |
| POST | `/api/payments/payments/refund` | Process refund |

**Create Payment Order Request:**
```json
{
  "amount": 999.99,
  "currency": "INR",
  "orderId": 1,
  "userId": 1
}
```

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
├── gateway/                 # API Gateway
├── ecommerce-frontend/      # React Frontend
├── services/
│   ├── user-service/        # User management & auth
│   ├── product-service/     # Product catalog
│   ├── cart-service/        # Shopping cart (Redis)
│   ├── order-service/       # Order processing
│   ├── payment-service/     # Payment processing
│   └── notification-service/ # Email & SMS
├── shared/
│   └── logger/              # Shared Winston logger
├── elk/                     # ELK Stack configuration
│   ├── elasticsearch.yml    # Elasticsearch config
│   ├── logstash.yml         # Logstash config
│   └── logstash.conf        # Logstash pipeline
├── docker-compose.yml       # Docker orchestration with Traefik
├── docker-compose.elk.yml   # ELK Stack orchestration
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

# Razorpay (optional - mock mode if not set)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# SendGrid (optional - mock mode if not configured)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@example.com

# Twilio (optional - mock mode if not configured)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## 🛠️ Technology Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Databases**: PostgreSQL 15, Redis 7
- **API Gateway**: Traefik v3 (auto-discovery, load balancing)
- **Authentication**: JWT
- **Payments**: Razorpay API
- **Notifications**: SendGrid (email), Twilio (SMS)
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Containerization**: Docker, Docker Compose

## 📊 Centralized Logging (ELK Stack)

The platform includes centralized logging using the **ELK Stack** (Elasticsearch, Logstash, Kibana) for aggregating logs from all microservices.

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Microservices  │────▶│    Logstash     │────▶│  Elasticsearch  │
│  (Winston logs) │     │   (TCP :5044)   │     │    (:9200)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                ┌───────────────┐
                                                │    Kibana     │
                                                │   (:5601)     │
                                                └───────────────┘
```

### Starting the ELK Stack

```bash
# 1. Start ELK stack
docker-compose -f docker-compose.elk.yml up -d

# 2. Wait for Elasticsearch to be ready (takes ~1 minute)
curl http://localhost:9200/_cluster/health

# 3. Start your microservices
docker-compose up -d

# 4. Access Kibana at http://localhost:5601
```

### Accessing Logs in Kibana

1. Open **Kibana** at `http://localhost:5601`
2. Go to **Stack Management** → **Index Patterns**
3. Create an index pattern: `ecommerce-logs-*`
4. Select `@timestamp` as the time field
5. Go to **Discover** to view and search logs

### Log Format

Each log entry includes:

| Field | Description |
|-------|-------------|
| `service` | Name of the microservice (e.g., `user-service`) |
| `level` | Log level (`info`, `warn`, `error`, `debug`) |
| `message` | Log message |
| `timestamp` | ISO 8601 timestamp |
| `hostname` | Container/host name |
| `pid` | Process ID |
| `method` | HTTP method (for request logs) |
| `url` | Request URL (for request logs) |
| `statusCode` | HTTP status code (for request logs) |
| `duration` | Request duration in ms (for request logs) |

### Environment Variables for Logging

| Variable | Default | Description |
|----------|---------|-------------|
| `LOGSTASH_HOST` | `logstash` | Logstash hostname |
| `LOGSTASH_PORT` | `5044` | Logstash TCP port |
| `LOG_LEVEL` | `info` | Minimum log level |

### Example Log Queries in Kibana

```
# Find all errors
level: error

# Find logs from user-service
service: user-service

# Find failed requests
statusCode >= 400

# Find slow requests (>1 second)
duration: >1000ms
```

## 📋 Roadmap

- [x] Core Microservices (User, Product, Cart, Order, Payment, Notification)
- [x] API Gateway (Traefik)
- [x] Redis Caching for Cart
- [x] Docker Orchestration
- [x] Integration Tests
- [x] Centralized Logging (ELK Stack)
- [x] CI/CD Pipeline (GitHub Actions)
- [x] Frontend (React)
- [ ] Kubernetes Deployment

## 📝 License

MIT
