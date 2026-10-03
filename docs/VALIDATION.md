# Validation · 2 October 2026

- PASS: npm test (3 tests: Taipei midnight, budget totals, broken/blocked storage)
- PASS: npm run build
- PASS: node --check for app.js, sw.js and serve.mjs
- PASS: built app shell and all assets respond HTTP 200 using preview server
- PASS: git diff --check
- NOT RUN: browser/mobile visual QA, interactive persistence and offline reload. Playwright package is installed but Chromium is absent; browser download returned an invalid ZIP in this environment.
- NOT RUN: GitHub Actions deployment or live GitHub Pages check. Source is provided on feat/v5.4-webapp for review before merge.

Before travel, test iOS Home Screen and airplane-mode reload after first online load. SVG icon support varies by platform.
