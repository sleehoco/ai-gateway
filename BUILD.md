# AI Gateway Build & Deployment Guide

## 📋 Prerequisites Checklist

- [ ] Docker and Docker Compose installed
- [ ] Git installed and configured
- [ ] 11GB+ RAM available
- [ ] 50GB+ free disk space
- [ ] Windows Ollama running on 1080ti host
- [ ] Network connectivity between Unraid and Windows
- [ ] Cloud provider API keys (optional but recommended)

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/sleehoco/ai-gateway.git
cd ai-gateway

# 2. Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# 3. Build and start
docker-compose build
docker-compose up -d

# 4. Verify deployment
docker-compose ps
curl http://localhost:3002
```

---

## 📁 Directory Structure

```
ai-gateway/
├── docker-compose.yml              # Main orchestration
├── .env.example                   # Environment template
├── README.md                      # This file
├── QUICKSTART.md                  # Quick start guide
├── config/                        # Configuration files
│   ├── litellm_config.yaml     # LiteLLM configuration
│   ├── prometheus.yml           # Prometheus config
│   └── grafana/
│       └── provisioning/
│           ├── datasources.yml
│           └── dashboards/
├── backend/                       # Node.js API server
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── prisma/
│   │       └── schema.prisma
└── frontend/                      # React web interface
    ├── Dockerfile
    ├── package.json
    ├── nginx.conf
    └── src/
        ├── components/
        ├── pages/
        ├── hooks/
        ├── services/
        └── types/
```

---

## ⚙️ Configuration

### 1. Environment Variables
Copy `.env.example` to `.env` and update:

```bash
# Required - Update These
OLLAMA_API_BASE=http://YOUR_WINDOWS_IP:11434
POSTGRES_PASSWORD=your_secure_password
LITELLM_MASTER_KEY=sk-your-secure-master-key
JWT_SECRET=your-jwt-secret-key
GRAFANA_PASSWORD=your-grafana-password

# Optional - Add if you have
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GROQ_API_KEY=gsk_your-groq-key
GEMINI_API_KEY=your-gemini-key
TOGETHER_AI_API_KEY=your-together-ai-key
```

### 2. LiteLLM Configuration
Edit `config/litellm_config.yaml`:

```yaml
# Update YOUR_WINDOWS_IP in all api_base entries
api_base: "http://YOUR_WINDOWS_IP:11434"

# Add your custom models
model_list:
  - model_name: "custom/my-model"
    litellm_params:
      model: "ollama/my-model"
      api_base: "http://YOUR_WINDOWS_IP:11434"
```

---

## 🐳 Docker Services

### Core Services
| Service | Port | Purpose | Health Check |
|---------|-------|---------|---------------|
| PostgreSQL | 5432 | Database | `curl localhost:5432` |
| Redis | 6379 | Cache | `curl localhost:6379` |
| LiteLLM | 4000 | AI Gateway | `curl localhost:4000/health` |
| Backend | 3001 | API Server | `curl localhost:3001/health` |
| Frontend | 3002 | Web Interface | `curl localhost:3002` |

### Monitoring Services
| Service | Port | Purpose | Access |
|---------|-------|---------|--------|
| Grafana | 3000 | Dashboards | http://localhost:3000 |
| Prometheus | 9090 | Metrics | http://localhost:9090 |
| Redis Commander | 8081 | Redis UI | http://localhost:8081 |
| PgAdmin | 5050 | Database Admin | http://localhost:5050 |

---

## 🔧 Build Commands

### Initial Setup
```bash
# Clone and configure
git clone https://github.com/sleehoco/ai-gateway.git
cd ai-gateway
cp .env.example .env
nano .env  # Edit your values

# Build all images
docker-compose build --no-cache

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### Development Mode
```bash
# Start with live logs
docker-compose up

# Rebuild specific service
docker-compose up -d --build backend

# Access container shell
docker exec -it ai-gateway-backend sh
```

### Production Mode
```bash
# Production build
docker-compose -f docker-compose.yml build

# Deploy with scaling
docker-compose up -d --scale backend=2

# Background deployment
nohup docker-compose up -d > /dev/null 2>&1 &
```

---

## 🔍 Verification Steps

### 1. Service Health
```bash
# Test all services
curl http://localhost:4000/health && echo "✅ LiteLLM OK"
curl http://localhost:3001/health && echo "✅ Backend OK"
curl http://localhost:3002 && echo "✅ Frontend OK"
curl http://localhost:3000 && echo "✅ Grafana OK"
```

### 2. Database Connection
```bash
# Test PostgreSQL
docker exec ai-gateway-postgres pg_isready -U ai_gateway -d ai_gateway

# Manual connection test
docker exec -it ai-gateway-postgres psql -U ai_gateway -d ai_gateway -c "SELECT version();"
```

### 3. Model Integration
```bash
# Test Ollama directly
curl http://YOUR_WINDOWS_IP:11434/api/tags

# Test through LiteLLM
curl -X POST http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ollama/llama3.2:3b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### 4. Web Interface Functionality
```bash
# Test API endpoints
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "email": "admin@test.com", "password": "test123"}'

# Test model listing
curl -X GET http://localhost:3001/api/models \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🌐 Access URLs

After successful deployment:

| Service | URL | Credentials |
|---------|------|------------|
| Web Interface | http://localhost:3002 | Register first user |
| API Documentation | http://localhost:3001/api-docs | JWT token required |
| LiteLLM API | http://localhost:4000/v1 | Master key required |
| Grafana | http://localhost:3000 | admin / your_grafana_password |
| PgAdmin | http://localhost:5050 | admin@yourdomain.com / your_pgadmin_password |
| Redis Commander | http://localhost:8081 | No auth required |
| Prometheus | http://localhost:9090 | No auth required |

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tulpn | grep -E ":(3000|3001|3002|4000|5432)"

# Solution: Change ports in docker-compose.yml
```

#### Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres

# Manual database creation
docker exec ai-gateway-postgres createdb -U ai_gateway ai_gateway
```

#### Ollama Connection Issues
```bash
# Test direct connection
curl http://YOUR_WINDOWS_IP:11434/api/tags

# Check Windows Firewall
# On Windows: Settings > Network > Windows Firewall > Allow app

# Restart Ollama service
# Windows: Services > Ollama > Restart
```

#### Memory Issues
```bash
# Check resource usage
docker stats

# Increase swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to /etc/fstab
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### Service Won't Start
```bash
# Check logs for errors
docker-compose logs [service-name]

# Check configuration
docker-compose config

# Force recreate
docker-compose up -d --force-recreate [service-name]
```

---

## 📈 Performance Optimization

### Database Performance
```bash
# Connection pooling in .env
DATABASE_URL=postgresql://ai_gateway:password@postgres:5432/ai_gateway?connection_limit=20&pool_timeout=30

# PostgreSQL optimization
docker exec ai-gateway-postgres psql -U ai_gateway -d ai_gateway -c "
ALTER SYSTEM SET shared_buffers = 256MB;
ALTER SYSTEM SET effective_cache_size = 1GB;
VACUUM ANALYZE;
"
```

### Application Performance
```bash
# Add Redis caching
# Already configured in docker-compose.yml

# Enable compression
# Already configured in nginx.conf

# Resource limits in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

---

## 🔒 Security Hardening

### 1. Update Secrets
```bash
# Generate secure passwords
openssl rand -base64 32  # JWT secret
openssl rand -base64 16  # Database password

# Update .env file
nano .env
```

### 2. Network Security
```bash
# Firewall rules
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 4000/tcp  # Restrict LiteLLM to local only
sudo ufw deny 3001/tcp  # Restrict backend to local only
sudo ufw enable

# Docker network isolation
# Already configured with custom bridge network
```

### 3. Application Security
```bash
# Rate limiting
# Already configured in litellm_config.yaml

# Input validation
# Already implemented in backend middleware

# HTTPS with Cloudflare
# Configure Cloudflare tunnel for production
cloudflared tunnel create ai-gateway
cloudflared tunnel route dns ai-gateway.yourdomain.com localhost:3002
```

---

## 📊 Monitoring Setup

### Grafana Dashboards
1. Access http://localhost:3000
2. Login with admin credentials
3. Import pre-configured dashboards:
   - AI Gateway Overview
   - Model Performance Metrics
   - User Analytics Dashboard
   - System Health Monitoring

### Prometheus Metrics
1. Access http://localhost:9090
2. Check targets: http://localhost:9090/targets
3. View metrics: http://localhost:9090/metrics
4. Set up alerting rules

### Custom Alerts
```yaml
# Create config/alert_rules.yml
groups:
  - name: ai_gateway_alerts
    rules:
      - alert: HighLatency
        expr: avg(litellm_request_duration_seconds) > 5
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
      
      - alert: HighErrorRate
        expr: rate(litellm_requests_failed_total[5m]) > 0.1
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
```

---

## 🔄 Backup & Recovery

### Automated Backup
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/ai-gateway/backups"
mkdir -p $BACKUP_DIR

# Backup configurations
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" .env config/

# Backup database
docker exec ai-gateway-postgres pg_dump -U ai_gateway ai_gateway > "$BACKUP_DIR/postgres_$DATE.sql"

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/ai-gateway/backup.sh
```

### Disaster Recovery
```bash
# Complete system reset
docker-compose down -v
docker-compose up -d

# Restore from backup
docker exec -i ai-gateway-postgres psql -U ai_gateway -d ai_gateway < backup_20241206.sql

# Verify recovery
curl http://localhost:3001/health
```

---

## 📚 Documentation

### API Documentation
- **Swagger UI**: http://localhost:3001/api-docs
- **OpenAPI Spec**: http://localhost:3001/api/docs
- **Model Endpoints**: http://localhost:4000/v1/models

### User Documentation
1. **Registration**: Create account at http://localhost:3002/register
2. **Login**: Use credentials at http://localhost:3002/login
3. **Model Selection**: Configure preferred models in dashboard
4. **API Keys**: Generate personal API keys in settings
5. **Usage Analytics**: Monitor consumption in analytics section

---

## ✅ Success Criteria

Your AI Gateway is fully operational when:

- [ ] All Docker containers running: `docker-compose ps`
- [ ] Web interface accessible: http://localhost:3002
- [ ] API backend healthy: `curl http://localhost:3001/health`
- [ ] LiteLLM responding: `curl http://localhost:4000/health`
- [ ] Database connected: Check backend logs
- [ ] Ollama models listed: Test through LiteLLM
- [ ] Monitoring active: Grafana dashboards populated
- [ ] Users can register and login
- [ ] Chat interface functional
- [ ] Model management working

---

## 🎉 Next Steps

1. **Customize**: Add your own models and routing rules
2. **Scale**: Add more backend instances based on load
3. **Monitor**: Set up alerts and notifications
4. **Secure**: Configure HTTPS with Cloudflare tunnel
5. **Optimize**: Fine-tune performance based on usage patterns

**Support Resources**:
- **Logs**: `docker-compose logs -f [service-name]`
- **Health Checks**: Service `/health` endpoints
- **Documentation**: In-app help system
- **Community**: GitHub issues and discussions

Your complete AI gateway system is ready! 🚀