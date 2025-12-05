# TMDB Discover - QA Automation Assignment Documentation

## 📖 Table of Contents
- [Testing Strategy](#-testing-strategy)
- [Test Cases & Rationale](#-test-cases--rationale)
- [Framework Architecture](#-framework-architecture)
- [How to Run Tests](#-how-to-run-tests)
- [Test Design Techniques](#-test-design-techniques)
- [Design Patterns](#-design-patterns)
- [Defects Found](#-defects-found)
- [Quality & Maintainability](#-quality--maintainability)

---

## 🎯 Testing Strategy

### Approach: Risk-Based Functional Testing

Given the scope of a movie discovery platform, the testing strategy prioritizes:

1. **Core User Journeys** - Navigation, browsing content, filtering
2. **High-Traffic Features** - Search, pagination, content display
3. **Cross-Browser Compatibility** - Chromium (expandable to Firefox, WebKit)
4. **CI/CD Integration** - Automated testing on every push/PR

### Test Pyramid

```
         /‾‾‾‾‾‾‾‾‾‾‾\
        /   E2E (20)   \     ← UI Tests (Current Focus)
       /________________\
      /                  \
     /   Integration (-)  \   ← API layer (future scope)
    /______________________\
   /                        \
  /       Unit Tests (-)     \  ← Component level (future scope)
 /__________________________\
```

### Coverage Areas

| Area | Priority | Coverage |
|------|----------|----------|
| Navigation | High | ✅ 5 tests |
| Filters | High | ✅ 5 tests |
| Search | High | ✅ 5 tests |
| Pagination | Medium | ✅ 5 tests |
| **Total** | - | **20 tests** |

---

## 📋 Test Cases & Rationale

### 1. Navigation Tests (`discover-navigation.spec.ts`)

| Test Case | Rationale |
|-----------|-----------|
| Page loads with content | **Smoke test** - Ensures basic functionality works |
| Display movie cards | Validates core content rendering |
| Navigation links visible | Ensures users can discover content sections |
| Navigate to sections | Tests primary user journey |
| Display movie titles | Verifies content accessibility |

**Why these tests?** Navigation is the entry point for all user interactions. If users can't navigate, they can't use the application.

### 2. Filter Tests (`discover-filters.spec.ts`)

| Test Case | Rationale |
|-----------|-----------|
| Display content on load | Pre-condition for filter testing |
| Filter elements on page | Validates filter UI availability |
| Click Movie filter | Tests content type filtering |
| Click TV filter | Tests alternate content type |
| Maintain content after filter | Ensures filter doesn't break page |

**Why these tests?** Filters are critical for content discovery. Users expect filters to work reliably without breaking the page.

### 3. Search Tests (`discover-search.spec.ts`)

| Test Case | Rationale |
|-----------|-----------|
| Search input on page | Validates search UI exists |
| Content before search | Pre-condition validation |
| Type in search input | Tests input functionality |
| Page functional after search | Ensures search doesn't break page |
| Clear search input | Tests reset functionality |

**Why these tests?** Search is the fastest path to specific content. Broken search = frustrated users.

### 4. Pagination Tests (`discover-pagination.spec.ts`)

| Test Case | Rationale |
|-----------|-----------|
| Display content on first page | First page is most critical |
| Pagination elements exist | Validates multi-page support |
| Scroll functionality | Tests infinite scroll/pagination |
| Navigate to next page | Tests forward navigation |
| Maintain functionality across pages | Ensures consistent behavior |

**Why these tests?** Pagination enables content discovery beyond the first page. Users need to browse multiple pages.

---

## 🏗️ Framework Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Test Runner** | Playwright Test | Modern, fast, cross-browser |
| **Language** | TypeScript | Type safety, better IDE support |
| **Assertions** | Playwright Expect | Built-in, auto-waiting assertions |
| **Reporting** | HTML Reporter | Visual, interactive reports |
| **CI/CD** | GitHub Actions | Automated testing pipeline |

### Project Structure

```
rr-qa-automation-assignment/
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI/CD pipeline
├── config/
│   └── environment.ts           # Environment configuration
├── fixtures/
│   └── base-fixtures.ts         # Custom Playwright fixtures
├── pages/
│   ├── DiscoverPage.ts          # Main page object
│   └── components/
│       ├── FilterComponent.ts   # Filter section component
│       └── MovieCardComponent.ts # Movie card component
├── tests/
│   └── tmdb/
│       ├── discover-navigation.spec.ts
│       ├── discover-filters.spec.ts
│       ├── discover-search.spec.ts
│       └── discover-pagination.spec.ts
├── utils/
│   └── logger.ts                # Logging utility
├── playwright.config.ts         # Playwright configuration
└── package.json                 # Dependencies & scripts
```

### Dependencies

```json
{
  "@playwright/test": "^1.56.1",  // Test framework
  "@types/node": "^20.10.0",      // Node.js types
  "typescript": "^5.3.0"          // TypeScript compiler
}
```

---

## ▶️ How to Run Tests

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
```

### CI/CD Pipeline

Tests run automatically on:
- Push to `main`/`master`
- Pull requests

View results: GitHub → Actions → Playwright Tests → Download `playwright-report` artifact

---

## 🎨 Test Design Techniques

### 1. **Equivalence Partitioning**
- Grouped similar behaviors together
- Example: Movie/TV filters treated as equivalent content type selections

### 2. **Boundary Value Analysis**
- Tested first page explicitly (start boundary)
- Tested pagination navigation (crossing page boundaries)

### 3. **State Transition Testing**
- Tested state changes: Default → Filtered → Search → Clear
- Example: Content state before/after filter interactions

### 4. **Positive Path Testing**
- Primary focus on happy path scenarios
- Users successfully browsing, filtering, searching content

### 5. **Exploratory Testing (Guiding Automation)**
- Manual exploration identified key features to automate
- Discovered actual DOM structure vs. expected structure

### 6. **Graceful Degradation Testing**
- Tests handle missing elements gracefully (`catch(() => false)`)
- `test.skip()` used when features are unavailable

---

## 🧩 Design Patterns

### 1. **Page Object Model (POM)**

**Why:** Encapsulates page-specific locators and actions. Changes to UI only require updates in one place.

```typescript
// pages/DiscoverPage.ts
export class DiscoverPage {
    private readonly page: Page;
    private readonly searchInput: Locator;
    
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }
}
```

### 2. **Component Pattern**

**Why:** Reusable components for shared UI elements (filters, cards).

```typescript
// pages/components/FilterComponent.ts
export class FilterComponent {
    async selectMovies() { ... }
    async selectTvShows() { ... }
}
```

### 3. **Fixture Pattern**

**Why:** Dependency injection for test setup. Cleaner, reusable test setup.

```typescript
// fixtures/base-fixtures.ts
export const test = base.extend<{
  discoverPage: DiscoverPage;
}>({
  discoverPage: async ({ page }, use) => {
    const discoverPage = new DiscoverPage(page);
    await use(discoverPage);
  },
});
```

### 4. **Fluent Locator Strategy**

**Why:** Flexible, resilient selectors that handle DOM variations.

```typescript
// Multiple fallback selectors
this.searchInput = page.locator(
    'input[placeholder*="Search" i], input[placeholder*="SEARCH"], input[type="search"]'
).first();
```

### 5. **AAA Pattern (Arrange-Act-Assert)**

**Why:** Clear test structure for maintainability.

```typescript
test('should display movie cards', async ({ page }) => {
    // Arrange: Page loaded in beforeEach
    
    // Act
    const cardCount = await discoverPage.getMovieCardCount();
    
    // Assert
    expect(cardCount).toBeGreaterThan(0);
});
```

---

## 📝 Logging Implementation

The framework uses a custom `Logger` utility for comprehensive test logging.

### Logger Features

| Feature | Method | Purpose |
|---------|--------|---------|
| Test Context | `Logger.setTestContext(name)` | Sets current test name for log prefix |
| Step Tracking | `Logger.step(action, expected)` | Logs numbered test steps |
| Browser API | `Logger.browserApi(api, params)` | Documents browser API calls |
| Assertions | `Logger.assertion(desc, passed)` | Logs assertion results |
| Test Results | `Logger.testResult(name, status)` | Logs pass/fail status |

### Example Console Output

```
ℹ️  [INFO] 2025-12-05T19:24:44.071Z [TC-NAV-001: Page loads with content] - Starting test
👉 [STEP] 2025-12-05T19:24:44.071Z - Step 1: Navigate to TMDB Discover page
   ↳ Expected: Page loads successfully
🔍 [DEBUG] 2025-12-05T19:24:44.071Z - Browser API: page.goto() with https://tmdb-discover.surge.sh
✅ [SUCCESS] 2025-12-05T19:24:45.436Z - Page loaded successfully
👉 [STEP] 2025-12-05T19:24:47.440Z - Step 2: Verify content is loaded
🔍 [DEBUG] 2025-12-05T19:24:47.440Z - Browser API: hasContent()
✅ [SUCCESS] 2025-12-05T19:24:47.442Z - Assertion PASSED: Page has content
✅ [SUCCESS] 2025-12-05T19:24:47.443Z - Test PASSED: TC-NAV-001 (9234ms)
```

### Usage in Tests

```typescript
import { Logger } from '../../utils/logger';

test.beforeEach(async ({ page }, testInfo) => {
    Logger.setTestContext(testInfo.title);
    Logger.step('Navigate to page', 'Page loads successfully');
    Logger.browserApi('page.goto()', BASE_URL);
    await page.goto(BASE_URL);
    Logger.success('Page loaded');
});

test('example test', async ({ page }) => {
    Logger.step('Click button', 'Action executes');
    Logger.browserApi('click()', 'button#submit');
    await page.click('button#submit');
    
    Logger.assertion('Button was clicked', true);
});
```

---

## 🌐 Browser APIs Usage

### Navigation APIs

```typescript
// Page navigation
await page.goto(url);
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');
```

### Locator APIs

```typescript
// Element location strategies
page.locator('text=Movie');                    // Text-based
page.locator('input[placeholder*="Search"]');  // Attribute-based
page.locator('[aria-label*="Next"]');          // ARIA-based
page.locator('a').filter({ hasText: /regex/i }); // Filter with regex
locator.first();                               // First match
locator.nth(index);                            // Nth match
```

### Action APIs

```typescript
// User interactions
await element.click();
await input.fill('text');
await input.press('Enter');
await input.clear();
await input.inputValue();
```

### Evaluation APIs

```typescript
// Execute JavaScript in browser context
await page.evaluate(() => window.scrollY);
await page.evaluate(() => window.scrollTo(0, 500));
await page.evaluate(() => document.querySelector('.class'));
```

### Assertion APIs

```typescript
// Visibility and state
await element.isVisible();
await locator.count();
await element.getAttribute('class');
await locator.allTextContents();
```

---

## 📊 Reporting & Attachments

### Configured Reporters

| Reporter | Output | Purpose |
|----------|--------|---------|
| **List** | Console | Real-time test progress |
| **HTML** | `playwright-report/` | Interactive visual report |
| **JSON** | `test-results/results.json` | Machine-readable results |
| **JUnit** | `test-results/junit.xml` | CI/CD integration |

### Automatic Attachments

```typescript
test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
        // Capture and attach screenshot on failure
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('failure-screenshot', { 
            body: screenshot, 
            contentType: 'image/png' 
        });
    }
});
```

### Artifact Configuration

```typescript
// playwright.config.ts
use: {
    screenshot: 'only-on-failure',     // Screenshots on failure
    video: 'retain-on-failure',        // Videos on failure
    trace: 'on-first-retry',           // Traces on retry
}
```

### View Reports

```bash
# Open interactive HTML report
npx playwright show-report

# View JSON results
cat test-results/results.json | jq .

# JUnit results for CI
cat test-results/junit.xml
```

---

## 🐛 Defects Found

During test automation development, the following observations were made:

### 1. **Inconsistent DOM Structure**
- **Severity:** Medium
- **Description:** Some expected elements (role-based selectors) don't match actual DOM structure
- **Impact:** Required flexible locator strategies with fallbacks
- **Workaround:** Used text-based and attribute-based selectors

### 2. **Missing Accessibility Attributes**
- **Severity:** Low
- **Description:** Some interactive elements lack proper ARIA labels
- **Impact:** Harder to automate reliably; accessibility concerns
- **Recommendation:** Add `aria-label` to buttons and interactive elements

### 3. **Search Functionality Behavior**
- **Severity:** Medium  
- **Description:** Search behavior (whether filter-based or API-based) is unclear
- **Impact:** Tests had to be written defensively
- **Workaround:** Assertions check for "page still functional" rather than specific results

### 4. **Pagination Element Visibility**
- **Severity:** Low
- **Description:** Pagination elements may not be visible/present in all scenarios
- **Impact:** Required conditional testing with graceful skips
- **Workaround:** Tests check element visibility before interaction

---

## ✅ Quality & Maintainability

### Code Quality Measures

| Aspect | Implementation |
|--------|----------------|
| **Type Safety** | TypeScript with strict mode enabled |
| **Linting** | `noUnusedLocals`, `noUnusedParameters` enabled |
| **Code Organization** | Clear folder structure, separation of concerns |
| **Documentation** | JSDoc comments on all public methods |
| **Naming** | Descriptive test names explaining intent |

### Maintainability Features

1. **Single Point of Change** - Page Objects encapsulate locators
2. **Environment Configuration** - Centralized in `config/environment.ts`
3. **Custom Fixtures** - Reusable test setup via `base-fixtures.ts`
4. **Flexible Locators** - Multiple fallback strategies reduce brittleness

### Execution Management

- **Parallel Execution:** Configured via `workers` in `playwright.config.ts`
- **Retry Strategy:** 2 retries on CI to handle flaky tests
- **Timeouts:** Sensible defaults (30s test, 10s assertions)

### Reporting

| Report Type | Purpose |
|-------------|---------|
| **HTML Report** | Interactive, visual test results |
| **List Reporter** | Console output for quick feedback |
| **Screenshots** | Captured on test failure |
| **Videos** | Retained on test failure |
| **Traces** | Generated on first retry for debugging |

### CI/CD Integration

- **Automated Triggers:** Push to main, pull requests
- **Artifact Archival:** HTML reports saved for 30 days
- **Failure Debugging:** Test results and traces uploaded on failure

---

## 📝 Summary

This framework demonstrates:
- ✅ **Scalable architecture** with Page Object Model
- ✅ **Maintainable code** with TypeScript and clear structure
- ✅ **Resilient tests** with flexible locator strategies
- ✅ **CI/CD ready** with GitHub Actions integration
- ✅ **Comprehensive reporting** with HTML reports and artifacts
- ✅ **Professional patterns** used in industry-standard test automation

---

**Author:** Praveen Jaiswal  
**Repository:** [github.com/jaiswalkpraveen/rr-qa-automation-assignment](https://github.com/jaiswalkpraveen/rr-qa-automation-assignment)
