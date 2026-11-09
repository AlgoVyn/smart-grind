# Contributing to SmartGrind

Thanks for helping improve SmartGrind. This repo contains the interview-prep web app (`website/`) and the Chrome extension (`chrome-extension/`).

## Development setup

```bash
git clone https://github.com/YOUR-USERNAME/smart-grind.git
cd smart-grind/website
npm install
cp wrangler.toml.example wrangler.toml
npm test
```

Load the unpacked extension from `chrome-extension/` via `chrome://extensions/`.

## Workflow

1. Create a feature branch from `main` (`git checkout -b feature/short-description`).
2. Make a focused change with tests for any behavioural fix.
3. Run the website checks from `website/`:

   ```bash
   npm run lint
   npm run type-check
   npm run format
   npm test
   npm run build
   npm run size
   ```

4. Use conventional commit messages (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`).
5. Open a pull request against `main`. CI runs lint, type-check, build, Jest, and `npm audit --omit=dev`.

## Code style

| Area | Standard |
|------|----------|
| TypeScript | ES2022, `strict` mode, camelCase |
| Tests | Jest for unit/API coverage; Playwright for E2E |
| Formatting | Prettier (`npm run format:fix`) |
| Lint | ESLint (`npm run lint`) |

Do not commit secrets, a real `wrangler.toml`, or captured Playwright auth cookies. The tracked `website/playwright/.auth/user.json` is mock data only.

## License

By contributing you agree that your work is licensed under the MIT License in `LICENSE`.
