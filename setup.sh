#!/bin/bash
# Bash script to install all dependencies
# Run with: chmod +x setup.sh && ./setup.sh

echo "🚀 Setting up E-Commerce Platform..."
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install service dependencies
services=("user-service" "product-service" "cart-service" "order-service" "payment-service" "notification-service")

for service in "${services[@]}"; do
    echo "📦 Installing dependencies for $service..."
    cd "services/$service"
    npm install
    cd ../..
    echo "✅ $service dependencies installed"
done

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "Next steps:"
echo "1. Create .env file: cp env.example .env"
echo "2. Edit .env and set your DATABASE_URL and JWT_SECRET"
echo "3. Start services: npm start"

