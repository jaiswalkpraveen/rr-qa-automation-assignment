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
git clone https://github.com/jaiswalkpraveen/rr-qa-automation-assignment.git
cd rr-qa-automation-assignment

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## ▶️ How to Run Tests

### Running Tests

```bash
# Run all tests
npm test

# Run with visible browser
npm run test:headed

# Run specific test file
npx playwright test tests/tmdb/discover-navigation.spec.ts

# Run in CI mode (with retries)
npm run test:ci

# Run with Playwright UI
npm run test:ui
```

### View Reports

```bash
# Open HTML report
npx playwright show-report

# View JSON results
cat test-results/results.json | jq .

# JUnit results for CI
cat test-results/junit.xml
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

##  CI/CD (GitHub Actions)

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
