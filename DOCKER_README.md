# Portfolio Docker Setup

This repository includes Docker configurations for both development and production environments.

## Quick Start

### Development Environment

1. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Frontend (Vite dev server): http://localhost:3000
   - Backend API: http://localhost:3001

3. **Stop development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Production Environment

1. **Set up production environment variables:**
   ```bash
   cp env.prod .env.prod
   # Edit .env.prod and change the ADMIN_KEY to a secure value
   ```

2. **Build and start production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Access the application:**
   - Application: http://localhost:80 (or just http://localhost)

4. **Stop production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

## Environment Variables

### Development (`env.dev`)
- `NODE_ENV=development`
- `VITE_API_URL=http://localhost:3001`
- `ADMIN_KEY=dev-secret-key`

### Production (`env.prod`)
- `NODE_ENV=production`
- `VITE_API_URL=/api`
- `ADMIN_KEY=prod-secret-key-change-me` (⚠️ Change this!)

## Architecture

### Development Setup
- **Frontend**: Vite dev server on port 3000 with hot reload
- **Backend**: Express server on port 3001
- **Volumes**: Source code is mounted for live development
- **Networking**: Both services accessible directly

### Production Setup
- **Frontend**: Built React app served by Nginx
- **Backend**: Express server proxied through Nginx
- **Nginx**: Serves static files and proxies API requests
- **Port**: Single port 80 exposed

## Nginx Configuration

The production setup uses Nginx with:
- Static file serving for the React app
- API proxy to the Express server
- Gzip compression
- Security headers
- Asset caching
- Health check endpoint

## API Endpoints

- `GET /api/stamps` - Get all stamps
- `POST /api/stamps` - Add new stamp
- `DELETE /api/stamps` - Clear all stamps (requires admin key)
- `POST /api/stamps/clear` - Clear stamps for specific user

## Security Notes

1. **Change the production ADMIN_KEY** in `env.prod` before deployment
2. The production setup includes security headers
3. API requests are proxied through Nginx in production
4. CORS is configured for development only

## Troubleshooting

### Development Issues
- If ports are already in use, modify the port mappings in `docker-compose.dev.yml`
- Check logs: `docker-compose -f docker-compose.dev.yml logs`

### Production Issues
- Check nginx logs: `docker exec <container_name> tail -f /var/log/nginx/error.log`
- Check application logs: `docker-compose -f docker-compose.prod.yml logs`

### Common Commands

```bash
# View running containers
docker ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache

# Access container shell
docker exec -it <container_name> sh
```

## File Structure

```
portfolio/
├── client/                 # React frontend
├── server/                 # Express backend
├── Dockerfile.dev         # Development Dockerfile
├── Dockerfile.prod        # Production Dockerfile
├── docker-compose.dev.yml # Development compose
├── docker-compose.prod.yml # Production compose
├── nginx.conf             # Nginx configuration
├── env.dev                # Development environment
├── env.prod               # Production environment
└── .dockerignore          # Docker ignore file
``` 