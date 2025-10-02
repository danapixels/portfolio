#!/bin/bash

# runner script

set -e

function show_help() {
    echo "Usage: $0 [dev|prod] [up|down|build|logs]"
    echo ""
    echo "Commands:"
    echo "  dev up     - Start development environment"
    echo "  dev down   - Stop development environment"
    echo "  dev logs   - Show development logs"
    echo "  dev build  - Build development environment"
    echo "  prod up    - Start production environment"
    echo "  prod down  - Stop production environment"
    echo "  prod logs  - Show production logs"
    echo "  prod build - Build production environment"
    echo ""
    echo "Examples:"
    echo "  $0 dev up"
    echo "  $0 prod up"
    echo "  $0 dev logs"
}

function run_dev() {
    case $1 in
        "up")
            echo "Starting development environment..."
            docker-compose -f docker-compose.dev.yml up --build
            ;;
        "down")
            echo "Stopping development environment..."
            docker-compose -f docker-compose.dev.yml down
            ;;
        "logs")
            echo "Showing development logs..."
            docker-compose -f docker-compose.dev.yml logs -f
            ;;
        "build")
            echo "Building development environment..."
            docker-compose -f docker-compose.dev.yml build --no-cache
            ;;
        *)
            echo "Unknown development command: $1"
            show_help
            exit 1
            ;;
    esac
}

function run_prod() {
    case $1 in
        "up")
            echo "Starting production environment..."
            if [ ! -f .env.prod ]; then
                echo "Creating .env.prod from env.prod..."
                cp env.prod .env.prod
                echo "⚠️  Please edit .env.prod and change the ADMIN_KEY to a secure value!"
            fi
            docker-compose -f docker-compose.prod.yml up --build -d
            echo "Production environment started at http://localhost"
            ;;
        "down")
            echo "Stopping production environment..."
            docker-compose -f docker-compose.prod.yml down
            ;;
        "logs")
            echo "Showing production logs..."
            docker-compose -f docker-compose.prod.yml logs -f
            ;;
        "build")
            echo "Building production environment..."
            docker-compose -f docker-compose.prod.yml build --no-cache
            ;;
        *)
            echo "Unknown production command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Parse arguments
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

ENV=$1
COMMAND=$2

if [ -z "$COMMAND" ]; then
    echo "❌ Missing command"
    show_help
    exit 1
fi

case $ENV in
    "dev")
        run_dev $COMMAND
        ;;
    "prod")
        run_prod $COMMAND
        ;;
    *)
        echo "❌ Unknown environment: $ENV"
        show_help
        exit 1
        ;;
esac 