# 📋 Test Cases Document

Step-by-step test descriptions for TMDB Discover automation suite.

---

## Test Suite Overview

| Suite | Tests | Priority | Status |
|-------|-------|----------|--------|
| Navigation | 5 | 🔴 Critical | ✅ Automated |
| Filters | 5 | 🔴 Critical | ✅ Automated |
| Search | 5 | 🟡 High | ✅ Automated |
| Pagination | 5 | 🟢 Medium | ✅ Automated |

---

## 🧭 Suite 1: Navigation Tests

### TC-NAV-001: Page Load with Content
**Priority:** Critical | **Type:** Smoke Test

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `https://tmdb-discover.surge.sh` | Page loads successfully |
| 2 | Wait for network idle | All resources loaded |
| 3 | Check for visible images | At least 1 image visible |
| 4 | Verify `hasContent()` returns true | Content is present |

```typescript
// Browser API Used
await page.goto(BASE_URL);
await page.waitForLoadState('networkidle');
const hasContent = await discoverPage.hasContent();
expect(hasContent).toBe(true);
```

---

### TC-NAV-002: Display Movie Cards
**Priority:** Critical | **Type:** Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page with content | Page fully loaded |
| 2 | Count all `img` elements | Count > 0 |
| 3 | Assert card count | Cards are displayed |

```typescript
// Browser API Used
const cardCount = await page.locator('img').count();
expect(cardCount).toBeGreaterThan(0);
```

---

### TC-NAV-003: Navigation Links Visible
**Priority:** High | **Type:** UI Verification

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page | Page loaded |
| 2 | Search for nav text: Popular, Trend, Top | Elements found |
| 3 | Check visibility of nav elements | At least one visible |

```typescript
// Browser API Used
const element = page.locator(`text=${navText}`).first();
const isVisible = await element.isVisible();
```

---

### TC-NAV-004: Navigate to Sections
**Priority:** High | **Type:** Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Store initial URL | URL captured |
| 2 | Find navigation link (Trend/Top/New) | Link found |
| 3 | Click navigation link | Click executed |
| 4 | Wait for content load | Content refreshes |
| 5 | Verify content still present | Content visible |

```typescript
// Browser API Used
const navLinks = page.locator('a').filter({ hasText: /Trend|Top|New/i });
await navLinks.first().click();
await page.waitForLoadState('networkidle');
```

---

### TC-NAV-005: Display Movie Titles
**Priority:** Medium | **Type:** Content Verification

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page | Page loaded |
| 2 | Query text elements (p, h3, h4) | Elements found |
| 3 | Extract text contents | Titles extracted |
| 4 | Verify titles array length > 0 | Titles present |

```typescript
// Browser API Used
const textElements = await page.locator('p, h3, h4').allTextContents();
const titles = textElements.filter(t => t.trim().length > 0);
expect(titles.length).toBeGreaterThan(0);
```

---

## 🎚️ Suite 2: Filter Tests

### TC-FIL-001: Display Content on Load
**Priority:** Critical | **Type:** Pre-condition

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to discover page | Page loads |
| 2 | Wait for network idle | Resources loaded |
| 3 | Verify content present | Images visible |

---

### TC-FIL-002: Filter Elements on Page
**Priority:** High | **Type:** UI Verification

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page | Page loaded |
| 2 | Search for filter text: Movie, TV, Type, Genre, Year, Rating | Elements queried |
| 3 | Count visible filter elements | At least 1 filter visible |

```typescript
// Browser API Used
for (const text of ['Movie', 'TV', 'Type', 'Genre', 'Year', 'Rating']) {
    const element = page.locator(`text=${text}`).first();
    const isVisible = await element.isVisible().catch(() => false);
    if (isVisible) foundFilters++;
}
expect(foundFilters).toBeGreaterThan(0);
```

---

### TC-FIL-003: Click Movie Filter
**Priority:** High | **Type:** Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate "Movie" button | Element found |
| 2 | Check visibility | Button visible |
| 3 | Click Movie button | Click executed |
| 4 | Wait for content update | Network settles |
| 5 | Verify content still present | Movies displayed |

```typescript
// Browser API Used
const movieButton = page.locator('text=Movie').first();
await movieButton.click();
await page.waitForLoadState('networkidle');
```

---

### TC-FIL-004: Click TV Filter
**Priority:** High | **Type:** Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate "TV" button | Element found |
| 2 | Check visibility | Button visible |
| 3 | Click TV button | Click executed |
| 4 | Wait for content update | Network settles |
| 5 | Verify content still present | TV shows displayed |

---

### TC-FIL-005: Maintain Content After Filter
**Priority:** Critical | **Type:** Regression

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Count initial content | initialCount > 0 |
| 2 | Interact with filter | Filter applied |
| 3 | Wait for content refresh | Content updates |
| 4 | Count content after filter | afterCount > 0 |
| 5 | Verify page functional | Content present |

---

## 🔍 Suite 3: Search Tests

### TC-SRC-001: Search Input Exists
**Priority:** Critical | **Type:** UI Verification

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page | Page loaded |
| 2 | Query all input elements | Inputs found |
| 3 | Count inputs | count > 0 |

```typescript
// Browser API Used
const searchInputs = page.locator('input');
const count = await searchInputs.count();
expect(count).toBeGreaterThan(0);
```

---

### TC-SRC-002: Content Before Search
**Priority:** Medium | **Type:** Pre-condition

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page | Page loaded |
| 2 | Verify content present | Content visible before search |

---

### TC-SRC-003: Type in Search Input
**Priority:** High | **Type:** Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate search input | Input found |
| 2 | Fill "Batman" | Text entered |
| 3 | Get input value | Value matches "Batman" |

```typescript
// Browser API Used
await searchInput.fill('Batman');
const value = await searchInput.inputValue();
expect(value).toBe('Batman');
```

---

### TC-SRC-004: Page Functional After Search
**Priority:** High | **Type:** Regression

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate search input | Input found |
| 2 | Fill search term "Avengers" | Text entered |
| 3 | Press Enter | Search triggered |
| 4 | Wait for response | Network settles |
| 5 | Verify page functional | No errors, page responsive |

```typescript
// Browser API Used
await searchInput.fill('Avengers');
await searchInput.press('Enter');
await page.waitForTimeout(1500);
```

---

### TC-SRC-005: Clear Search Input
**Priority:** Medium | **Type:** Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill search with "Matrix" | Text entered |
| 2 | Clear input | Input cleared |
| 3 | Verify value is empty | value === '' |

```typescript
// Browser API Used
await searchInput.fill('Matrix');
await searchInput.clear();
const value = await searchInput.inputValue();
expect(value).toBe('');
```

---

## 📄 Suite 4: Pagination Tests

### TC-PAG-001: First Page Content
**Priority:** Critical | **Type:** Smoke Test

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page | Page loaded |
| 2 | Verify content | Content visible |
| 3 | Count cards | cardCount > 0 |

---

### TC-PAG-002: Pagination Elements Exist
**Priority:** Medium | **Type:** UI Verification

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to bottom | Bottom reached |
| 2 | Search for Next/Prev buttons | Elements queried |
| 3 | Search for page numbers | Page links queried |
| 4 | Count pagination elements | Count >= 0 (may not exist) |

```typescript
// Browser API Used
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
const nextPrevCount = await page.locator('[aria-label*="Next"]').count();
```

---

### TC-PAG-003: Scroll Functionality
**Priority:** Medium | **Type:** Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Get initial scroll position | initialScroll captured |
| 2 | Scroll down 500px | Scroll executed |
| 3 | Get new scroll position | afterScroll captured |
| 4 | Verify scroll occurred | Position changed |

```typescript
// Browser API Used
const initialScroll = await page.evaluate(() => window.scrollY);
await page.evaluate(() => window.scrollTo(0, 500));
const afterScroll = await page.evaluate(() => window.scrollY);
```

---

### TC-PAG-004: Navigate to Next Page
**Priority:** High | **Type:** Functional

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to pagination | Pagination visible |
| 2 | Locate Next button | Button found |
| 3 | Click Next button | Click executed |
| 4 | Wait for content load | New content loads |
| 5 | Verify content present | Content visible |

---

### TC-PAG-005: Maintain Functionality Across Pages
**Priority:** High | **Type:** Regression

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify initial content | Content present |
| 2 | Scroll to pagination | Pagination visible |
| 3 | Click page number (2-9) | Page changes |
| 4 | Wait for load | Content loads |
| 5 | Verify content on new page | Content present |

---

## 📊 Browser APIs Used Summary

| API Category | Methods Used | Purpose |
|--------------|--------------|---------|
| **Navigation** | `page.goto()`, `page.waitForLoadState()` | Page loading |
| **Locators** | `page.locator()`, `locator.filter()`, `locator.first()` | Element selection |
| **Actions** | `click()`, `fill()`, `press()`, `clear()` | User interactions |
| **Assertions** | `isVisible()`, `count()`, `inputValue()`, `allTextContents()` | State verification |
| **Evaluation** | `page.evaluate()` | JavaScript execution in browser |
| **Waits** | `waitForLoadState()`, `waitForTimeout()` | Synchronization |

---

## ✅ Assertion Patterns

```typescript
// Visibility assertions
expect(await element.isVisible()).toBe(true);

// Count assertions  
expect(await locator.count()).toBeGreaterThan(0);

// Value assertions
expect(await input.inputValue()).toBe('expected');

// Boolean assertions
expect(hasContent).toBe(true);

// Array assertions
expect(titles.length).toBeGreaterThan(0);
```

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Author:** Praveen Jaiswal
