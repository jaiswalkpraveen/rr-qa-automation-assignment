# TMDB Discover - QA Automation Assignment

Playwright test automation framework for the TMDB Discover movie website.

**Target URL:** https://tmdb-discover.surge.sh

📘 **Documentation:** [Testing Strategy](TESTING_STRATEGY.md) | [Test Cases](TEST_CASES.md)

---

## 📋 Test Coverage

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Navigation | 5 | Page load, navigation links, sections |
| Filters | 5 | Movie/TV type filters, filter elements |
| Search | 5 | Search input, search functionality |
| Pagination | 5 | Page navigation, scroll, pagination |
| **Total** | **20** | - |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd rr-qa-automation-assignment

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## ▶️ Running Tests

```bash
# Run all tests
npx playwright test --project=chromium

# Run with browser visible
npx playwright test --project=chromium --headed

# Run specific test file
npx playwright test tests/tmdb/discover-navigation.spec.ts

# Run with verbose output
npx playwright test --project=chromium --reporter=list
```

---

## 📁 Project Structure

```
rr-qa-automation-assignment/
├── config/
│   └── environment.ts       # TMDB environment config
├── fixtures/
│   └── base-fixtures.ts     # Custom Playwright fixtures
├── pages/
│   ├── DiscoverPage.ts      # Main page object
│   └── components/
│       ├── FilterComponent.ts
│       └── MovieCardComponent.ts
├── tests/
│   └── tmdb/
│       ├── discover-navigation.spec.ts
│       ├── discover-filters.spec.ts
│       ├── discover-search.spec.ts
│       └── discover-pagination.spec.ts
├── utils/
│   └── logger.ts            # Logging utility
├── playwright.config.ts     # Playwright configuration
└── package.json
```

---

## 📊 View Reports

```bash
# Open HTML report after test run
npx playwright show-report
```

---

## 🔄 CI/CD (GitHub Actions)

Tests run automatically on push to `main`/`master` and on pull requests.

### Workflow Features
- ✅ Node.js 20 with npm caching
- ✅ Chromium browser installation
- ✅ HTML report uploaded as artifact
- ✅ Test results saved on failure
- ✅ 2 retries on CI for flaky tests

### View Results
1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. Download **playwright-report** artifact for HTML report

### Run CI Tests Locally
```bash
npm run test:ci
```

---

## 🛠️ Technologies

- **Playwright** - Browser automation
- **TypeScript** - Type-safe code
- **Node.js** - Runtime

---

## 👤 Author

**Praveen Jaiswal**
