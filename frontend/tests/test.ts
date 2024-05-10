import { expect, test } from '@playwright/test';

test('Welcome page', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
