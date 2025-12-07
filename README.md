# 🏠 Locally Hosted AI Gateway (OpenRouter Mirror)

A secure, private, and locally hosted AI Gateway that mirrors OpenRouter functionality on your own hardware. It bridges your local Unraid server, Windows GPU machine, and Cloudflare for secure remote access.

## 🚀 Key Advantages

- **100% Data Control**: Your chats and data stay on your local network (Unraid & Windows).
- **Zero Latency**: Direct LAN connection between your API and your GPU.
- **Hybrid Power**: Use local Ollama models for free inference, fallback to Cloud (OpenAI/Anthropic) only when needed.
- **Enterprise Security**: Uses Cloudflare for **Reverse Proxy** and **WAF** (Web Application Firewall) protection.

## 🏗️ System Architecture

This system is designed to run on **Unraid** but connects to a powerful **Windows PC** for inference.

```mermaid
graph TD
    User[You / Web Browser] -->|https| CF[Cloudflare Edge]
    CF -->|WAF & DDoS Protection| Tunnel[Cloudflared Tunnel]
    Tunnel -->|Secure Connection| Unraid[Unraid Server]
    
    subgraph "Unraid Docker Stack"
        FE[React Frontend]
        BE[Node.js Backend]
        GW[LiteLLM Gateway]
        DB[(Postgres DB)]
    end
    
    Unraid --> FE
    FE --> BE
    BE --> GW
    GW --> DB
    
    subgraph "Windows Gaming PC (1080ti)"
        Ollama[Ollama Server]
        GPU[NVIDIA GPU]
    end
    
    GW -->|LAN Request| Ollama
    Ollama -->|Inference| GPU
```

## 🛠️ Components

### 1. The Brain (Windows PC)
*   **Software**: Ollama (Windows Version)
*   **Hardware**: NVIDIA 1080ti (11GB VRAM)
*   **Role**: Runs the heavy AI models (Llama 3, Mistral, Dolphin) locally.

### 2. The Body (Unraid Server)
*   **Software**: Docker, LiteLLM, Web Application
*   **Role**: Hosts the interface, manages users, and routes traffic.
*   **Integration**: Connects to Windows via local IP (e.g., `192.168.1.50`).

### 3. The Shield (Cloudflare)
*   **Software**: Cloudflared Container + Cloudflare Zero Trust
*   **Role**: 
    *   **Reverse Proxy**: Routes `ai.yourdomain.com` to your local Docker containers without opening ports.
    *   **WAF**: Protects your gateway from attacks, bots, and unauthorized access attempts.
    *   **Authentication** (Optional): Can enforce Cloudflare Access login before reaching your app.

## 📦 Quick Start (Unraid)

1.  **Clone this repo** to your Unraid AppData:
    ```bash
    git clone https://github.com/sleehoco/ai-gateway.git /mnt/user/appdata/ai-gateway
    ```

2.  **Configure Environment**:
    ```bash
    cp .env.example .env
    nano .env
    ```
    *   Set `OLLAMA_API_BASE` to your Windows PC's IP address.
    *   Set `CLOUDFLARE_TUNNEL_TOKEN` from your Cloudflare Dashboard.

3.  **Launch**:
    ```bash
    docker-compose up -d --build
    ```

4.  **Access**:
    *   **Local**: `http://<UNRAID_IP>:3002`
    *   **Remote**: `https://ai.yourdomain.com` (Protected by Cloudflare WAF)

## 🤖 Supported Models

### Uncensored / Local (Free)
*   `local/dolphin` (Dolphin Mistral - Uncensored)
*   `local/llama3.2` (Meta Llama 3.2 - Fast)
*   `local/mistral` (Mistral 7B - Balanced)

### Cloud Fallback (Optional)
*   `gpt-4o` (OpenAI)
*   `claude-3-5-sonnet` (Anthropic)
*   `groq/llama3` (Groq - Super Fast)
*   `hf/llama3-70b` (Hugging Face API)

## 🏗️ Using Hugging Face

You can use Hugging Face in two ways with this gateway:

1.  **Cloud API (Configured)**: Add your `HUGGINGFACE_API_KEY` to `.env`. You can then route requests to `hf/llama3-70b` or any model on the Hugging Face Inference API.
2.  **Local Imports (Ollama)**: Find any GGUF model on Hugging Face, download it, and create a Modelfile in Ollama on your Windows machine.
    ```bash
    # Example: Importing a custom GGUF from Hugging Face to Ollama
    ollama pull hf.co/bartowski/Llama-3.2-3B-Instruct-GGUF
    ```

## 🔐 Security Features
*   **Local-First**: All model routing happens inside your LAN.
*   **Authentication**: Multi-user login system protected by JWT.
*   **Zero Trust**: No open ports on your router firewall; all ingress traffic is filtered through Cloudflare's WAF.
