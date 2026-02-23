# Smart Grind - Master Coding Interviews Intelligently

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![GitHub Stars](https://img.shields.io/github/stars/AlgoVyn/smart-grind?style=flat-square)
![GitHub Forks](https://img.shields.io/github/forks/AlgoVyn/smart-grind?style=flat-square)
![GitHub Issues](https://img.shields.io/github/issues/AlgoVyn/smart-grind?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/AlgoVyn/smart-grind?style=flat-square)

**Smart Grind** is a complete platform for mastering coding interviews. It combines a **Chrome extension** for LeetCode practice with a **web application** for structured, pattern-based learning with spaced repetition.

<p align="center">
  <strong>🌐 Live Demo:</strong> <a href="https://algovyn.com/smartgrind">algovyn.com/smartgrind</a><br>
  <strong>🧩 Chrome Extension:</strong> <a href="https://chromewebstore.google.com/detail/smartgrind/eaolfkdmfnnanbfkaejnkcfafpankcmp">Install from Chrome Web Store</a>
</p>

---

## Table of Contents

- [Smart Grind - Master Coding Interviews Intelligently](#smart-grind---master-coding-interviews-intelligently)
  - [Table of Contents](#table-of-contents)
  - [Why Smart Grind?](#why-smart-grind)
    - [Key Benefits](#key-benefits)
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

## Why Smart Grind?

Traditional LeetCode practice is inefficient. Smart Grind solves common problems:

| Challenge | Smart Grind Solution |
|-----------|----------------------|
| ❓ Which problems to practice? | Intelligent random selection with rating ranges |
| 📉 Rating fluctuations | EMA + Bayesian smoothing for accurate estimates |
| 😰 Random difficulty jumps | Targeted practice within your skill level |
| 📚 Too many problem patterns | Organized pattern-based learning system |
| 🔄 Forgetting solutions | Spaced repetition scheduling |

### Key Benefits

- ⏱️ **Save Time** — Focus on problems matching your skill level
- 📈 **Track Progress** — Visualize improvement over time
- 🎯 **Targeted Practice** — Filter by tags, difficulty, and patterns
- 🧠 **Smart Scheduling** — Spaced repetition for long-term retention
- 🤖 **AI Assistance** — Instant explanations from ChatGPT, Gemini, and Grok

---

## Components

### 🧩 Chrome Extension

Enhances your LeetCode experience with numerical ratings and smart problem selection.

| Feature | Description |
|---------|-------------|
| 📊 **Numerical Ratings** | 0–3000 scale instead of Easy/Medium/Hard |
| 📈 **Smart Rating Calculation** | EMA and Bayesian smoothing |
| 🎲 **Random Problem Selection** | Filter by rating ranges and tags |
| 📝 **Progress Tracking** | Automatic submission monitoring |
| 💾 **Persistent Settings** | Cross-session preferences |

> 📖 See the [Chrome Extension README](chrome-extension/README.md) for detailed documentation.

---

### 🌐 Web Application

A full-featured web app for systematic pattern practice with spaced repetition.

| Feature | Description |
|---------|-------------|
| 📚 **Pattern-Based Learning** | Organized by Two Pointers, Sliding Window, etc. |
| 🔄 **Spaced Repetition** | Intervals: 1, 3, 7, 14, 30, 60 days |
| 📊 **Progress Visualization** | Statistics and review tracking |
| ➕ **Custom Problems** | Add your own with category organization |
| 📝 **Personal Notes** | Document your insights |
| 🤖 **AI Integration** | ChatGPT, Gemini, Grok support |
| 🎨 **Theme Toggle** | Light/dark mode with keyboard shortcuts |
| 📱 **Mobile Responsive** | Works on all devices |

> 📖 See the [Web App README](website/README.md) for detailed documentation.

---

## Quick Start

### Chrome Extension

1. **Clone the repository** (if not already done)
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the `chrome-extension/` folder
5. **Visit LeetCode** — the extension activates automatically

```bash
# Navigate to the extension directory
cd chrome-extension/
```

### Web Application

```bash
# Navigate to the website directory
cd website/

# Install dependencies
npm install

# Copy the example configuration
cp wrangler.toml.example wrangler.toml

# Run locally
npm run dev

# Deploy to Cloudflare (optional)
npm run deploy
```

> ⚠️ **Note:** You must configure `wrangler.toml` with your Cloudflare credentials before running. See the [Website README](website/README.md#installation--setup) for details.

---

## Project Structure

```
smart-grind/
├── chrome-extension/     # Chrome extension (Manifest V3)
│   ├── manifest.json     # Extension manifest
│   ├── popup.html       # Extension popup UI
│   ├── popup.js         # Popup logic
│   ├── content.js       # Page injection script
│   ├── background.js    # Service worker
│   ├── DATA_FORMAT.md  # Data documentation
│   ├── README.md       # Extension docs
│   └── screenshots/    # Extension screenshots
│
├── website/              # Web application (Cloudflare Pages)
│   ├── public/          # Static assets & SPA
│   │   ├── index.html  # Main application
│   │   ├── patterns/   # Pattern definitions
│   │   └── solutions/  # Problem solutions
│   ├── functions/      # Cloudflare Worker API
│   ├── src/            # Frontend JavaScript
│   ├── tests/          # Unit & integration tests
│   ├── e2e/            # End-to-end tests
│   ├── package.json    # Dependencies
│   └── README.md      # Web app docs
│
├── logo/                # Project logos (SVG/PNG)
├── .gitignore
└── README.md           # This file
```

---

## Tech Stack

| Layer | Technology |
|:------|:------------|
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

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: Ensure all tests pass
5. **Commit** using conventional commits (`feat:`, `fix:`, `docs:`)
6. **Submit** a pull request with a clear description

> See the individual README files in each component directory for specific contribution guidelines.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the [LICENSE](chrome-extension/LICENSE) file for details.

---

## Support

| Need | Contact |
|------|---------|
| 🌐 **Website** | [algovyn.com/smartgrind](https://algovyn.com/smartgrind) |
| 🐛 **Issues** | [Open an issue](https://github.com/AlgoVyn/smart-grind/issues) |
| 💬 **Discussions** | [GitHub Discussions](https://github.com/AlgoVyn/smart-grind/discussions) |
| 📧 **Email** | support@algovyn.com |

---

<div align="center">

**Happy grinding! 🎉**

[![Built with ❤️](https://img.shields.io/badge/Built%20with-%E2%9D%A4-red?style=flat-square)](https://github.com/AlgoVyn/smart-grind)

</div>

