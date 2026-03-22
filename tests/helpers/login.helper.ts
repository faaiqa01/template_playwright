import { Page } from '@playwright/test';
import { LoginPage } from '../../src/pages';
import { getUserFixture } from '../../src/fixtures';

/**
 * Type untuk user fixture yang tersedia
 */
export type UserType = 'valid' | 'admin' | 'invalid' | 'new';

/**
 * Login Helper
 *
 * Helper function untuk melakukan login di test.
 * Wajib digunakan di beforeEach hook untuk setiap test yang membutuhkan autentikasi.
 *
 * @param page - Playwright Page instance
 * @param userType - Type of user dari fixture ('valid', 'admin', 'invalid', 'new')
 * @param options - Optional configuration
 */
export async function ensureLogin(
    page: Page,
    userType: UserType,
    options?: {
        /**
         * Skip navigation ke login page jika sudah di halaman yang benar
         * @default false
         */
        skipNavigation?: boolean;
        
        /**
         * Custom user credentials untuk override fixture
         */
        customCredentials?: {
            email: string;
            password: string;
        };
    }
): Promise<void> {
    const loginPage = new LoginPage(page);
    
    // Get user fixture atau gunakan custom credentials
    const user = options?.customCredentials || getUserFixture(userType as UserType);
    
    // Navigate ke login page jika diperlukan
    if (!options?.skipNavigation) {
        await loginPage.navigate();
    }
    
    // Perform login
    await loginPage.performLogin(user.email, user.password);
    
    // Wait untuk login success
    await page.waitForLoadState('networkidle');
}

/**
 * Logout helper
 * 
 * Helper function untuk melakukan logout dari aplikasi.
 * 
 * @param page - Playwright Page instance
 */
export async function ensureLogout(page: Page): Promise<void> {
    const { DashboardPage } = await import('../../src/pages');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.clickLogout();
    await page.waitForLoadState('networkidle');
}
