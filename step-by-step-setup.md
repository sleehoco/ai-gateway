# AI Gateway: Master Deployment Guide

This guide describes how to build a **Hybrid AI Gateway** that mirrors OpenRouter functionality. It combines your local **Windows 1080ti GPU** with cloud providers like **Together AI** and **OpenAI**, securely exposed via **Cloudflare**.

---

## 🏗️ System Architecture

1.  **Windows PC** ("The Brain"): Runs local, uncensored models (Dolphin, Mistral) on your 1080ti via Ollama.
2.  **Unraid Server** ("The Host"): Runs the Gateway (LiteLLM), Web Interface, and Database via Docker.
3.  **Cloudflare** ("The Shield"): Provides secure HTTPS access and WAF protection.
4.  **OpenCode** ("The Client"): Connects securely to your gateway for coding assistance.

---

## 🛑 Phase 1: Windows PC Setup (Local Inference)
*Perform these steps on your Windows machine with the 1080ti.*

1.  **Open PowerShell as Administrator.**
2.  **Allow Network Access:**
    ```powershell
    setx OLLAMA_HOST "0.0.0.0:11434" /M
    ```
3.  **Open Windows Firewall:**
    ```powershell
    netsh advfirewall firewall add rule name="Ollama" dir=in action=allow protocol=TCP localport=11434
    ```
4.  **Restart Ollama:** Quit from the system tray and restart.
5.  **Get IP Address:** Run `ipconfig` and note the IPv4 address (e.g., `192.168.1.50`).

---

## ☁️ Phase 2: Cloudflare Setup (Security)
*Perform these steps in your Web Browser.*

1.  Log in to **Cloudflare Zero Trust**.
2.  Go to **Networks > Tunnels** and create a tunnel named `ai-gateway`.
3.  **Copy the Token:** Save the `eyJh...` token string.
4.  **Configure Public Hostname:**
    *   **Domain:** `ai.yourdomain.com`
    *   **Service:** `HTTP` -> `ai-gateway-frontend:3000` (Routes to Web UI)
    *   **Add Path:** `/v1` -> `http://ai-gateway-engine:4000` (Routes API calls to LiteLLM)

---

## 🖥️ Phase 3: Unraid Deployment (The Core)
*Perform these steps on your Unraid Server terminal.*

### 1. Setup Directory
```bash
mkdir -p /mnt/user/appdata/ai-gateway
cd /mnt/user/appdata/ai-gateway
```

### 2. Clone Repository
```bash
git clone https://github.com/sleehoco/ai-gateway.git .
```

### 3. Configure Environment
Copy the template and edit it:
```bash
cp .env.example .env
nano .env
```

**Critical Settings to Change:**
*   `OLLAMA_API_BASE`: `http://192.168.1.50:11434` (Your Windows IP)
*   `CLOUDFLARE_TUNNEL_TOKEN`: Paste your `eyJh...` token.
*   `LITELLM_MASTER_KEY`: Set a strong password (sk-...) for OpenCode authentication.
*   `TOGETHER_AI_API_KEY`: Required for DeepSeek V3/R1.
*   `HUGGINGFACE_API_KEY`: Optional for extra models.

### 4. Build and Launch
```bash
docker-compose up -d --build
```

---

## 💻 Phase 4: Client Configuration (OpenCode)
*Perform these steps on your Laptop/Dev Machine.*

To use your gateway with **OpenCode** securely:

1.  **Locate/Create Config:** `~/.opencode/config.json`
2.  **Add Connection Details:**

```json
{
  "provider": "openai",
  "api_base": "https://ai.yourdomain.com/v1",
  "api_key": "YOUR_LITELLM_MASTER_KEY",
  "model": "together/deepseek-v3",
  "models": [
    "together/deepseek-v3",
    "together/deepseek-r1",
    "gpt-4o",
    "local/dolphin"
  ]
}
```

---

## 🤖 Available Models

### 🚀 High-Speed / Cloud
| Model Name | Provider | Best For |
| :--- | :--- | :--- |
| `together/deepseek-v3` | Together AI | **Best Overall** (Coding/Reasoning) |
| `together/deepseek-r1` | Together AI | **Reasoning** (Math/Logic) |
| `together/llama-3-70b` | Together AI | General Purpose |
| `groq/llama3-8b` | Groq | **Instant** Responses |

### 🏠 Local / Uncensored (Windows 1080ti)
| Model Name | Provider | Best For |
| :--- | :--- | :--- |
| `local/dolphin` | Local Ollama | **Unfiltered** / Creative |
| `local/mistral` | Local Ollama | General Local Tasks |

### 🌐 Big Tech Fallback
| Model Name | Provider | Best For |
| :--- | :--- | :--- |
| `gpt-4o` | OpenAI | Complex Instructions |
| `claude-3-5-sonnet` | Anthropic | Nuanced Writing |

---

## 🛠️ Maintenance & Updates

**To update your gateway with new code/models:**

```bash
cd /mnt/user/appdata/ai-gateway
git pull origin main
docker-compose up -d --build
```

**To check logs:**
```bash
docker logs -f ai-gateway-backend
docker logs -f ai-gateway-engine
```
