# AI Gateway with Multi-User Support

A comprehensive AI gateway system with web interface, supporting multiple users and various AI providers including local Ollama integration.

## Features

- 🌐 **Web Interface**: React-based dashboard for 2-5 users
- 🔐 **Multi-User Authentication**: JWT-based user management
- 🤖 **Multiple AI Providers**: LiteLLM, OpenAI, Anthropic, Groq, Gemini, Together AI
- 🏠 **Local Ollama Integration**: Connect to Windows Ollama instance
- 📊 **Analytics & Monitoring**: Usage tracking, cost analysis, performance metrics
- 🎛️ **Model Management**: Dynamic model configuration and routing
- 🔒 **Security**: Rate limiting, API key management, access controls

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend │    │   Backend API   │    │   LiteLLM      │
│   (React)      │    │   (Express)     │    │   Gateway       │
│   Port: 3002   │    │   Port: 3001    │    │   Port: 4000   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Port: 5432   │
                    └─────────────────┘
```

## Quick Start

```bash
# Clone and setup
git clone https://github.com/sleehoco/ai-gateway.git
cd ai-gateway

# Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# Build and start
docker-compose build
docker-compose up -d

# Access the interface
open http://localhost:3002
```

## Services

- **Frontend**: React dashboard with real-time updates
- **Backend**: Express API with authentication and routing
- **Database**: PostgreSQL for user data and analytics
- **Cache**: Redis for session management
- **Gateway**: LiteLLM for AI model orchestration
- **Monitoring**: Grafana dashboards and Prometheus metrics

## Configuration

The system is designed to work with:
- Local Ollama instances (Windows/Linux)
- Cloud AI providers (OpenAI, Anthropic, etc.)
- Custom model routing and fallbacks
- Multi-tenant user management
- Real-time WebSocket connections

## Development

Built with modern stack:
- Frontend: React 18, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Prisma ORM
- Database: PostgreSQL 15
- Container: Docker with multi-stage builds
- Monitoring: Prometheus + Grafana

## Security

- JWT-based authentication
- Rate limiting per user
- API key encryption
- CORS protection
- Input validation and sanitization