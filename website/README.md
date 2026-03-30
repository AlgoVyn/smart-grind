# Smart Grind — Pattern Practice Web App 🌐

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/🌐-Live%20Demo-blue)](https://algovyn.com/smartgrind)
[![Chrome Extension](https://img.shields.io/badge/🧩-Chrome%20Extension-orange)](https://chromewebstore.google.com/detail/smartgrind/eaolfkdmfnnanbfkaejnkcfafpankcmp)
![Node Version](https://img.shields.io/badge/Node-%3E%3D18-green)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

**Master coding interviews with intelligent pattern-based practice and spaced repetition.**

Smart Grind is a comprehensive web application featuring **450+ LeetCode problems** organized by **15+ algorithmic patterns**, complete with detailed explanations, flashcards, and AI integration. Track your progress across Two Pointers, Sliding Window, Dynamic Programming, Graph algorithms, and more.

<p align="center">
  <a href="https://algovyn.com/smartgrind">🌐 Website</a> •
  <a href="https://chromewebstore.google.com/detail/smartgrind/eaolfkdmfnnanbfkaejnkcfafpankcmp">🧩 Chrome Extension</a> •
  <a href="#quick-start">🚀 Quick Start</a> •
  <a href="#features">✨ Features</a>
</p>

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%">
      <img src="screenshots/website-dashboard.png" alt="Smart Grind Dashboard" width="100%"/>
      <p align="center"><b>Dashboard</b> — Browse patterns with progress tracking</p>
    </td>
    <td width="50%">
      <img src="screenshots/website-problem-view.png" alt="Smart Grind Problem View" width="100%"/>
      <p align="center"><b>Problem View</b> — Detailed explanations with visualizations</p>
    </td>
  </tr>
</table>

---

## 📑 Table of Contents

- [Why Smart Grind?](#why-smart-grind)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Security](#security)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Why Smart Grind?

| Problem | Smart Grind Solution |
|---------|---------------------|
| 😰 Too many problems, don't know where to start | 📚 **450+ curated problems** organized by 15+ patterns |
| 📉 Forget solutions after solving | 🔄 **Spaced repetition** schedules reviews at optimal intervals (1, 3, 7, 14, 30, 60 days) |
| 🎯 Can't identify which pattern applies | 🧩 **Pattern-based learning** with 97 detailed pattern guides |
| 📝 Lose track of insights and approaches | 🗒️ **Built-in notes system** with persistent storage |
| 🤖 Need help but prompts take too long | ⚡ **One-click AI integration** with pre-filled context for Gemini & Grok |
| 📱 Want to practice on mobile | 📲 **Progressive Web App** works offline on all devices |

### Learning Approach

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMART GRIND METHODOLOGY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. LEARN    →  Study pattern with detailed markdown guide      │
│  2. PRACTICE →  Solve curated problems (Easy → Medium → Hard)    │
│  3. NOTE     →  Document your insights and approach             │
│  4. REVIEW   →  Spaced repetition brings problems back          │
│  5. MASTER   →  Flashcards for active recall of key concepts    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Core Learning Features

| Feature | Description |
|---------|-------------|
| 📚 **450+ Curated Problems** | Hand-picked LeetCode problems across 15+ topics |
| 🧩 **97 Pattern Guides** | Detailed markdown explanations with complexity analysis |
| 🔄 **Spaced Repetition** | Automatic review scheduling: 1, 3, 7, 14, 30, 60, 90 days |
| 📊 **Progress Tracking** | Visual progress bars per pattern with completion % |
| 🗂️ **Topic Organization** | Hierarchical: Topics → Patterns → Problems |
| 🎴 **Flashcard System** | Active recall practice for algorithms and patterns |
| ➕ **Custom Problems** | Add your own problems with full tracking support |

### Productivity Features

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Search** | Find problems by name, pattern, or notes |
| 🔖 **Status Filtering** | View All, Solved, or Due for Review |
| 🤖 **AI Integration** | One-click prompts for Gemini & Grok |
| ⌨️ **Keyboard Shortcuts** | `/` for search, `E` for export, `Esc` to close modals |
| 📤 **Export/Import** | JSON backup with full progress preservation |
| 🌓 **Theme Toggle** | Light/dark mode with system preference detection |
| 📱 **Mobile Responsive** | Optimized for phones, tablets, and desktops |

### Technical Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google OAuth** | Secure authentication with JWT tokens |
| ☁️ **Cloud Sync** | Cross-device synchronization via Cloudflare KV |
| 🔌 **Offline Support** | Full functionality without internet (PWA) |
| 🔄 **Background Sync** | Automatic sync when connection restored |
| 💾 **Local-First** | Works without account; optional cloud backup |
| 🛡️ **Data Privacy** | User data encrypted at rest |

---

## 🚀 Quick Start

### Option 1: Use the Live Demo (Recommended)

Visit **[algovyn.com/smartgrind](https://algovyn.com/smartgrind)** — no installation required.

1. Click "Sign in with Google" (or use locally)
2. Browse topics in the sidebar
3. Click any problem to view details
4. Mark solved ✅ and add notes 📝
5. Return for scheduled reviews

### Option 2: Run Locally

```bash
# 1. Clone repository
git clone https://github.com/AlgoVyn/smart-grind.git
cd smart-grind/website

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:5173/smartgrind/
```

> **Note:** Local development works without authentication. Cloud sync features require OAuth setup (see [Environment Variables](#environment-variables)).

---

## 📦 Installation & Setup

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | ≥ 18 | JavaScript runtime |
| npm | ≥ 9 | Package manager |
| Cloudflare Account | — | For deployment & KV storage |
| Google Cloud Project | — | For OAuth authentication |

### Step-by-Step Setup

```bash
# 1. Clone and navigate
git clone https://github.com/AlgoVyn/smart-grind.git
cd smart-grind/website

# 2. Install dependencies
npm install

# 3. Configure environment
cp wrangler.toml.example wrangler.toml

# 4. Edit wrangler.toml with your credentials
# (see Environment Variables section below)

# 5. Run type checks
npm run type-check

# 6. Start development server
npm run dev

# 7. Run tests
npm test
```

### Project Structure

```
website/
├── src/                      # TypeScript source code
│   ├── api/                  # API client modules
│   ├── data/                 # Static data (450+ problems)
│   ├── renderers/            # UI rendering components
│   ├── sw/                   # Service Worker (offline support)
│   ├── types/                # TypeScript definitions
│   ├── ui/                   # UI handlers & interactions
│   └── utils/                # Utility functions
├── functions/api/            # Cloudflare Workers (backend)
├── public/                   # Static assets
│   ├── patterns/             # 97 pattern markdown guides
│   ├── algorithms/           # 87 algorithm explanations
│   └── index.html            # SPA entry point
├── tests/                    # Unit tests (Jest)
├── e2e/                      # E2E tests (Playwright)
└── docs/architecture/        # Detailed architecture docs
```

---

## 🔐 Environment Variables

### Configuration via `wrangler.toml`

```toml
name = "smart-grind"
compatibility_date = "2023-01-01"
pages_build_output_dir = "dist"

[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"

[vars]
# Public: Safe to include in version control
GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com"

# Optional: Explicit OAuth redirect URI
# OAUTH_REDIRECT_URI = "https://yourdomain.com/smartgrind/api/auth"
```

### Secret Management

**Never commit secrets to version control!** Use `wrangler secret`:

```bash
# Set JWT signing secret (generate: openssl rand -base64 32)
wrangler secret put JWT_SECRET

# Set Google OAuth credentials
wrangler secret put GOOGLE_CLIENT_SECRET

# Verify secrets are set
wrangler secret list
```

### Required Credentials

| Variable | Source | Purpose |
|----------|--------|---------|
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/) | OAuth client identifier |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console | OAuth client secret |
| `JWT_SECRET` | Self-generated | Token signing & verification |
| `KV` namespace ID | Cloudflare Dashboard | User data storage |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Configure consent screen (External for testing)
6. Application type: **Web application**
7. Add authorized redirect URIs:
   - `https://yourdomain.com/smartgrind/api/auth`
   - `http://localhost:8788/smartgrind/api/auth` (for local dev)
8. Copy Client ID and Client Secret

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server (localhost:5173)
npm run preview          # Preview production build locally

# Building
npm run build            # Type-check and build for production
npm run build:bundle     # Create offline bundle
npm run clean            # Remove dist directory

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Check Prettier formatting
npm run format:fix       # Fix formatting
npm run type-check       # TypeScript check without emit

# Testing
npm test                 # Run unit tests (Jest)
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests (Playwright)
npm run test:e2e:ui      # Run E2E tests with UI
```

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes** in `src/` directory
3. **Run type checks**: `npm run type-check`
4. **Run tests**: `npm test`
5. **Check linting**: `npm run lint`
6. **Build for production**: `npm run build`

### Hot Module Replacement

The dev server supports HMR for rapid development. Changes to TypeScript files are reflected immediately without full page reload.

---

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all unit tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Organization:**

```
tests/
├── api.test.ts              # API coordination tests
├── api/                     # API module tests
│   ├── api-save.test.ts
│   └── api-load.test.ts
├── sw/                      # Service Worker tests
│   ├── auth-manager.test.ts
│   ├── background-sync.test.ts
│   └── operation-queue.test.ts
├── ui-*.test.ts             # UI component tests
├── state.test.ts            # State management tests
└── utils-*.test.ts          # Utility function tests
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Interactive UI mode (for debugging)
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/auth-sync.spec.ts
```

**E2E Test Coverage:**

- Authentication flows (login/logout/sync)
- Core user workflows (solve problem, add notes)
- Offline functionality
- Data persistence across sessions

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Vanilla TypeScript | 5.9+ |
| **Styling** | Tailwind CSS | 3.4+ |
| **Build Tool** | Vite | 7.3+ |
| **Backend** | Cloudflare Workers | — |
| **Database** | Cloudflare KV | — |
| **Auth** | Google OAuth 2.0 + JWT | — |
| **Testing** | Jest + Playwright | 30+ / 1.57+ |

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   UI Layer  │  │  Renderers  │  │    State Management     │ │
│  │  (src/ui/)  │  │(src/renderers)│  │      (src/state.ts)     │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘ │
└─────────┼────────────────┼──────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CORE LAYER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  App Logic  │  │  API Client │  │      Data Layer         │ │
│  │ (src/app.ts)│  │ (src/api/)  │  │    (src/data.ts)        │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘ │
└─────────┼────────────────┼──────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ localStorage│  │  IndexedDB  │  │     Cache API             │ │
│  │ (sync data) │  │(operations) │  │   (static assets)         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVICE WORKER (src/sw/)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ Auth Manager│  │ Operation   │  │   Background Sync       │ │
│  │(token mgmt) │  │   Queue     │  │   (offline → online)    │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘ │
└─────────┼────────────────┼──────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Cloudflare)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Cloudflare Workers (functions/api/)          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │ /api/auth   │  │ /api/user   │  │   Rate Limiting │   │  │
│  │  │ (OAuth+JWT) │  │ (CRUD ops)  │  │   (30 req/min)  │   │  │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────────┘   │  │
│  │         │                │                                 │  │
│  │         └────────────────┼─────────────────────────────────┘  │
│  └──────────────────────────┼─────────────────────────────────────┘
│                             │
│                             ▼
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Cloudflare KV (User Data Storage)            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Patterns

1. **Local-First Architecture**: Data persists locally via localStorage/IndexedDB; cloud sync is optional
2. **Service Worker as Proxy**: All API requests route through SW for offline queuing
3. **State Management**: Unidirectional data flow with custom events for UI updates
4. **Module Organization**: Feature-based directory structure

### Data Flow

```
User Action → UI Handler → State Update → Persistence (localStorage)
                                    ↓
                              Queue for Sync (if signed in)
                                    ↓
                         Service Worker → Background Sync → Cloudflare KV
```

---

## 🚀 Deployment

### Deploy to Cloudflare Pages

```bash
# 1. Build for production
npm run build

# 2. Deploy using Wrangler
wrangler pages deploy dist

# Or with custom message
wrangler pages deploy dist --commit-dirty=true --branch=main
```

### Automated Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist
```

### Environment-Specific Configuration

| Environment | Config File | Purpose |
|-------------|-------------|---------|
| Development | `wrangler.toml` (local) | Local dev with miniflare |
| Staging | `wrangler.toml` (env vars) | Pre-production testing |
| Production | Cloudflare Dashboard | Live deployment |

---

## 📡 API Reference

### Authentication Endpoints

#### `GET /api/auth?action=login`

Initiates Google OAuth flow. Opens OAuth popup and returns user data on success.

**Response**: HTML with `postMessage` to opener containing:
```json
{
  "type": "auth-success",
  "userId": "google-user-id",
  "displayName": "User Name"
}
```

#### `GET /api/auth?action=token`

Retrieves JWT token for Service Worker (requires HttpOnly cookie from OAuth).

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "google-user-id",
  "displayName": "User Name",
  "expiresIn": 3600
}
```

### User Data Endpoints

#### `GET /api/user`

Retrieves user's problem progress and settings.

**Headers**: `Authorization: Bearer <jwt_token>` or HttpOnly cookie

**Response**:
```json
{
  "problems": {
    "two-sum": {
      "solved": true,
      "notes": "Use hashmap for O(n)",
      "reviewDate": "2024-01-15T00:00:00.000Z",
      "reviewInterval": 2
    }
  },
  "deletedIds": ["custom-problem-1"],
  "flashCardProgress": {}
}
```

#### `POST /api/user`

Saves user data. Supports compression for large payloads.

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json  # or application/octet-stream (compressed)
X-Compressed: true  # If using compression
```

**Request Body**:
```json
{
  "problems": { ... },
  "deletedIds": [ ... ],
  "operations": [ ... ]  // Optional: pending operations
}
```

**Response**:
```json
{
  "success": true,
  "message": "Data updated",
  "serverTimestamp": 1704902400000
}
```

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Authentication | 10 | 1 minute |
| User Data Read | 60 | 1 minute |
| User Data Write | 30 | 1 minute |
| Static Assets | 300 | 1 minute |

---

## 🔒 Security

### Authentication Security

- **HttpOnly Cookies**: Session tokens inaccessible to JavaScript
- **JWT Short-Lived**: 1-hour expiration with automatic refresh
- **CSRF Protection**: State parameter in OAuth flow
- **Secure Storage**: Tokens stored in IndexedDB with controlled access

### Data Security

- **Encryption at Rest**: Cloudflare KV encrypts all data
- **Input Sanitization**: DOMPurify for all user-generated content
- **Rate Limiting**: Prevents brute force and abuse
- **CORS Policy**: Strict origin validation

### Privacy

- **Local-First**: Core functionality works without cloud sync
- **Minimal Data Collection**: Only problem progress, no personal data
- **Export/Delete**: Full data export and deletion capabilities

### Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
```

---

## ⚡ Performance

### Optimization Strategies

| Strategy | Implementation | Impact |
|----------|---------------|--------|
| **Code Splitting** | Vite dynamic imports | Smaller initial bundle |
| **Tree Shaking** | ES modules + Rollup | Dead code elimination |
| **Service Worker Caching** | Cache-first for static assets | Instant repeat visits |
| **Compression** | Brotli/Gzip via Cloudflare | ~70% size reduction |
| **Lazy Loading** | On-demand pattern content | Faster initial load |

### Performance Metrics

- **First Contentful Paint**: < 1.5s (cached), < 3s (uncached)
- **Time to Interactive**: < 2s (cached), < 4s (uncached)
- **Bundle Size**: ~150KB (gzipped) initial load
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)

### Caching Strategy

```
Navigation Requests    → Cache-first (always serve shell)
API Requests          → Network-first (fresh data priority)
Problem Content       → Cache-first + background revalidate
Static Assets         → Stale-while-revalidate (1 year max)
```

---

## 🔧 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 🔐 **Login fails with "redirect_uri_mismatch"** | OAuth redirect URI not configured | Add exact URL to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| 💾 **Data not syncing across devices** | KV namespace misconfigured | Verify `KV` binding in `wrangler.toml` matches dashboard |
| 🔄 **Sync stuck "pending"** | Service Worker not registered | Clear browser cache, reload, check DevTools → Application → Service Workers |
| 🌐 **Build fails with "Cannot find module"** | Dependencies not installed | Run `npm install` and `npm run type-check` |
| 📱 **Mobile: buttons unresponsive** | Touch events not binding | Check `ui-bindings.ts` for event delegation |

### Debug Mode

Enable verbose logging in browser console:

```javascript
// Enable debug logging
localStorage.debug = 'true'
location.reload()

// Check Service Worker status
navigator.serviceWorker.ready.then(reg => console.log('SW ready:', reg))

// View pending operations
navigator.serviceWorker.controller.postMessage({ type: 'GET_SYNC_STATUS' })
```

### Service Worker Debugging

1. Open Chrome DevTools → Application → Service Workers
2. Check "Update on reload" for development
3. View Cache Storage for cached assets
4. Check IndexedDB for queued operations

### Reset Local Data

```javascript
// Clear all local data (irreversible)
localStorage.clear()
indexedDB.deleteDatabase('smartgrind-auth')
indexedDB.deleteDatabase('smartgrind-sync')
```

---

## 🤝 Contributing

We welcome contributions! See [Contributing Guide](../CONTRIBUTING.md) for details.

### Quick Contribution Flow

```bash
# 1. Fork and clone your fork
git clone https://github.com/YOUR-USERNAME/smart-grind.git
cd smart-grind/website

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes with tests
# ... edit code ...
npm test

# 4. Commit with conventional format
git commit -m "feat: add amazing feature"
# Types: feat, fix, docs, style, refactor, test, chore

# 5. Push and create PR
git push origin feature/amazing-feature
```

### Code Style

| Language | Standard |
|----------|----------|
| TypeScript | ES2022, strict mode, camelCase |
| CSS | Tailwind utilities, no custom CSS when possible |
| Commits | [Conventional Commits](https://conventionalcommits.org/) |
| Tests | Jest with descriptive test names |

### Adding New Patterns

1. Add problems to `src/data/problems-data.ts`
2. Create pattern guide in `public/patterns/pattern-name.md`
3. Add algorithm explanation in `public/algorithms/` (optional)
4. Update tests in `tests/data.test.ts`
5. Submit PR with pattern description

---

## 📄 License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).

```
Copyright (c) 2024 AlgoVyn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🆘 Support

| Channel | Best For | Response Time |
|---------|----------|---------------|
| 🐛 [GitHub Issues](https://github.com/AlgoVyn/smart-grind/issues) | Bug reports, feature requests | 24-48 hours |
| 💬 [GitHub Discussions](https://github.com/AlgoVyn/smart-grind/discussions) | Questions, ideas, show & tell | Community-driven |
| 📧 [support@algovyn.com](mailto:support@algovyn.com) | Private inquiries | 48-72 hours |
| 🌐 [algovyn.com/smartgrind](https://algovyn.com/smartgrind) | Documentation, live demo | Always available |

---

<div align="center">

**[⬆ Back to Top](#smart-grind--pattern-practice-web-app-)**

---

Made with ❤️ by the Smart Grind Team

[![Star on GitHub](https://img.shields.io/github/stars/AlgoVyn/smart-grind?style=social)](https://github.com/AlgoVyn/smart-grind)

</div>
