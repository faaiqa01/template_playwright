# Playwright Template

> Playwright E2E Testing Framework with TypeScript and Best Practices

## 📋 Overview

Template Playwright dengan arsitektur best practice untuk end-to-end testing. Framework ini menggunakan:

- **Playwright** - Browser automation framework
- **TypeScript** - Type-safe development
- **Page Object Model** - Maintainable test code
- **Test Data Management** - Separated fixtures
- **Reusable Utilities** - Common helper functions

## 🏗️ Architecture

Project ini mengikuti best practices yang dijelaskan di [`SOUL.md`](./SOUL.md):

```
project-root/
├── src/
│   ├── config/          # Environment configuration
│   ├── fixtures/        # Test data and fixtures
│   ├── pages/           # Page Object Model classes
│   ├── utils/           # Utility functions
│   └── tests/           # Test files
├── tests/
│   ├── helpers/         # Helper functions untuk test (WAJIB)
│   │   ├── login.helper.ts      # Login helper (WAJIB digunakan di beforeEach)
│   │   ├── auth.setup.ts        # Authentication setup untuk storage state
│   │   └── index.ts             # Central export untuk semua helpers
│   ├── e2e/            # End-to-end tests
│   ├── integration/    # Integration tests
│   └── unit/           # Unit tests
├── playwright.config.ts # Playwright configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 atau lebih tinggi)
- npm / yarn / pnpm

### Installation

```bash
# Install dependencies
npm install

# Install browser binaries
npx playwright install
```

## Template Cleanup (Wajib)

Sebelum mulai development:
- Hapus semua file contoh bawaan template (mis. `tests/example.spec.ts`).
- Ganti data/fixture contoh dengan data project nyata, atau hapus jika tidak dipakai.
- Jangan tinggalkan test/fixture bernama "example", "sample", atau "template".

### Contoh prompt

```
Ikuti aturan di SOUL.md. Sebelum mulai, lakukan Template Cleanup: hapus file contoh bawaan template (mis. tests/example.spec.ts) dan bersihkan data/fixture contoh yang tidak dipakai.
```

```
Baca SOUL.md dan patuhi semua aturan. Langkah pertama: Template Cleanup — hapus tests/example.spec.ts, lalu cek fixture yang masih "sample/example" dan hapus yang tidak dipakai. Setelah itu baru lanjut task utama.
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:e2e
npm run test:integration
npm run test:unit

# Run with UI mode
npm run test:ui

# Run with headed mode
npm run test:headed
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:e2e` | Run E2E tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:unit` | Run unit tests only |
| `npm run test:ui` | Run tests with UI mode |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:report` | Show HTML test report |
| `npm run test:chrome` | Run tests on Chrome only |
| `npm run test:firefox` | Run tests on Firefox only |
| `npm run test:webkit` | Run tests on WebKit only |
| `npm run install:browsers` | Install all browser binaries |
| `npm run codegen` | Generate test code with Playwright Inspector |

## 📚 Documentation

- [`SOUL.md`](./SOUL.md) - Best practices and coding standards
- [`src/README.md`](./src/README.md) - Source directory documentation
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) - Contributing guidelines

## 🎯 Key Features

### Page Object Model

Semua page interactions melalui Page Object classes:

```typescript
import { LoginPage } from '../src/pages';

const loginPage = new LoginPage(page);
await loginPage.navigate();
await loginPage.performLogin(username, password);
```

### Test Data Fixtures

Test data terpisah dari kode test:

```typescript
import { getUserFixture } from '../src/fixtures';

const user = getUserFixture('valid');
```

### Utility Functions

Reusable utilities untuk common operations:

```typescript
import { generateRandomEmail, formatDate } from '../src/utils';

const email = generateRandomEmail();
const date = formatDate(new Date());
```

### Login Helper (WAJIB)

Semua test yang membutuhkan autentikasi HARUS menggunakan login helper:

```typescript
import { ensureLogin } from '../helpers';

test.describe('Authenticated Tests', () => {
    test.beforeEach(async ({ page }) => {
        // ✅ BENAR - Menggunakan login helper
        await ensureLogin(page, 'valid');
    });

    test('example test with login', async ({ page }) => {
        // User sudah authenticated
    });
});
```

**Pengecualian**: Login helper TIDAK boleh digunakan untuk test scenario login itu sendiri (e.g., `login.spec.ts`).

Lihat [`tests/example.spec.ts`](tests/example.spec.ts) untuk contoh lengkap.

### Environment Configuration

Environment-specific configuration:

```typescript
import { config, Environment } from '../src/config/env.config';

// Set environment via NODE_ENV
// NODE_ENV=staging npm test
```

## 🧪 Test Structure

### E2E Tests

Tests untuk user flows yang melibatkan multiple pages.

Location: `tests/e2e/`

### Integration Tests

Tests untuk integrasi antar components.

Location: `tests/integration/`

### Unit Tests

Tests untuk utility functions dan helper methods.

Location: `tests/unit/`

## 🎨 Best Practices

Project ini mengikuti best practices dari [`SOUL.md`](./SOUL.md):

- ✅ Gunakan **Page Object Model**
- ✅ Gunakan **data-testid** sebagai selector utama
- ✅ Buat test yang **independent** dan **focused**
- ✅ Pisahkan **test data** dari kode test
- ✅ Gunakan **timeout** yang wajar dan eksplisit
- ✅ Tulis **assertion** yang spesifik
- ✅ Handle **error** dengan pesan yang jelas
- ✅ Gunakan **TypeScript strict mode**
- ✅ Follow **naming conventions**
- ✅ Gunakan **login helper** untuk autentikasi di setiap test (kecuali test scenario login)

## 🔧 Configuration

### Environment Variables

Copy `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

### Playwright Config

Edit [`playwright.config.ts`](./playwright.config.ts) untuk mengubah:

- Base URL
- Timeout values
- Browser configurations
- Reporter settings

### TypeScript Config

Edit [`tsconfig.json`](./tsconfig.json) untuk mengubah:

- Compiler options
- Type checking rules
- Include/exclude paths

## 🐛 Debugging

### Debug Mode

```bash
npm run test:debug
```

### UI Mode

```bash
npm run test:ui
```

### Headed Mode

```bash
npm run test:headed
```

## 📊 Reports

### HTML Report

```bash
npm run test:report
```

### JSON Report

JSON report disimpan di `test-results/results.json`

## 🤝 Contributing

Lihat [`CONTRIBUTING.md`](./CONTRIBUTING.md) untuk panduan berkontribusi.

## 📖 References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Best Practices](./SOUL.md)

## 📄 License

ISC

---

**Versi**: 1.0.0
**Last Updated**: 2026-03-21

