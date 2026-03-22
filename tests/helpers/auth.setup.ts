import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../../src/pages';
import { getUserFixture } from '../../src/fixtures';

/**
 * Authentication Setup
 * 
 * Setup untuk membuat storage state yang dapat digunakan untuk test
 * yang membutuhkan autentikasi tanpa login manual setiap kali.
 * 
 * Storage state akan disimpan di tests/.auth/ folder.
 * 
 * Usage:
 * 1. Jalankan setup script: npx playwright test --config=playwright.config.ts --project=setup
 * 2. Gunakan storage state di test: test.use({ storageState: 'tests/.auth/valid-user.json' })
 */

/**
 * Create storage state untuk user tertentu
 * 
 * @param userType - Type of user dari fixture
 * @param storageStatePath - Path untuk menyimpan storage state
 */
export async function createStorageState(
    userType: 'valid' | 'admin' | 'invalid' | 'new',
    storageStatePath: string
): Promise<void> {
    // Create browser context
    const { chromium } = await import('@playwright/test');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Login
    const loginPage = new LoginPage(page);
    const user = getUserFixture(userType);
    
    await loginPage.navigate();
    await loginPage.performLogin(user.email, user.password);
    
    // Wait untuk login success
    await page.waitForLoadState('networkidle');
    
    // Save storage state
    await context.storageState({ path: storageStatePath });
    
    // Close browser
    await browser.close();
}

/**
 * Test fixture dengan authenticated state
 * 
 * Gunakan ini untuk membuat test yang otomatis authenticated.
 * 
 * Example:
 * ```typescript
 * const test = authenticatedTest.extend<{ page: Page }>({
 *   page: async ({ authenticatedPage }, use) => {
 *     await use(authenticatedPage);
 *   }
 * });
 * ```
 */
export const authenticatedTest = base.extend<{
    authenticatedPage: Page;
}>({
    authenticatedPage: async ({ page }, use) => {
        // Login menggunakan helper
        const { ensureLogin } = await import('./login.helper');
        await ensureLogin(page, 'valid');
        await use(page);
    },
});

/**
 * Test fixture dengan authenticated state untuk admin
 */
export const adminAuthenticatedTest = base.extend<{
    authenticatedPage: Page;
}>({
    authenticatedPage: async ({ page }, use) => {
        const { ensureLogin } = await import('./login.helper');
        await ensureLogin(page, 'admin');
        await use(page);
    },
});

/**
 * Setup script untuk membuat storage state files
 *
 * Jalankan ini sebelum menjalankan test suite:
 * npx ts-node tests/helpers/auth.setup.ts
 *
 * Atau gunakan test project khusus setup di playwright.config.ts:
 *
 * ```typescript
 * projects: [
 *   {
 *     name: 'setup',
 *     testMatch: /auth.setup\.ts/,
 *   },
 *   // ... other projects
 * ]
 * ```
 */
export async function setupAuthStates(): Promise<void> {
    // Note: Untuk menggunakan storage state, jalankan test setup
    // atau gunakan test.use({ storageState: 'path/to/file.json' })
    
    // Create storage state untuk valid user
    await createStorageState('valid', 'tests/.auth/valid-user.json');
    
    // Create storage state untuk admin user
    await createStorageState('admin', 'tests/.auth/admin-user.json');
    
    console.log('✅ Storage states created successfully!');
}
