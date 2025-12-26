# Contributing to E-Commerce Platform

Thank you for your interest in contributing! 🎉

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ecommerce-platform.git
   ```
3. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose (optional)

### Quick Start
```bash
# Start databases
docker compose -f docker-compose.dev.yml up -d

# Install dependencies
cd services/user-service && npm install
cd services/product-service && pip install -r requirements.txt
cd frontend && npm install

# Run services
cd frontend && npm run dev
```

## 📝 Code Style

- **TypeScript/JavaScript**: ESLint + Prettier
- **Python**: Black + Flake8
- Use meaningful commit messages

## 🔄 Pull Request Process

1. Update documentation if needed
2. Test your changes locally
3. Create a PR with a clear description
4. Wait for review

## 📋 Commit Messages

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests

Example: `feat(cart): add quantity validation`

## ❓ Questions?

Open an issue or start a discussion!
