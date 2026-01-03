# Smart Grind - Smarter Problem Solving

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Smart Grind** is a comprehensive platform designed to help you master coding problems through optimal practice and intelligent tracking. It consists of two main components: a Chrome extension for enhanced LeetCode experience and a web application for structured pattern-based learning.

Visit the official website: [algovyn.com/smartgrind](https://algovyn.com/smartgrind)

## Components

### 🧩 Chrome Extension
A browser extension that enhances your LeetCode problem-solving experience with smart features.

**Key Features:**
- Numerical difficulty ratings (0-3000 scale) instead of Easy/Medium/Hard labels
- Advanced user rating calculation using EMA and Bayesian smoothing
- Random problem selection with rating ranges and tag filters
- Automatic progress tracking with submission monitoring
- Persistent settings and cross-page support

📖 [View Extension Documentation](chrome-extension/README.md)

### 🌐 Web Application
A full-featured web app for systematic pattern practice with spaced repetition.

**Key Features:**
- Organized problem collections by algorithmic patterns (Two Pointers, Sliding Window, etc.)
- Spaced repetition system with intervals (1, 3, 7, 14, 30, 60 days)
- Progress visualization with statistics and review tracking
- Custom problem addition with category/pattern organization
- Note-taking system for personal insights
- AI integration (Gemini/Grok) with pre-filled solution prompts
- Theme toggle, keyboard shortcuts, and export functionality
- Mobile-responsive design with URL-based navigation

📖 [View Web App Documentation](website/README.md)

## Quick Start

### For the Chrome Extension
1. Navigate to the `chrome-extension/` directory
2. Load as unpacked extension in Chrome developer mode
3. Visit LeetCode to see enhanced problem displays

### For the Web Application
1. Navigate to the `website/` directory
2. Install dependencies: `npm install`
3. Configure environment variables
4. Run locally: `npm run dev` or deploy to Cloudflare

## Project Structure

```
smart-grind/
├── chrome-extension/     # Chrome extension source code
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── content.js
│   ├── background.js
│   └── README.md
├── website/             # Web application source code
│   ├── public/
│   ├── functions/
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md           # This file
```

## Contributing

We welcome contributions to both the extension and web app! Please see the individual README files in each component directory for specific contribution guidelines.

### General Guidelines
- Follow the existing code style and structure
- Test changes thoroughly
- Update documentation as needed
- Submit pull requests with clear descriptions

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Support

For questions, feedback, or support:
- Visit the official site: [algovyn.com/smartgrind](https://algovyn.com/smartgrind)
- Open an issue in the appropriate component repository

Happy grinding! 🚀