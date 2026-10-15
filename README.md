# HIT SAUCE Storefront

A responsive storefront prototype inspired by the HIT SAUCE label direction: bold, high-energy attitude, navy, electric cyan and pink accents, punch yellow, and bold flavor color. The wordmark intentionally reads **HIT SAUCE** (the I is a letter, not an exclamation point). Brand line: **Bold Flavor Hits Different**.

## Project layout

- `index.html` — page structure, accessible control labels, and semantic sections.
- `css/storefront.css` — responsive layout, visual system, components, and motion.
- `js/storefront.js` — catalog rendering, product detail routing, cart state, demo checkout, browser-local reviews, and the local product manager.
- `tests/storefront.spec.js` — Playwright end-to-end regression tests for the storefront's main customer journeys.
- `playwright.config.js` and `package.json` — browser-test setup and commands.
- `.github/workflows/deploy-pages.yml` — runs browser tests first and deploys the public storefront only when they pass.

## Run locally

Use Node.js 20+ and Python 3. Start the test suite with:

```sh
npm install
npx playwright install chromium
npm test
```

Playwright starts a local static server automatically. To preview without tests, run `python3 -m http.server 4173` and open `http://127.0.0.1:4173`.

## Current prototype capabilities

- Four mock flavor concepts with searchable catalog, heat filters, price/name/heat sorting, distinct on-brand bottle illustrations, and product detail views.
- Add-to-bag, quantity controls, stock-aware add buttons, subtotal calculation, and browser-local cart persistence.
- Mobile-first navigation and responsive catalog controls with empty-state recovery.
- Demo checkout that records an explicitly non-payment order preview in this browser.
- Browser-local product management: add, edit, remove, and update price, description, heat, badge, and stock.
- Browser-local sample/reviewer content.

## Important before real sales

This is still a frontend prototype. It does **not** have secure admin authentication, a shared product database, authoritative inventory, server-side order processing, email service, tax/shipping calculation, or a payment processor. Local storage is specific to one browser and can be edited by a customer. Demo checkout does not collect payment details and does not create a real purchase.

Before accepting real orders, add a secure backend/CMS, authenticated admin roles, server-side inventory and order persistence, validated shipping/tax logic, transactional email, and a payment-provider checkout session plus verified webhook handling. Never trust prices, stock, or totals supplied by the browser.

The confirmed flavor names are Original Habanero and Mexican Style Jalapeño. Purple Haze and Afterburn Inferno are mock concepts and should be reviewed or replaced before launch.
