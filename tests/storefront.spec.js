const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.setDefaultNavigationTimeout(10000);
  // Product photography is third-party hosted; the interaction suite should not depend on that host.
  await page.route('https://imagemo.fsn1.your-objectstorage.com/**', route => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
});

test('loads the storefront without uncaught JavaScript errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload({ waitUntil: 'domcontentloaded' });
  expect(errors).toEqual([]);
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


test('mobile navigation is accessible and opens the section links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.locator('#mobileMenuToggle');
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#primaryNav')).toBeVisible();
  await page.locator('#primaryNav a[href="#story"]').click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#story$/);
});

test('storefront fits common mobile viewport widths without horizontal page overflow', async ({ page }) => {
  for (const width of [320, 360, 390, 430, 640]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth
    }));
    expect(dimensions.page, `horizontal overflow at viewport width ${width}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
    await expect(page.locator('#cartOpen')).toBeVisible();
    await expect(page.locator('#products .product')).toHaveCount(4);
  }
});

test('catalog search finds products by name and clear restores the lineup', async ({ page }) => {
  await page.locator('#productSearch').fill('purple');
  await expect(page.locator('#products .product')).toHaveCount(1);
  await expect(page.locator('#products')).toContainText('Purple Haze');
  await expect(page.locator('#filterStatus')).toContainText('Showing 1 of 4');
  await page.locator('#clearCatalog').click();
  await expect(page.locator('#productSearch')).toHaveValue('');
  await expect(page.locator('#products .product')).toHaveCount(4);
});

test('catalog sort changes price order and heat filters compose with search', async ({ page }) => {
  await page.locator('#productSort').selectOption('price-low');
  await expect(page.locator('#products .product').first()).toContainText('Mexican Style Jalapeño');
  await page.locator('#filters [data-filter="hot"]').click();
  await expect(page.locator('#products .product')).toHaveCount(2);
  await page.locator('#productSearch').fill('inferno');
  await expect(page.locator('#products .product')).toHaveCount(1);
  await expect(page.locator('#products .product').first()).toContainText('Afterburn Inferno');
});

test('each flavor uses a distinct on-brand mock bottle illustration without generic stock photos', async ({ page }) => {
  await expect(page.locator('#products .bottle-render')).toHaveCount(4);
  await expect(page.locator('#products .bottle-label-art strong')).toHaveCount(4);
  await expect(page.locator('#products .product-stock-image')).toHaveCount(0);
});
