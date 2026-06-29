# Playwright TypeScript Test Challenge

End-to-end test suite for the `automaticbytes/demo-app` web application, built with **Playwright** and **TypeScript** following the **Page Object Model** pattern.

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 18 LTS |
| npm | 9 |
| Docker + Docker Compose v2 | any recent |
| Git | any recent |

---

## Quick Start — Local

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd playwright_test_challenge
npm ci
npx playwright install --with-deps
```

### 2. Start the application under test

```bash
docker run -d -p 3100:3100 --name demo-app automaticbytes/demo-app
```

Verify it's up: open `http://localhost:3100` in your browser.

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env to adjust BASE_URL, BROWSER, etc.
```

### 4. Run tests

```bash
# Run all tests (browser from .env, default: chromium)
npm test

# Run only smoke tests
npm run test:smoke

# Force a specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run in mobile emulation mode (device from .env, default: iPhone 13)
npm run test:mobile

# Override env inline
BROWSER=firefox HEADLESS=false npm test

# Open HTML report after a run
npm run report
```

---

## Quick Start — Docker (full stack)

Spins up both the demo app and the test runner. Tests start automatically once the app passes its health check.

```bash
cp .env.example .env   # optional: customize BROWSER, DEVICE, etc.

docker compose up --build
```

Results land in `./test-results/` on the host.

```bash
# View HTML report locally after the Docker run
npm run report
```

To run only a specific suite in Docker:

```bash
BROWSER=firefox docker compose up --build
IS_MOBILE=true DEVICE="Pixel 7" docker compose up --build
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:3100` | URL of the application under test |
| `BROWSER` | *(empty = all)* | `chromium`, `firefox`, or `webkit` |
| `HEADLESS` | `true` | Run browsers headlessly (`true`/`false`) |
| `IS_MOBILE` | `false` | Enable mobile device emulation |
| `DEVICE` | `iPhone 13` | Playwright device name (when `IS_MOBILE=true`) |
| `PLATFORM` | `linux` | Informational OS label used in project names |

To see all supported device names for `DEVICE`, run this one-liner:
```bash
node -e "const { devices } = require('@playwright/test'); console.log(Object.keys(devices).join('\n'))"
```

> **Note:** Headed mode (`HEADLESS=false`) requires a display server. It works on macOS/Windows desktops but not inside Docker without additional Xvfb configuration.

---

## Project Structure

```
playwright_test_challenge/
├── .env.example              # Environment template (committed)
├── .env                      # Local overrides (gitignored)
├── .gitignore
├── docker-compose.yml        # Full-stack Docker setup
├── Dockerfile                # Test runner image
├── package.json
├── playwright.config.ts      # Dynamic project builder (reads .env)
├── tsconfig.json
├── README.MD
│
├── utils/
│   ├── env.ts                # Typed env loader
│   └── devices.ts            # Playwright project builder
│
├── pages/                    # Page Object Model layer
│   ├── BasePage.ts           # Abstract base class
│   ├── LoginPage.ts
│   ├── CheckoutPage.ts
│   ├── GridPage.ts
│   └── SearchPage.ts
│
├── fixtures/
│   └── test.fixtures.ts      # Extended test object with POM fixtures
│
└── tests/
    ├── smoke/
    │   └── smoke.spec.ts     # App availability smoke suite
    ├── login/                # Login test suite (added in next branch)
    ├── checkout/             # Checkout test suite
    ├── grid/                 # Grid test suite
    └── search/               # Search test suite
```

---

## Page Object Model

Each test file imports `{ test, expect }` from `fixtures/test.fixtures.ts` instead of directly from `@playwright/test`. This gives every test access to pre-built page objects without any manual setup:

```
test file
  └─ imports from fixtures/test.fixtures.ts
        └─ LoginPage / CheckoutPage / GridPage / SearchPage
              └─ extends BasePage
                    └─ wraps Playwright Page
```

**Setup and teardown** is handled by Playwright's fixture lifecycle — the browser opens before each test and closes after, automatically.

---

## Adding New Tests

1. Create a file under the appropriate `tests/<suite>/` directory.
2. Import from the fixtures file:
   ```typescript
   import { test, expect } from '../../fixtures/test.fixtures';
   ```
3. Use the pre-wired page objects:
   ```typescript
   test('example', async ({ loginPage }) => {
     await loginPage.goto();
     await loginPage.login('johndoe19', 'supersecret');
     expect(await loginPage.getWelcomeText()).toContain('johndoe19');
   });
   ```
4. If you need a new page, add a class in `pages/` extending `BasePage`, then register it as a fixture in `fixtures/test.fixtures.ts`.

---

## Cross-Browser & Multi-Platform Matrix

| Scenario | Command |
|----------|---------|
| All desktop browsers | `BROWSER= npm test` (empty = all three) |
| Chromium only | `npm run test:chromium` |
| Firefox only | `npm run test:firefox` |
| WebKit (Safari engine) only | `npm run test:webkit` |
| iPhone 13 emulation | `IS_MOBILE=true npm test` |
| Pixel 7 emulation | `IS_MOBILE=true DEVICE="Pixel 7" npm test` |
| Full matrix in Docker (linux) | `docker compose up --build` |

The `PLATFORM` variable adds a label (e.g., `chromium--desktop--macos`) to the Playwright project name, making it easy to distinguish results in CI reports when running the same suite on multiple OS runners.

---

## CI Notes

- Set `CI=true` in your CI environment — the config automatically enables 2 retries and 4 parallel workers.
- Artefacts (screenshots, videos, traces) for failed tests are written to `test-results/`.
- The HTML report is at `test-results/html-report/index.html`.
