# 🛒 E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.10+-green?style=flat-square&logo=python)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**A modern, full-stack e-commerce platform built with microservices architecture**

[Demo](#demo) • [Features](#features) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## ✨ Features

- 🏗️ **Microservices Architecture** - 5 independent services
- 🎨 **Modern UI** - Next.js 15 + Tailwind CSS
- 🔐 **JWT Authentication** - Secure user management
- 🛒 **Full E-Commerce** - Products, Cart, Orders, Search
- 📱 **Responsive Design** - Mobile-first approach
- 🐳 **Docker Ready** - One command deployment

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                  (Next.js + Tailwind)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    API Gateway (Nginx)                       │
└───┬─────────┬─────────┬─────────┬─────────┬─────────────────┘
    │         │         │         │         │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│ User  │ │Product│ │ Order │ │ Cart  │ │Search │
│Service│ │Service│ │Service│ │Service│ │Service│
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │         │         │         │         │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Postgre│ │ MySQL │ │Postgre│ │MySQL+ │ │MongoDB│
│  SQL  │ │       │ │  SQL  │ │ Redis │ │       │
└───────┘ └───────┘ └───────┘ └───────┘ └───────┘
```

### Services Overview

| Service | Stack | Port | Database |
|---------|-------|------|----------|
| **User** | Node.js + Prisma | 3001 | PostgreSQL |
| **Product** | Python + SQLAlchemy | 3002 | MySQL |
| **Order** | Node.js + TypeORM | 3003 | PostgreSQL |
| **Cart** | Node.js + Sequelize | 3004 | MySQL + Redis |
| **Search** | Node.js + Mongoose | 3005 | MongoDB |
| **Frontend** | Next.js 15 | 3000 | - |

## 🚀 Quick Start

### Option 1: Frontend Only (No Docker)

```bash
# Clone the repository
git clone https://github.com/yourusername/ecommerce-platform.git
cd ecommerce-platform

# Start frontend with mock data
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Option 2: Full Stack (Docker Required)

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

## 📦 Project Structure

```
ecommerce-platform/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utils & mock data
│   └── package.json
├── services/
│   ├── user-service/        # Auth & users (Node.js + Prisma)
│   ├── product-service/     # Products (Python + FastAPI)
│   ├── order-service/       # Orders (Node.js + TypeORM)
│   ├── cart-service/        # Cart (Node.js + Sequelize)
│   └── search-service/      # Search (Node.js + Mongoose)
├── api-gateway/             # Nginx configuration
├── docker/                  # Docker init scripts
├── docker-compose.yml       # Production setup
├── docker-compose.dev.yml   # Development setup
└── README.md
```

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| User | user@example.com | user123 |
| Admin | admin@ecommerce.uz | admin123 |

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Python 3.10+
- Docker & Docker Compose (optional)

### Running Services Individually

```bash
# User Service
cd services/user-service
npm install && npm run dev

# Product Service
cd services/product-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 3002

# Frontend
cd frontend
npm install && npm run dev
```

### Database Seeds

```bash
# Product Service
cd services/product-service && python seed.py

# User Service
cd services/user-service && npm run seed
```

## 📚 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | User registration |
| `POST /api/auth/login` | User login |
| `GET /api/products` | List products |
| `GET /api/products/:id` | Product details |
| `GET /api/categories` | List categories |
| `GET /api/cart` | Get user cart |
| `POST /api/cart/items` | Add to cart |
| `POST /api/orders` | Create order |
| `GET /api/search?q=` | Search products |

## 🧪 Testing

```bash
# Frontend
cd frontend && npm test

# User Service
cd services/user-service && npm test
```

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f [service-name]

# Rebuild specific service
docker compose build [service-name]
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ in Uzbekistan**

</div>
