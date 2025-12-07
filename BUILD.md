# AI Gateway Build & Deployment Guide

## 📋 Prerequisites Checklist

- [ ] Docker and Docker Compose installed (Unraid)
- [ ] 11GB+ RAM available (for smooth operation)
- [ ] **Windows PC with 1080ti** (for local inference)
- [ ] **Cloudflare Account** (for secure remote access)
- [ ] Cloud provider API keys (optional: Together AI, OpenAI, etc.)

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/sleehoco/ai-gateway.git /mnt/user/appdata/ai-gateway
cd /mnt/user/appdata/ai-gateway

# 2. Configure environment
cp .env.example .env
nano .env  # IMPORTANT: Set OLLAMA_API_BASE and CLOUDFLARE_TUNNEL_TOKEN

# 3. Build and start
docker-compose up -d --build

# 4. Verify deployment
docker-compose ps
# Access at https://ai.yourdomain.com (Remote) or http://<UNRAID_IP>:3002 (Local)
```

---

## 🏗️ System Architecture (Hybrid)

This system uses a **Hybrid Architecture** to balance cost, privacy, and power.

1.  **Local Inference (Free)**: Small & Medium models (`llama3.2`, `mistral`, `dolphin`) run on your **Windows 1080ti**.
2.  **Cloud Inference (Power)**: Massive models (`deepseek-v3`, `gpt-4o`) run via **Together AI** or **OpenAI**.
3.  **Secure Access**: All traffic is routed through **Cloudflare Zero Trust** (WAF + Tunnel).

---

## 🐳 Docker Services

| Service | Port | Purpose | Health Check |
|---------|-------|---------|---------------|
| `tunnel` | - | Cloudflare Secure Tunnel | Auto-restarts |
| `litellm` | 4000 | AI Routing Engine | `/health` |
| `backend` | 3001 | API & User Logic | `/health` |
| `frontend` | 3002 | Web Dashboard | `/health` |
| `postgres` | 5432 | User Database | `pg_isready` |
| `redis` | 6379 | Caching | `redis-cli ping` |

---

## ⚙️ Configuration Guide

### 1. Environment Variables (`.env`)

```bash
# Windows Connectivity
OLLAMA_API_BASE=http://192.168.1.50:11434  # <--- YOUR WINDOWS IP

# Security
LITELLM_MASTER_KEY=sk-secure-random-key
CLOUDFLARE_TUNNEL_TOKEN=eyJh...           # <--- FROM CLOUDFLARE DASHBOARD

# AI Providers
TOGETHER_AI_API_KEY=...
OPENAI_API_KEY=...
```

### 2. Model Routing (`config/litellm_config.yaml`)

This file controls "who answers what".

*   **`local/*`**: Routes to Windows PC.
*   **`together/*`**: Routes to Together AI (DeepSeek, Qwen).
*   **`gpt-4o`**: Routes to OpenAI.

---

## 🔧 Maintenance Commands

### Update System
```bash
cd /mnt/user/appdata/ai-gateway
git pull origin main
docker-compose up -d --build
```

### Check Logs
```bash
# Gateway Engine
docker logs -f ai-gateway-engine

# Web Backend
docker logs -f ai-gateway-backend

# Cloudflare Tunnel
docker logs -f ai-gateway-tunnel
```

### Restart Specific Service
```bash
docker-compose restart litellm
```

---

## 🚨 Troubleshooting

### "Unraid can't talk to Windows"
*   **Check IP**: Is `OLLAMA_API_BASE` correct in `.env`?
*   **Check Firewall**: Did you run the PowerShell command to open port 11434 on Windows?
*   **Test**: Run `curl http://192.168.1.50:11434` from Unraid terminal.

### "Cloudflare Tunnel is down"
*   Check if the `tunnel` container is running.
*   Verify `CLOUDFLARE_TUNNEL_TOKEN` matches the one in your Dashboard.

### "OpenCode can't connect"
*   Ensure you are using `https://ai.yourdomain.com/v1` as the base URL.
*   Ensure your `api_key` matches `LITELLM_MASTER_KEY`.

---

## 🔒 Security Best Practices

1.  **Never expose ports 4000/3001** on your router. Only use Cloudflare.
2.  **Rotate Keys**: Change `LITELLM_MASTER_KEY` periodically.
3.  **WAF Rules**: Enable "Bot Fight Mode" in Cloudflare.

Your AI Gateway is built for production! 🚀
