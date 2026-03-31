#!/bin/bash
# GitHub Authentication Setup Helper

# This script helps configure git to use a GitHub Personal Access Token

echo "GitHub HTTPS Authentication Setup"
echo "=================================="
echo ""
echo "Step 1: Generate a Personal Access Token on GitHub"
echo "  - Go to: https://github.com/settings/tokens"
echo "  - Click 'Generate new token (classic)'"
echo "  - Select scopes: repo (full control)"
echo "  - Generate and COPY the token immediately"
echo ""
echo "Step 2: Configure git to use the token"
echo "  Run these commands with your token:"
echo ""
echo "  git config --global credential.helper store"
echo "  git config --global user.name 'Adnan Yaqoob'"
echo "  git config --global user.email 'your-email@example.com'"
echo ""
echo "Step 3: First-time credential entry"
echo "  When you first push, git will ask for credentials:"
echo "  - Username: YOUR_GITHUB_USERNAME"
echo "  - Password: YOUR_PERSONAL_ACCESS_TOKEN"
echo ""
echo "The token will then be stored locally for future pushes."
