# ⚡ Quick Start: AI Gateway

Get your Hybrid AI Gateway running in 5 minutes.

## 1️⃣ Windows Setup (The Brain)
*Run in PowerShell (Admin) on your GPU machine:*

```powershell
setx OLLAMA_HOST "0.0.0.0:11434" /M
netsh advfirewall firewall add rule name="Ollama" dir=in action=allow protocol=TCP localport=11434
# Restart Ollama app after this!
```

## 2️⃣ Cloudflare Setup (The Shield)
1. Go to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/).
2. Create a Tunnel named `ai-gateway`.
3. Copy the **Token** (`eyJh...`).
4. Route `ai.yourdomain.com` -> `HTTP://ai-gateway-frontend:3000`.

## 3️⃣ Unraid Deployment (The Host)
*Run in Unraid Terminal:*

```bash
# 1. Download
git clone https://github.com/sleehoco/ai-gateway.git /mnt/user/appdata/ai-gateway
cd /mnt/user/appdata/ai-gateway

# 2. Config
cp .env.example .env
nano .env
# -> Paste CLOUDFLARE_TUNNEL_TOKEN
# -> Set OLLAMA_API_BASE to Windows IP (e.g. http://192.168.1.50:11434)

# 3. Launch
docker-compose up -d --build
```

## 4️⃣ Done! 🚀

*   **Web Dashboard**: `https://ai.yourdomain.com`
*   **API Endpoint**: `https://ai.yourdomain.com/v1`
*   **OpenCode Config**:
    ```json
    {
      "provider": "openai",
      "api_base": "https://ai.yourdomain.com/v1",
      "api_key": "YOUR_MASTER_KEY",
      "model": "together/deepseek-v3"
    }
    ```
