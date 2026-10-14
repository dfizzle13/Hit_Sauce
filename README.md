# HIT SAUCE Storefront

A responsive, single-file storefront prototype inspired by the current HIT SAUCE label artwork: comic-book bursts, a navy base, electric cyan and pink accents, punch yellow, orange-red flavor color, and the pepper mascot motif. The wordmark intentionally reads **HIT SAUCE** (the I is a letter, not an exclamation point).

## Run it
Open `index.html` in a modern browser, or enable GitHub Pages for the repository to publish the static storefront.

## Included in this prototype
- Responsive product catalog with four mock flavor concepts and heat filters.
- Add-to-cart, quantity changes, cart subtotal, and stock-aware add buttons.
- Demo checkout form with delivery details and a locally stored order preview.
- Browser-local product management: add, edit, remove, update price/description/heat/badge/stock.
- Browser-local cart, product catalog, and demo order history.

## Important before real sales
This is a frontend prototype. It has no secure admin authentication, shared product database, authoritative inventory, server-side order processing, email service, tax/shipping calculation, or payment processor. Local storage is specific to one browser and can be edited by a customer. The checkout intentionally does not collect payment details or claim to take payment. Before accepting real orders, add a secure backend/CMS, authenticated admin roles, inventory/order persistence, validated shipping/tax logic, transactional email, and a payment provider checkout session/webhook flow. Do not treat demo orders as purchases.

The flavor listings other than the brand's stated Original Habanero and Mexican Style Jalapeño are mock concepts and should be reviewed/replaced before publication.
