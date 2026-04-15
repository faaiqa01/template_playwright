import { test, expect } from '@playwright/test';
import { LoginPage, HomePage, DashboardPage } from '../../src/pages';
import { validUser, invalidUser, getUserFixture } from '../../src/fixtures';

/**
 * Login E2E Tests
 * 
 * Test suite untuk login functionality.
 * Mengikuti best practices dari SOUL.md:
 * - Page Object Model
 * - AAA pattern (Arrange-Act-Assert)
 * - Independent tests
 * - Specific assertions
 * - Test data dari fixtures
 */

test.describe('Login Functionality', () => {
    // Login scenarios harus berjalan tanpa authenticated session global
    test.use({ storageState: { cookies: [], origins: [] } });

    let loginPage: LoginPage;
    let homePage: HomePage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        dashboardPage = new DashboardPage(page);

        // Navigate to login page
        await loginPage.navigate();
    });

    /**
     * Test: User berhasil login dengan kredensial valid
     * 
     * Arrange: Setup valid user credentials
     * Act: Fill login form dan submit
     * Assert: Verify login success dan redirect ke dashboard
     */
    test('user can login with valid credentials', async ({ page }) => {
        // Arrange
        const user = getUserFixture('valid');

        // Act
        await loginPage.performLogin(user.email, user.password);

        // Assert
        await dashboardPage.verifyPage();
        await dashboardPage.assertUserLoggedIn();
        await expect(page).toHaveURL(/.*dashboard/);
    });

    /**
     * Test: User gagal login dengan kredensial invalid
     * 
     * Arrange: Setup invalid user credentials
     * Act: Fill login form dengan invalid credentials dan submit
     * Assert: Verify error message ditampilkan
     */
    test('user cannot login with invalid credentials', async ({ page }) => {
        // Arrange
        const user = invalidUser;

        // Act
        await loginPage.performLogin(user.email, user.password);

        // Assert
        await loginPage.assertLoginFailed('Invalid username or password');
        await expect(page).toHaveURL(/.*login/);
    });

    /**
     * Test: User gagal login dengan username kosong
     * 
     * Arrange: Setup user dengan username kosong
     * Act: Fill hanya password dan submit
     * Assert: Verify validation error
     */
    test('user cannot login with empty username', async ({ page }) => {
        // Arrange
        const user = validUser;

        // Act
        await loginPage.fillPassword(user.password);
        await loginPage.clickLoginButton();

        // Assert
        await loginPage.assertUsernameError();
    });

    /**
     * Test: User gagal login dengan password kosong
     * 
     * Arrange: Setup user dengan password kosong
     * Act: Fill hanya username dan submit
     * Assert: Verify validation error
     */
    test('user cannot login with empty password', async ({ page }) => {
        // Arrange
        const user = validUser;

        // Act
        await loginPage.fillUsername(user.email);
        await loginPage.clickLoginButton();

        // Assert
        await loginPage.assertPasswordError();
    });

    /**
     * Test: User berhasil login dengan remember me checked
     * 
     * Arrange: Setup valid user credentials
     * Act: Check remember me, fill form, dan submit
     * Assert: Verify login success
     */
    test('user can login with remember me enabled', async ({ page }) => {
        // Arrange
        const user = getUserFixture('valid');

        // Act
        await loginPage.fillLoginForm(user.email, user.password);
        await loginPage.setRememberMe(true);
        await loginPage.clickLoginButton();

        // Assert
        await dashboardPage.verifyPage();
        await expect(await loginPage.isRememberMeChecked()).toBe(true);
    });

    /**
     * Test: User dapat navigate ke forgot password page
     * 
     * Arrange: User di login page
     * Act: Click forgot password link
     * Assert: Verify redirect ke forgot password page
     */
    test('user can navigate to forgot password page', async ({ page }) => {
        // Arrange - User sudah di login page (dari beforeEach)

        // Act
        await loginPage.clickForgotPassword();

        // Assert
        await expect(page).toHaveURL(/.*forgot-password/);
    });

    /**
     * Test: User dapat navigate ke register page
     * 
     * Arrange: User di login page
     * Act: Click register link
     * Assert: Verify redirect ke register page
     */
    test('user can navigate to register page', async ({ page }) => {
        // Arrange - User sudah di login page (dari beforeEach)

        // Act
        await loginPage.clickRegister();

        // Assert
        await expect(page).toHaveURL(/.*register/);
    });

    /**
     * Test: Login button disabled saat form tidak valid
     * 
     * Arrange: User di login page dengan form kosong
     * Act: Cek state login button
     * Assert: Verify login button disabled
     */
    test('login button is disabled when form is invalid', async () => {
        // Arrange - Form kosong (dari beforeEach)

        // Act
        const isEnabled = await loginPage.isLoginButtonEnabled();

        // Assert
        await expect(isEnabled).toBe(false);
    });

    /**
     * Test: User berhasil logout dari dashboard
     * 
     * Arrange: Login user dan navigate ke dashboard
     * Act: Click logout button
     * Assert: Verify redirect ke home page
     */
    test('user can logout from dashboard', async ({ page }) => {
        // Arrange
        const user = getUserFixture('valid');
        await loginPage.performLogin(user.email, user.password);
        await dashboardPage.verifyPage();

        // Act
        await dashboardPage.clickLogout();

        // Assert
        await homePage.verifyPage();
        await expect(page).toHaveURL(/.*\/$/);
    });
});
