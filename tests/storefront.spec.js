const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto('/');
});

test('catalog renders all four demo products', async ({ page }) => {
  await expect(page.locator('#products .product')).toHaveCount(4);
  await expect(page.locator('#products')).toContainText('The Original Habanero');
  await expect(page.locator('#products')).toContainText('Mexican Style Jalapeño');
  await expect(page.locator('#products')).toContainText('Purple Haze');
  await expect(page.locator('#products')).toContainText('Afterburn Inferno');
});

test('heat filters update the visible catalog and active state', async ({ page }) => {
  await page.locator('#filters [data-filter="mild"]').click();
  await expect(page.locator('#products .product')).toHaveCount(1);
  await expect(page.locator('#products')).toContainText('Mexican Style Jalapeño');
  await expect(page.locator('#filters [data-filter="mild"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#filters [data-filter="all"]').click();
  await expect(page.locator('#products .product')).toHaveCount(4);
});

test('product detail routes render the selected product', async ({ page }) => {
  await page.locator('#products a[href="#product/purple-haze"]').first().click();
  await expect(page).toHaveURL(/#product\/purple-haze$/);
  await expect(page.locator('#productPage')).toBeVisible();
  await expect(page.locator('#productPage h2')).toHaveText('Purple Haze');
  await expect(page.locator('#productPage')).toContainText('$9.49');
});

test('add to bag, quantity updates, and subtotal stay in sync', async ({ page }) => {
  await page.locator('#products [data-add="original"]').click();
  await expect(page.locator('#cartCount')).toHaveText('1');
  await page.locator('#cartOpen').click();
  await expect(page.locator('#cartOverlay')).toHaveClass(/open/);
  await expect(page.locator('#cartContents')).toContainText('The Original Habanero');
  await expect(page.locator('#subtotal')).toHaveText('$9.99');
  await page.locator('#cartContents [data-qty="original"][data-delta="1"]').click();
  await expect(page.locator('#cartCount')).toHaveText('2');
  await expect(page.locator('#subtotal')).toHaveText('$19.98');
  await page.reload();
  await expect(page.locator('#cartCount')).toHaveText('2');
});

test('checkout creates an explicitly local demo order without taking payment', async ({ page }) => {
  await page.locator('#products [data-add="jalapeno"]').click();
  await page.locator('#cartOpen').click();
  await page.locator('#checkoutStart').click();
  await page.locator('#customerName').fill('Demo Customer');
  await page.locator('#customerEmail').fill('demo@example.com');
  await page.locator('#customerAddress').fill('123 Test Street');
  await page.locator('#customerCity').fill('Troy');
  await page.locator('#customerState').selectOption({ label: 'Ohio' }).catch(async () => {
    await page.locator('#customerState').fill('OH');
  });
  await page.locator('#customerZip').fill('45373');
  await page.locator('#checkoutForm button[type="submit"]').click();
  await expect(page.locator('#orderComplete')).toContainText(/payment has not been taken/i);
  const orders = await page.evaluate(() => JSON.parse(localStorage.getItem('hitsauce_demo_orders') || '[]'));
  expect(orders).toHaveLength(1);
  expect(orders[0].status).toContain('payment not processed');
});
