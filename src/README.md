# Source Directory

This directory contains the source code for the Playwright test framework.

## Directory Structure

```
src/
├── config/          # Configuration files
│   └── env.config.ts # Environment configuration
├── fixtures/        # Test data and fixtures
│   ├── user.fixture.ts    # User-related test data
│   └── index.ts           # Central export
├── pages/           # Page Object Model classes
│   ├── BasePage.ts        # Base class for all pages
│   ├── LoginPage.ts       # Login page object
│   ├── HomePage.ts        # Home page object
│   ├── DashboardPage.ts   # Dashboard page object
│   └── index.ts           # Central export
└── utils/           # Utility functions
    ├── string.util.ts     # String manipulation utilities
    ├── date.util.ts       # Date manipulation utilities
    ├── common.util.ts     # Common utilities
    └── index.ts           # Central export
```

## Usage

### Importing Pages

```typescript
import { LoginPage, HomePage, DashboardPage } from '../src/pages';
```

### Importing Fixtures

```typescript
import { validUser, getUserFixture } from '../src/fixtures';
```

### Importing Utilities

```typescript
import { generateRandomEmail, formatDate } from '../src/utils';
```

### Importing Config

```typescript
import { config, Environment } from '../src/config/env.config';
```

## Best Practices

1. **Page Object Model**: All page interactions should go through Page Object classes
2. **Test Data Separation**: Use fixtures for test data, don't hardcode in tests
3. **Reusable Utilities**: Common functions should be in utils directory
4. **Environment Config**: Use environment configuration for different environments

## Naming Conventions

- **Page Classes**: PascalCase with `Page` suffix (e.g., `LoginPage`)
- **Utility Files**: camelCase with `.util.ts` suffix (e.g., `string.util.ts`)
- **Fixture Files**: camelCase with `.fixture.ts` suffix (e.g., `user.fixture.ts`)
- **Functions**: camelCase (e.g., `generateRandomEmail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TIMEOUT_DEFAULT`)
