import { test, expect } from '@playwright/test';
import { ensureLogin } from './helpers';

/**
 * Example Test File
 * 
 * Ini adalah file test contoh yang dibuat oleh Playwright saat instalasi.
 * File ini bisa dihapus atau dimodifikasi sesuai kebutuhan.
 * 
 * Untuk test yang lebih lengkap, lihat folder:
 * - tests/e2e/ - End-to-end tests
 * - tests/integration/ - Integration tests
 * - tests/unit/ - Unit tests
 */

test.describe('Example Tests', () => {
    /**
     * Example: Test tanpa login
     * 
     * Test ini tidak membutuhkan autentikasi, jadi tidak menggunakan login helper.
     */
    test('example test without login', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });

    /**
     * Example: Test dengan login helper (WAJIB)
     * 
     * ✅ BENAR - Menggunakan login helper di beforeEach
     * 
     * Semua test yang membutuhkan autentikasi HARUS menggunakan login helper.
     * Login helper TIDAK boleh digunakan untuk test scenario login itu sendiri.
     */
    test.describe('Authenticated Tests', () => {
        test.beforeEach(async ({ page }) => {
            // ✅ BENAR - Menggunakan login helper
            await ensureLogin(page, 'valid');
        });

        test('example test with login', async ({ page }) => {
            // User sudah authenticated
            // Test logic di sini...
        });

        /**
         * Example: Test dengan custom credentials
         * 
         * Gunakan options parameter untuk custom credentials
         */
        test('example test with custom credentials', async ({ page }) => {
            // Custom credentials bisa di-pass di beforeEach
            // await ensureLogin(page, 'valid', {
            //     customCredentials: {
            //         email: 'custom@example.com',
            //         password: 'CustomPass123!'
            //     }
            // });
        });
    });

    /**
     * Example: Test dengan admin user
     * 
     * Gunakan userType 'admin' untuk login sebagai admin
     */
    test.describe('Admin Tests', () => {
        test.beforeEach(async ({ page }) => {
            await ensureLogin(page, 'admin');
        });

        test('example admin test', async ({ page }) => {
            // User sudah authenticated sebagai admin
            // Test logic di sini...
        });
    });
});

/**
 * ❌ DILARANG - Login manual di test (KECUALI test scenario login)
 * 
 * Contoh anti-pattern yang DILARANG:
 * 
 * ```typescript
 * test.beforeEach(async ({ page }) => {
 *     // ❌ DILARANG - Login manual di test
 *     const loginPage = new LoginPage(page);
 *     const user = getUserFixture('valid');
 *     await loginPage.navigate();
 *     await loginPage.performLogin(user.email, user.password);
 * });
 * ```
 * 
 * Gunakan login helper sebagai gantinya:
 * 
 * ```typescript
 * test.beforeEach(async ({ page }) => {
 *     // ✅ BENAR - Menggunakan login helper
 *     await ensureLogin(page, 'valid');
 * });
 * ```
 * 
 * Pengecualian: Login helper TIDAK boleh digunakan untuk test scenario login
 * itu sendiri (e.g., `login.spec.ts`).
 */
