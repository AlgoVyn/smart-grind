# Smart Grind - Smarter Problem Solving 🚀

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![GitHub Stars](https://img.shields.io/github/stars/AlgoVyn/smart-grind?style=flat-square)
![GitHub Forks](https://img.shields.io/github/forks/AlgoVyn/smart-grind?style=flat-square)
![GitHub Issues](https://img.shields.io/github/issues/AlgoVyn/smart-grind?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/AlgoVyn/smart-grind?style=flat-square)

**Smart Grind** is a powerful platform built to help you master coding challenges through intelligent tracking and optimized practice. It combines a **Chrome extension** for a seamless LeetCode experience with a **web application** for structured, pattern-based learning.

🚀 **Get Started:** [algovyn.com/smartgrind](https://algovyn.com/smartgrind)

---

## Table of Contents

- [Overview](#overview)
- [Components](#components)
  - [🧩 Chrome Extension](#-chrome-extension)
  - [🌐 Web Application](#-web-application)
- [Quick Start](#quick-start)
  - [Chrome Extension](#chrome-extension)
  - [Web Application](#web-application)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Overview

Smart Grind addresses common challenges in technical interview preparation:

| Challenge | Smart Grind Solution |
|-----------|---------------------|
| ❓ Which problems to practice? | Intelligent random selection with rating ranges |
| 📉 Rating fluctuations | EMA + Bayesian smoothing for accurate estimates |
| 😰 Random difficulty jumps | Targeted practice within your skill level |
| 📚 Too many problem patterns | Organized pattern-based learning system |
| 🔄 Forgetting solutions | Spaced repetition scheduling |

### Key Benefits

- ⏱️ **Save Time** - Focus on problems that match your skill level
- 📈 **Track Progress** - Visualize your improvement over time
- 🎯 **Targeted Practice** - Filter by tags, difficulty, and patterns
- 🧠 **Smart Scheduling** - Spaced repetition for long-term retention
- 🤖 **AI Assistance** - Get instant explanations from ChatGPT, Gemini, and Grok

---

## Components

### 🧩 Chrome Extension

A browser extension that enhances your LeetCode problem-solving experience with smart features.

**Key Features:**
- 📊 **Numerical Ratings** - 0-3000 scale instead of Easy/Medium/Hard
- 📈 **Smart Rating Calculation** - EMA and Bayesian smoothing
- 🎲 **Random Problem Selection** - Filter by rating ranges and tags
- 📝 **Progress Tracking** - Automatic submission monitoring
- 💾 **Persistent Settings** - Cross-session preferences

> 📖 [View Extension Documentation](chrome-extension/README.md)

---

### 🌐 Web Application

A full-featured web app for systematic pattern practice with spaced repetition.

**Key Features:**
- 📚 **Pattern-Based Learning** - Organized by Two Pointers, Sliding Window, etc.
- 🔄 **Spaced Repetition** - Intervals: 1, 3, 7, 14, 30, 60 days
- 📊 **Progress Visualization** - Statistics and review tracking
- ➕ **Custom Problems** - Add your own with category organization
- 📝 **Personal Notes** - Document your insights
- 🤖 **AI Integration** - ChatGPT, AI Studio (Gemini), Grok support
- 🎨 **Theme Toggle** - Light/dark mode with keyboard shortcuts
- 📱 **Mobile Responsive** - Works on all devices

> 📖 [View Web App Documentation](website/README.md)

---

## Quick Start

### Chrome Extension

```bash
# Navigate to the chrome-extension directory
cd chrome-extension/

# Load as unpacked extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the chrome-extension folder
# 5. Visit LeetCode to see enhanced displays
```

### Web Application

```bash
# Navigate to the website directory
cd website/

# Install dependencies
npm install

# Configure environment variables
cp wrangler.toml.example wrangler.toml

# Run locally
npm run dev

# Or deploy to Cloudflare
npm run deploy
```

---

## Project Structure

```
smart-grind/
├── chrome-extension/     # Chrome extension source code
│   ├── manifest.json     # Extension manifest
│   ├── popup.html        # Extension popup UI
│   ├── popup.js          # Popup logic
│   ├── content.js        # Page injection script
│   ├── background.js     # Service worker
│   ├── DATA_FORMAT.md    # Data documentation
│   └── README.md         # Extension docs
│
├── website/              # Web application source code
│   ├── public/           # Static assets
│   ├── functions/        # Cloudflare Worker functions
│   ├── tests/            # Test suite
│   ├── package.json      # Dependencies
│   └── README.md         # Web app docs
│
├── logo/                 # Project logos
├── .gitignore
└── README.md             # This file
```

---

## Tech Stack

| Aspect | Technology |
|:---|:---|
| **Chrome Extension** | JavaScript, Manifest V3 |
| **Frontend** | Vanilla JavaScript, Tailwind CSS |
| **Backend** | Cloudflare Workers (Edge Functions) |
| **Authentication** | Google OAuth 2.0, JWT |
| **Storage** | Cloudflare KV (Key-Value Store) |
| **Testing** | Vitest (Unit), Playwright (E2E) |
| **Deployment** | Cloudflare Pages |

---

## Contributing

We welcome contributions to both the extension and web app!

### General Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: Ensure all tests pass
5. **Commit**: Use conventional commits (`feat:`, `fix:`, `docs:`)
6. **Submit**: Open a pull request with a clear description

> Please see the individual README files in each component directory for specific contribution guidelines.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](chrome-extension/LICENSE) file for details.

---

## Support

For questions, feedback, or support:

- 🌐 **Website**: [algovyn.com/smartgrind](https://algovyn.com/smartgrind)
- 🐛 **Issues**: [Open an issue](https://github.com/AlgoVyn/smart-grind/issues)
- 📧 **Email**: support@algovyn.com

---

<div align="center">

**Happy grinding! 🎉**

[![Built with ❤️](https://img.shields.io/badge/Built%20with-%E2%9D%A4-red?style=flat-square)](https://github.com/AlgoVyn/smart-grind)

</div>

