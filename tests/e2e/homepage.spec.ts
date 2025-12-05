import {test, expect} from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Shopify/i);
  });

  test('should display navigation header', async ({page}) => {
    await page.goto('/');
    const header = page.locator('header, [role="banner"]');
    await expect(header).toBeVisible();
  });

  test('should navigate to products page', async ({page}) => {
    await page.goto('/');
    const productsLink = page.getByRole('link', {name: /products/i});
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await expect(page).toHaveURL(/products/i);
    }
  });

  test('should display search functionality', async ({page}) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });
});

