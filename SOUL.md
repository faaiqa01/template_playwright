# SOUL - Playwright TypeScript Framework

> Single Source of Truth untuk Project Playwright dengan TypeScript

---

## 🏗️ Architecture

### Prinsip Utama
- **Page Object Model (POM)**: Setiap halaman aplikasi direpresentasikan sebagai class terpisah
- **Separation of Concerns**: Pemisahan jelas antara locators, actions, dan assertions
- **Test Data Management**: Data uji terpisah dari kode test
- **Reusable Components**: Komponen yang sering digunakan harus dibuat reusable

### Struktur Direktori
```
project-root/
├── src/
│   ├── pages/           # Page Object classes
│   ├── fixtures/        # Test data dan fixtures
│   ├── utils/           # Helper functions dan utilities
│   ├── tests/           # Test files
│   │   ├── e2e/         # End-to-end tests
│   │   ├── integration/ # Integration tests
│   │   └── unit/        # Unit tests (jika ada)
│   └── config/          # Konfigurasi environment
├── tests/               # Playwright test files (spec files)
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── soul.md              # File ini
```

### Layer Architecture
```
┌─────────────────────────────────────┐
│         Test Layer (Specs)          │  ← Test cases
├─────────────────────────────────────┤
│       Page Object Layer             │  ← Page classes
├─────────────────────────────────────┤
│      Component/Utility Layer        │  ← Reusable components
├─────────────────────────────────────┤
│         Playwright API              │  ← Browser automation
└─────────────────────────────────────┘
```

---


## 🧹 Template Cleanup (Wajib)

Sebelum mulai development:
- Hapus semua file contoh bawaan template (mis. `tests/example.spec.ts`).
- Ganti data/fixture contoh dengan data project nyata, atau hapus jika tidak dipakai.
- Jangan tinggalkan test/fixture bernama "example", "sample", atau "template".

---

## 📝 Coding Standards

### Penamaan (Naming Conventions)

#### Files
- Test files: `*.spec.ts` (e.g., `login.spec.ts`, `checkout.spec.ts`)
- Page files: `*.page.ts` (e.g., `LoginPage.ts`, `DashboardPage.ts`)
- Utility files: `*.util.ts` (e.g., `date.util.ts`, `string.util.ts`)
- Fixture files: `*.fixture.ts` (e.g., `user.fixture.ts`, `product.fixture.ts`)

#### Classes
- Page classes: PascalCase dengan suffix `Page` (e.g., `LoginPage`, `HomePage`)
- Utility classes: PascalCase dengan suffix `Util` (e.g., `DateUtil`, `StringUtil`)
- Test classes: PascalCase (e.g., `LoginTests`, `CheckoutTests`)

#### Functions/Methods
- Actions: PascalCase (e.g., `clickLoginButton()`, `fillLoginForm()`)
- Assertions: PascalCase dengan prefix `assert` atau `expect` (e.g., `assertLoginSuccess()`, `expectErrorMessage()`)
- Utilities: camelCase (e.g., `formatDate()`, `generateRandomString()`)

#### Variables
- Locators: camelCase dengan prefix `loc` (e.g., `locUsername`, `locSubmitButton`)
- Test data: camelCase (e.g., `validUser`, `invalidCredentials`)
- Constants: UPPER_SNAKE_CASE (e.g., `BASE_URL`, `TIMEOUT_MS`)

### TypeScript Best Practices
- Gunakan **strict mode** di tsconfig.json
- Selalu tentukan tipe data secara eksplisit untuk parameter dan return types
- Gunakan **interface** untuk shape data, **type** untuk union/intersection types
- Hindari penggunaan `any` - gunakan `unknown` atau tipe yang lebih spesifik
- Gunakan **readonly** untuk properti yang tidak boleh diubah

### Formatting
- Gunakan **4 spaces** untuk indentation
- Batasi panjang baris maksimal **100 karakter**
- Gunakan **single quotes** untuk strings
- Gunakan **semicolons** di akhir setiap statement
- Gunakan **trailing commas** untuk multi-line arrays/objects

### Comments
- Javadoc-style comments untuk public methods dan classes
- Komentar inline hanya untuk logika yang kompleks
- Hindari komentar yang menjelaskan kode yang sudah jelas

```typescript
/**
 * Page object untuk halaman login
 * Mengelola semua interaksi dengan form login
 */
export class LoginPage {
  /**
   * Mengisi form login dengan kredensial yang diberikan
   * @param username - Username untuk login
   * @param password - Password untuk login
   */
  async fillLoginForm(username: string, password: string): Promise<void> {
    // ...
  }
}
```

---

## ⚠️ Strict Rules

### Wajib Diterapkan
1. **Semua test HARUS menggunakan Page Object Model** - Tidak boleh ada selector langsung di test files
2. **Setiap locator HARUS memiliki data-testid** - Gunakan `data-testid` attribute sebagai selector utama
3. **Timeout HARUS didefinisikan secara eksplisit** - Jangan gunakan default timeout Playwright
4. **Test HARUS independent** - Setiap test harus bisa berjalan sendiri tanpa ketergantungan test lain
5. **Assertion HARUS spesifik** - Gunakan assertion yang tepat untuk setiap verifikasi
6. **Error handling HARUS ada** - Tangani error dengan pesan yang jelas
7. **Log HARUS informatif** - Setiap step penting harus memiliki log yang jelas
8. **Test data HARUS terpisah** - Jangan hardcode data di dalam test
9. **Environment config HARUS terpisah** - Gunakan environment variables untuk config
10. **Code review HARUS dilakukan** - Semua perubahan harus melalui code review

### Selector Rules
- **PRIORITY 1**: `data-testid` attribute (e.g., `page.getByTestId('login-button')`)
- **PRIORITY 2**: Accessibility roles (e.g., `page.getByRole('button', { name: 'Login' })`)
- **PRIORITY 3**: Text content (e.g., `page.getByText('Submit')`)
- **FORBIDDEN**: CSS/XPath selectors yang fragile (e.g., `div > div:nth-child(3) > button`)

### Test Structure Rules
Setiap test HARUS mengikuti struktur AAA (Arrange-Act-Assert):
```typescript
test('user can login with valid credentials', async ({ page }) => {
  // Arrange - Setup data dan initial state
  const loginPage = new LoginPage(page);
  const validUser = getValidUserFixture();

  // Act - Eksekusi action yang diuji
  await loginPage.navigate();
  await loginPage.fillLoginForm(validUser.username, validUser.password);
  await loginPage.clickLoginButton();

  // Assert - Verifikasi hasil
  await loginPage.assertLoginSuccess();
});
```

### Wait Rules
- **PREFERRED**: Gunakan `waitForSelector()` dengan timeout eksplisit
- **PREFERRED**: Gunakan `waitForLoadState()` untuk network idle
- **FORBIDDEN**: `sleep()` atau `wait()` hardcoded
- **FORBIDDEN**: Timeout yang terlalu panjang (> 30 detik untuk normal case)

---

## 🚫 Anti-Patterns

### Anti-Patterns yang DILARANG

#### 1. Selector Fragile
```typescript
// ❌ DILARANG - Fragile selector
await page.locator('div.container > div:nth-child(2) > button').click();

// ✅ BENAR - Stable selector
await page.getByTestId('submit-button').click();
```

#### 2. Hardcoded Data di Test
```typescript
// ❌ DILARANG - Hardcoded data
test('user can login', async ({ page }) => {
  await page.fill('#username', 'testuser@example.com');
  await page.fill('#password', 'Password123!');
});

// ✅ BENAR - Data dari fixture
test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = getValidUserFixture();
  await loginPage.fillLoginForm(user.username, user.password);
});
```

#### 3. Test yang Tidak Independent
```typescript
// ❌ DILARANG - Test bergantung pada test sebelumnya
test('create user', async ({ page }) => {
  // Creates user
});

test('delete user', async ({ page }) => {
  // Assumes user exists from previous test
});

// ✅ BENAR - Setiap test independent
test('create and delete user', async ({ page }) => {
  // Complete flow in one test
});
```

#### 4. Assertion yang Tidak Spesifik
```typescript
// ❌ DILARANG - Assertion terlalu umum
await expect(page.locator('.message')).toBeVisible();

// ✅ BENAR - Assertion spesifik
await expect(page.getByTestId('success-message'))
  .toHaveText('Login successful!');
```

#### 5. Magic Numbers
```typescript
// ❌ DILARANG - Magic numbers
await page.waitForTimeout(5000);

// ✅ BENAR - Named constants
const TIMEOUT_MS = 5000;
await page.waitForTimeout(TIMEOUT_MS);
```

#### 6. Duplication Code
```typescript
// ❌ DILARANG - Duplication
test('test 1', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
});

test('test 2', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
});

// ✅ BENAR - Extract ke reusable method
async function setupLoginPage(page: Page, username: string, password: string) {
  await page.goto('https://example.com/login');
  await page.fill('#username', username);
  await page.fill('#password', password);
}
```

#### 7. Try-Catch yang Menelan Error
```typescript
// ❌ DILARANG - Error ditelan
try {
  await page.click('.button');
} catch (e) {
  // Do nothing
}

// ✅ BENAR - Error ditangani dengan benar
try {
  await page.click('.button');
} catch (e) {
  throw new Error(`Failed to click button: ${e.message}`);
}
```

#### 8. Test yang Terlalu Panjang
```typescript
// ❌ DILARANG - Test terlalu panjang (> 100 baris)
test('complete user journey', async ({ page }) => {
  // 200+ lines of code
});

// ✅ BENAR - Break down menjadi smaller tests
test('user can register', async ({ page }) => {
  // Focused on registration
});

test('user can login', async ({ page }) => {
  // Focused on login
});
```

#### 9. Page Object dengan Logic Bisnis
```typescript
// ❌ DILARANG - Page object dengan business logic
class LoginPage {
  async performCompleteLoginFlow(): Promise<void> {
    // Multiple steps, business logic
  }
}

// ✅ BENAR - Page object hanya untuk page interaction
class LoginPage {
  async fillLoginForm(username: string, password: string): Promise<void> {
    // Only page interaction
  }
}
```

#### 10. Menggunakan any Type
```typescript
// ❌ DILARANG - Menggunakan any
const userData: any = { username: 'test', password: '123' };

// ✅ BENAR - Gunakan type/interface
interface UserData {
  username: string;
  password: string;
}
const userData: UserData = { username: 'test', password: '123' };
```

---

## 🎯 Best Practices Summary

### Do's ✅
- Gunakan Page Object Model
- Gunakan data-testid untuk selectors
- Buat test yang independent dan focused
- Pisahkan test data dari kode test
- Gunakan timeout yang wajar dan eksplisit
- Tulis assertion yang spesifik
- Handle error dengan pesan yang jelas
- Gunakan TypeScript strict mode
- Follow naming conventions
- Tulis dokumentasi untuk public API

### Don'ts ❌
- Jangan hardcode data di test
- Jangan gunakan CSS/XPath selectors yang fragile
- Jangan buat test yang bergantung pada test lain
- Jangan gunakan sleep/wait hardcoded
- Jangan menelan error tanpa penanganan
- Jangan buat test yang terlalu panjang
- Jangan gunakan any type
- Jangan duplikasi kode
- Jangan campur business logic di page object
- Jangan abaikan code review

---

## 📚 References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Testing Best Practices](https://martinfowler.com/bliki/UnitTest.html)

---

**Versi**: 1.0.0  
**Last Updated**: 2026-03-21  
**Maintainer**: Development Team
