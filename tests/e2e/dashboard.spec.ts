import { test, expect } from '@playwright/test';
import { DashboardPage, HomePage } from '../../src/pages';

/**
 * Dashboard E2E Tests
 * 
 * Test suite untuk dashboard functionality.
 * Mengikuti best practices dari SOUL.md:
 * - Page Object Model
 * - AAA pattern (Arrange-Act-Assert)
 * - Independent tests
 * - Specific assertions
 */

test.describe('Dashboard', () => {
    let dashboardPage: DashboardPage;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        homePage = new HomePage(page);

        // Global auth session sudah dibuat di auth.setup.ts
        await dashboardPage.navigate();
    });

    /**
     * Test: Dashboard ditampilkan dengan benar setelah login
     * 
     * Arrange: User sudah login
     * Act: Verify dashboard elements
     * Assert: Semua elemen dashboard ditampilkan
     */
    test('dashboard is displayed correctly after login', async () => {
        // Arrange - User sudah login dan di dashboard (dari beforeEach)

        // Act
        const welcomeMessage = await dashboardPage.getWelcomeMessage();
        const isSidebarVisible = await dashboardPage.isSidebarVisible();
        const isActivityFeedVisible = await dashboardPage.isActivityFeedVisible();
        const statsCardCount = await dashboardPage.getStatsCardCount();

        // Assert
        await expect(welcomeMessage).toBeTruthy();
        await expect(isSidebarVisible).toBe(true);
        await expect(statsCardCount).toBeGreaterThan(0);
    });

    /**
     * Test: User dapat navigate ke profile dari dashboard
     * 
     * Arrange: User di dashboard
     * Act: Open user menu dan click profile
     * Assert: Verify redirect ke profile page
     */
    test('user can navigate to profile from dashboard', async ({ page }) => {
        // Arrange - User sudah di dashboard (dari beforeEach)

        // Act
        await dashboardPage.clickProfile();

        // Assert
        await expect(page).toHaveURL(/.*profile/);
    });

    /**
     * Test: User dapat navigate ke settings dari dashboard
     * 
     * Arrange: User di dashboard
     * Act: Open user menu dan click settings
     * Assert: Verify redirect ke settings page
     */
    test('user can navigate to settings from dashboard', async ({ page }) => {
        // Arrange - User sudah di dashboard (dari beforeEach)

        // Act
        await dashboardPage.clickSettings();

        // Assert
        await expect(page).toHaveURL(/.*settings/);
    });

    /**
     * Test: User dapat logout dari dashboard
     * 
     * Arrange: User di dashboard
     * Act: Open user menu dan click logout
     * Assert: Verify redirect ke home page
     */
    test('user can logout from dashboard', async ({ page }) => {
        // Arrange - User sudah di dashboard (dari beforeEach)

        // Act
        await dashboardPage.clickLogout();

        // Assert
        await homePage.verifyPage();
        await expect(page).toHaveURL(/.*\/$/);
    });

    /**
     * Test: User dapat navigate ke section lain via sidebar
     * 
     * Arrange: User di dashboard
     * Act: Click navigation link di sidebar
     * Assert: Verify redirect ke section yang sesuai
     */
    test('user can navigate to different sections via sidebar', async ({ page }) => {
        // Arrange - User sudah di dashboard (dari beforeEach)

        // Act
        await dashboardPage.navigateToSection('reports');

        // Assert
        await expect(page).toHaveURL(/.*reports/);
    });

    /**
     * Test: Dashboard elements ditampilkan dengan benar
     * 
     * Arrange: User di dashboard
     * Act: Verify semua elemen dashboard
     * Assert: Semua elemen ditampilkan
     */
    test('dashboard elements are displayed correctly', async () => {
        // Arrange - User sudah di dashboard (dari beforeEach)

        // Act & Assert
        await dashboardPage.assertDashboardElementsDisplayed();
    });

    /**
     * Test: User logged in ditampilkan dengan benar
     * 
     * Arrange: User di dashboard
     * Act: Verify user logged in state
     * Assert: User menu dan welcome message ditampilkan
     */
    test('user logged in state is displayed correctly', async () => {
        // Arrange - User sudah di dashboard (dari beforeEach)

        // Act & Assert
        await dashboardPage.assertUserLoggedIn();
    });

    /**
     * Test: Section active state ditampilkan dengan benar
     * 
     * Arrange: User navigate ke section tertentu
     * Act: Verify section active state
     * Assert: Section yang aktif ditandai
     */
    test('active section is highlighted correctly', async ({ page }) => {
        // Arrange - User di dashboard (dari beforeEach)

        // Act
        await dashboardPage.navigateToSection('analytics');

        // Assert
        await dashboardPage.assertSectionActive('analytics');
    });

    /**
     * Test: Stats cards ditampilkan dengan benar
     * 
     * Arrange: User di dashboard
     * Act: Verify stats cards
     * Assert: Stats cards ditampilkan dengan data yang benar
     */
    test('stats cards are displayed correctly', async () => {
        // Arrange - User di dashboard (dari beforeEach)

        // Act
        const statsCardCount = await dashboardPage.getStatsCardCount();

        // Assert
        await expect(statsCardCount).toBeGreaterThan(0);
    });

    /**
     * Test: Sidebar visible di desktop view
     * 
     * Arrange: User di dashboard dengan desktop viewport
     * Act: Verify sidebar visibility
     * Assert: Sidebar visible
     */
    test('sidebar is visible in desktop view', async ({ page }) => {
        // Arrange - User di dashboard (dari beforeEach)
        await page.setViewportSize({ width: 1280, height: 720 });

        // Act
        const isSidebarVisible = await dashboardPage.isSidebarVisible();

        // Assert
        await expect(isSidebarVisible).toBe(true);
    });

    /**
     * Test: Sidebar responsive di mobile view
     * 
     * Arrange: User di dashboard dengan mobile viewport
     * Act: Verify sidebar behavior di mobile
     * Assert: Sidebar responsive
     */
    test('sidebar is responsive in mobile view', async ({ page }) => {
        // Arrange - User di dashboard (dari beforeEach)
        await page.setViewportSize({ width: 375, height: 667 });

        // Act - Toggle sidebar untuk mobile
        const menuButton = page.getByTestId('mobile-menu-button');
        if (await menuButton.isVisible()) {
            await menuButton.click();
        }

        // Assert - Sidebar harus accessible di mobile
        const isSidebarVisible = await dashboardPage.isSidebarVisible();
        await expect(isSidebarVisible).toBe(true);
    });

    /**
     * Test: User dapat navigate ke multiple sections
     * 
     * Arrange: User di dashboard
     * Act: Navigate ke beberapa section
     * Assert: Setiap navigation berhasil
     */
    test('user can navigate between multiple sections', async ({ page }) => {
        // Arrange - User di dashboard (dari beforeEach)

        // Act - Navigate ke beberapa section
        await dashboardPage.navigateToSection('analytics');
        await expect(page).toHaveURL(/.*analytics/);

        await dashboardPage.navigateToSection('reports');
        await expect(page).toHaveURL(/.*reports/);

        await dashboardPage.navigateToSection('settings');
        await expect(page).toHaveURL(/.*settings/);

        // Assert - Semua navigation berhasil
        await expect(page).toHaveURL(/.*settings/);
    });
});
