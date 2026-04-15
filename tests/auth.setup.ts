import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage, DashboardPage } from '../src/pages';
import { getUserFixture } from '../src/fixtures';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

/**
 * Global auth setup.
 *
 * Menjalankan login sekali dan menyimpan session ke storageState
 * untuk dipakai project test yang membutuhkan authenticated user.
 */
setup('authenticate', async ({ page }) => {
    fs.mkdirSync(path.dirname(authFile), { recursive: true });

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const user = getUserFixture('valid');

    await loginPage.navigate();
    await loginPage.performLogin(user.email, user.password);
    await dashboardPage.verifyPage();

    await page.context().storageState({ path: authFile });
});
