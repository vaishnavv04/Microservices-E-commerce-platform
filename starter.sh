#!/bin/bash

# Exit on error
set -e

echo "--------------------------------------------------"
echo "Microservices E-commerce Platform Starter"
echo "--------------------------------------------------"

show_help() {
    echo "Usage: ./starter.sh [option]"
    echo ""
    echo "Options:"
    echo "  dev           Start databases locally and services concurrently"
    echo "  docker        Start EVERYTHING (Services, DBs, Gateway, Frontend) - EXCLUDES ELK"
    echo "  elk           Start ELK Stack for centralized logging (after starting docker)"
    echo "  stop          Stop all running Docker containers"
    echo "  setup         Run initial setup (copy env, install dependencies)"
    echo "  help          Show this help message"
    echo ""
}

case "$1" in
    dev)
        echo "Starting standard development environment..."
        echo "1. Starting databases (Postgres & Redis)..."
        docker compose up -d postgres-users postgres-products postgres-orders redis
        echo "2. Starting all microservices concurrently..."
        npm start
        ;;
    docker)
        echo "Starting full Docker environment..."
        echo "Building and starting all services (Databases, Services, Gateway, Frontend)..."
        docker compose up -d --build
        echo "Full stack is running!"
        echo "Frontend: http://localhost:3000"
        echo "Gateway:  http://localhost:8000/health"
        ;;
    elk)
        echo "Starting ELK Stack..."
        docker compose -f docker-compose.elk.yml up -d
        echo "ELK Stack started!"
        echo "Kibana: http://localhost:5601"
        ;;
    stop)
        echo "Stopping all containers..."
        docker compose stop
        docker compose -f docker-compose.elk.yml stop
        echo "Stopped."
        ;;
    setup)
        echo "Running initial setup..."
        if [ ! -f .env ]; then
            echo "Copying .env.example to .env..."
            cp env.example .env
        fi
        ./setup.sh
        ;;
    *)
        show_help
        ;;
esac

# Follow logs for background services to keep the terminal active and monitor output
if [[ "$1" == "docker" || "$1" == "elk" ]]; then
    docker compose logs -f
fi
