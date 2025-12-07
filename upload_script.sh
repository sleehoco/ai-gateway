#!/bin/bash

# AI Gateway Upload Script
set -e

# Configuration
REPO_DIR="/home/sysadmin/ai-gateway"
GITHUB_REPO="https://github.com/sleehoco/ai-gateway.git"
BRANCH="main"

echo "🚀 Starting upload to $GITHUB_REPO..."

# Ensure we are in the right directory
cd "$REPO_DIR"

# Initialize Git if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git..."
    git init
    git branch -M "$BRANCH"
    git remote add origin "$GITHUB_REPO"
else
    echo "✅ Git already initialized"
    # Ensure remote is correct
    git remote set-url origin "$GITHUB_REPO"
fi

# Configure Git user
git config user.email "slee@hocomd.com"
git config user.name "slee"

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
build/
.env
logs/
*.log
.DS_Store
EOF

# Add files
echo "➕ Adding files..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "Update AI Gateway: Hybrid Local/Cloud OpenRouter Mirror

- Added support for Together AI, OpenAI, Groq, Anthropic
- Configured smart routing (Local 1080ti -> Cloud Fallback)
- Added 'OpenRouter-style' unified API endpoint
- Updated Docker configuration for Unraid/Windows bridge" || echo "Nothing to commit"

# Push
echo "b Pushing to GitHub..."
git push -u origin "$BRANCH"

echo "✅ Upload Complete!"
echo "You can now pull this on your Unraid server."
