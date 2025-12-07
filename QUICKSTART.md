# Quick Setup Guide

## 🚀 One-Command Setup

```bash
# Clone and setup in 30 seconds
git clone https://github.com/sleehoco/ai-gateway.git
cd ai-gateway

# Configure environment (edit your values)
nano .env

# Build and start everything
docker-compose build && docker-compose up -d

# Access your AI Gateway
open http://localhost:3002
```

## 📋 What You Get

### ✅ **Complete AI Gateway System**
- **Multi-User Web Interface**: React dashboard for 2-5 users
- **LiteLLM Integration**: Full API gateway with all providers
- **Local Ollama Support**: Connect to your Windows 1080ti setup
- **Cloud Providers**: OpenAI, Anthropic, Groq, Gemini, Together AI
- **Uncensored Models**: Dolphin, Nous Hermes, Eris, etc.
- **Monitoring**: Grafana dashboards + Prometheus metrics
- **Database**: PostgreSQL with user management
- **Caching**: Redis for performance

### 🎯 **Key Features**
- **User Authentication**: JWT-based with role management
- **Model Management**: Dynamic routing and fallbacks
- **Real-time Chat**: WebSocket support
- **Analytics**: Usage tracking, cost analysis
- **Admin Panel**: User management and system settings
- **Security**: Rate limiting, API key management
- **Monitoring**: Health checks, performance metrics

### 🌐 **Access URLs**
- **Web Interface**: http://localhost:3002
- **API Backend**: http://localhost:3001
- **LiteLLM Gateway**: http://localhost:4000
- **Grafana**: http://localhost:3000
- **Redis Commander**: http://localhost:8081
- **PgAdmin**: http://localhost:5050

## ⚙️ **Configuration Required**

### 1. Update Environment Variables
Edit `.env` with your actual values:

```bash
# Your Windows Ollama IP
OLLAMA_API_BASE=http://YOUR_WINDOWS_IP:11434

# Database password
POSTGRES_PASSWORD=your_secure_password

# LiteLLM master key
LITELLM_MASTER_KEY=sk-your-secure-master-key

# Cloud provider keys (add yours)
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GROQ_API_KEY=gsk_your-groq-key
GEMINI_API_KEY=your-gemini-key
TOGETHER_AI_API_KEY=your-together-ai-key

# Web interface secrets
JWT_SECRET=your-jwt-secret-key
GRAFANA_PASSWORD=your-grafana-password
```

### 2. Update LiteLLM Config
Edit `config/litellm_config.yaml` to match your Windows Ollama IP:

```yaml
# Update all api_base entries
api_base: "http://YOUR_WINDOWS_IP:11434"
```

## 🔧 **Customization Options**

### Add Your Own Models
```yaml
# Add to config/litellm_config.yaml
- model_name: "my-custom-model"
  litellm_params:
    model: "ollama/my-custom-model"
    api_base: "http://YOUR_WINDOWS_IP:11434"
```

### Customize Web Interface
```bash
# Frontend theming
cd frontend/src
# Edit components and styles

# Backend routing
cd backend/src
# Modify API endpoints and business logic
```

## 🚀 **Production Deployment**

### With Cloudflare
```bash
# Set up tunnel
cloudflared tunnel create ai-gateway
cloudflared tunnel route dns ai-gateway.yourdomain.com localhost:3002

# Update environment
echo "CORS_ORIGIN=https://ai-gateway.yourdomain.com" >> .env
```

### Scale for Performance
```bash
# Scale backend services
docker-compose up -d --scale backend=2

# Add resource limits
# Edit docker-compose.yml with deploy.resources
```

## 📊 **Monitoring Setup**

### Grafana Dashboards
1. Access: http://localhost:3000
2. Login with admin credentials
3. Import pre-configured dashboards:
   - AI Gateway Overview
   - Model Performance
   - User Analytics
   - System Health

### Prometheus Metrics
1. Access: http://localhost:9090
2. View targets: http://localhost:9090/targets
3. Check metrics: http://localhost:9090/metrics

## 🔒 **Security Features**

### Built-in Security
- JWT authentication with expiration
- Rate limiting per user/model
- API key encryption
- CORS protection
- Input validation and sanitization
- SQL injection protection

### Recommended Hardening
```bash
# Update passwords
openssl rand -base64 32  # Generate new secrets

# Firewall rules
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# SSL certificates (if not using Cloudflare)
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

## 🛠️ **Troubleshooting**

### Common Issues
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs [service-name]

# Restart services
docker-compose restart [service-name]

# Database issues
docker exec -it ai-gateway-postgres psql -U ai_gateway -d ai_gateway

# Network issues
docker network ls
docker network inspect ai-gateway-network
```

### Health Checks
```bash
# All services healthy?
curl http://localhost:4000/health && echo "✅ LiteLLM"
curl http://localhost:3001/health && echo "✅ Backend"
curl http://localhost:3002 && echo "✅ Frontend"
curl http://localhost:3000 && echo "✅ Grafana"
```

## 📈 **Performance Optimization**

### Database Optimization
```bash
# Optimize PostgreSQL
docker exec ai-gateway-postgres psql -U ai_gateway -d ai_gateway -c "VACUUM ANALYZE;"

# Monitor connections
docker exec ai-gateway-postgres psql -U ai_gateway -d ai_gateway -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
```

### Application Scaling
```bash
# Add more backend instances
docker-compose up -d --scale backend=3

# Monitor resource usage
docker stats --no-stream
```

## 🔄 **Backup and Recovery**

### Automated Backup
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec ai-gateway-postgres pg_dump -U ai_gateway ai_gateway > backup_$DATE.sql
tar -czf config_backup_$DATE.tar.gz .env config/
echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/ai-gateway/backup.sh
```

### Disaster Recovery
```bash
# Restore from backup
docker exec -i ai-gateway-postgres psql -U ai_gateway -d ai_gateway < backup_20241206.sql

# Reset to clean state
docker-compose down -v
docker-compose up -d
```

## 📚 **Documentation**

### API Documentation
- **Swagger UI**: http://localhost:3001/api-docs
- **API Reference**: Check `/docs` endpoint
- **Model List**: http://localhost:4000/v1/models

### User Guide
1. Register admin account at http://localhost:3002/register
2. Create additional users (max 5)
3. Configure API keys for each user
4. Set up model groups and routing
5. Monitor usage in analytics dashboard

---

## 🎉 **You're Ready!**

Your complete AI gateway system is now configured with:
- ✅ Multi-user web interface
- ✅ All AI providers integrated
- ✅ Local Ollama support
- ✅ Uncensored models available
- ✅ Real-time monitoring
- ✅ Production-ready security
- ✅ Easy deployment and scaling

**Next Steps:**
1. Customize models and routing for your needs
2. Set up Cloudflare tunnel for external access
3. Configure monitoring alerts
4. Add custom branding and themes
5. Scale based on usage patterns

**Support:**
- Check logs: `docker-compose logs -f`
- Health checks: `/health` endpoints
- Documentation: In-app help system
- Community: GitHub issues and discussions

Welcome to your complete AI gateway environment! 🚀