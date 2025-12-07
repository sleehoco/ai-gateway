# AI Gateway: The Complete Setup Guide

This guide describes how to build a distributed AI system across three specific environments:
1.  **Windows PC** (The Brain): Hosts the GPU and Ollama models.
2.  **Cloudflare** (The Security): Provides secure remote access without port forwarding.
3.  **Unraid Server** (The Host): Runs the web application and gateway logic via Docker.

---

## 🛑 Phase 1: Windows PC Setup (The "Brain")
*Perform these steps on your Windows machine with the 1080ti.*

**Why?** By default, Ollama only listens to itself (`localhost`). We must force it to listen to the network so Unraid can talk to it.

1.  **Open PowerShell as Administrator.**
2.  **Allow Network Access:**
    Run this command to tell Ollama to listen on all network interfaces:
    ```powershell
    setx OLLAMA_HOST "0.0.0.0:11434" /M
    ```
3.  **Open Windows Firewall:**
    Run this command to allow traffic on port 11434:
    ```powershell
    netsh advfirewall firewall add rule name="Ollama" dir=in action=allow protocol=TCP localport=11434
    ```
4.  **Restart Ollama:**
    *   Find the Ollama icon in your system tray (bottom right).
    *   Right-click -> **Quit**.
    *   Start Ollama again from the Start Menu.
5.  **Get Your IP Address:**
    *   Run `ipconfig` in PowerShell.
    *   Note your **IPv4 Address** (e.g., `192.168.1.50`). You will need this later.

---

## ☁️ Phase 2: Cloudflare Setup (The "Door")
*Perform these steps in your Web Browser.*

**Why?** We will use a "Tunnel" to securely expose your web interface to the internet. This is safer than opening ports on your router.

1.  Log in to the **Cloudflare Zero Trust Dashboard**.
2.  Go to **Networks > Tunnels**.
3.  Click **Create a Tunnel**.
    *   Select **Cloudflared**.
    *   Name it: `ai-gateway`.
4.  **Important:** You will see a screen with installation commands. **Ignore the install commands.**
    *   Look for the token string: `eyJhIjoi...`
    *   **COPY THIS TOKEN.** This is your `TUNNEL_TOKEN`.
5.  **Configure Public Hostname (Routing):**
    *   **Public Hostname:** `ai.yourdomain.com` (or whatever you prefer).
    *   **Service:** `HTTP` -> `ai-gateway-frontend:3000`
    *   *Note: We point it to the docker container name, not localhost.*

---

## 🐳 Phase 3: Development & Upload (The "Code")
*Perform these steps on your Local Machine (where you are reading this).*

We will create the web application source code and upload it to GitHub so Unraid can pull it down.

### 1. Create the Repository Structure
*(Done automatically by the build script)*

### 2. Upload to GitHub
Run the provided upload script to push the code to `https://github.com/sleehoco/ai-gateway`.

---

## 🖥️ Phase 4: Unraid Deployment (The "Body")
*Perform these steps on your Unraid Server via Terminal/SSH.*

1.  **Navigate to AppData:**
    ```bash
    cd /mnt/user/appdata
    ```
2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/sleehoco/ai-gateway.git
    cd ai-gateway
    ```
3.  **Configure Environment:**
    Copy the template and edit it:
    ```bash
    cp .env.example .env
    nano .env
    ```
    **You must change these lines:**
    *   `OLLAMA_API_BASE=http://<YOUR_WINDOWS_IP>:11434` (Use the IP from Phase 1).
    *   `CLOUDFLARE_TUNNEL_TOKEN=<YOUR_TOKEN_EY...>` (Use the token from Phase 2).
    *   `LITELLM_MASTER_KEY=sk-your-secret-key` (Make one up).

4.  **Build and Launch:**
    This command compiles the web app and starts the containers:
    ```bash
    docker-compose up -d --build
    ```

5.  **Verify:**
    *   **Internal Test:** Open `http://<UNRAID_IP>:3002` in your browser.
    *   **External Test:** Open `https://ai.yourdomain.com` (from Cloudflare setup).

---

## 🛠️ Troubleshooting

**"Unraid can't connect to Windows Ollama"**
*   From Unraid terminal, run: `curl http://<WINDOWS_IP>:11434`
*   If it hangs: Check Windows Firewall (Phase 1, Step 3).
*   If it says "Connection refused": Check `OLLAMA_HOST` setting (Phase 1, Step 2) and restart Ollama.

**"Cloudflare Tunnel isn't working"**
*   Check container logs: `docker logs ai-gateway-tunnel`
*   Ensure the `TUNNEL_TOKEN` in `.env` is correct and has no spaces/quotes.

**"Web App shows 'Build Failed'"**
*   Unraid needs internet access to download Node.js packages during the build. Check your server's DNS settings.
