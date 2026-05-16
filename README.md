# AiT USA Institute Refresh

Static first-pass rebuild of the public Wix site at https://www.aitusainstitute.com/.

## Run Locally

```bash
node ./scripts/serve.mjs
```

Then open http://localhost:5173.

You can also open `index.html` directly in a browser. No package install is required for this version. The app is plain HTML, CSS, and JavaScript with local assets.

## Project Structure

- `index.html` - page shell
- `src/content.js` - structured copy, contact details, programs, books, schedules, FAQ, products
- `src/main.js` - renders the page and handles filters, mobile menu, FAQ, and lead form behavior
- `src/styles.css` - visual system and responsive layout
- `public/assets/wix/` - media downloaded from public Wix pages
- `public/assets/wix/products/` - product media pulled from Wix static media after dashboard access
- `content/raw/` - raw HTML snapshots captured from public pages
- `content/wix-backend/` - dashboard navigation, product-table exports, product detail snapshots, and distilled product catalog
- `content/capture-manifest.json` - capture report for pages and assets
- `content/image-inventory.json` - image alt/source/local mapping
- `content/external-links.txt` - Google Forms, WhatsApp, and social links found in the public HTML

## Capture Scripts

```bash
node ./scripts/capture-wix.mjs
node ./scripts/extract-image-inventory.mjs
node ./scripts/extract-links.mjs
node ./scripts/check-assets.mjs
node ./scripts/verify-browser.mjs
```

The capture script needs network access. It saves public page HTML and Wix-hosted media that are exposed in the rendered HTML.

`verify-browser.mjs` starts a temporary local server, opens Chrome/Edge headless through DevTools Protocol, checks desktop and mobile viewports, writes screenshots to `screenshots/`, and saves a JSON report.

## Wix Dashboard Capture

The Codex in-app browser was used with the logged-in Wix dashboard to capture the store catalog without touching private orders, contacts, inbox, or form submissions.

- `content/wix-backend/exports/store-products-full.json` - 8 product rows with Wix product IDs, prices, SKUs, statuses, and image URLs
- `content/wix-backend/exports/product-*-detail.json` - raw detail-page captures for each product
- `content/wix-backend/exports/products-structured.json` - cleaned product catalog used by the rebuilt page
- `content/wix-backend/snapshots/product-*.dom.txt` - DOM snapshots for audit/debugging

## Known Follow-Ups

- Verify all addresses and ZIP codes from the Wix dashboard. The public pages disagree on the Bound Brook ZIP; this rebuild uses `08805`, which matches Bound Brook, NJ.
- Replace the public Google Form `edit` links for level test and offers with public `viewform` links if the client wants those CTAs live.
- Connect the lead form to Wix Forms, a CRM, or another backend. The current form prepares a WhatsApp message only.
- Rebuild checkout with the approved provider. The current page preserves backend product/pricing info but does not process payments.
- The public student survey route returned `404`; dashboard access should confirm whether it moved or should be removed.
- A few Wix-generated/resizer asset URLs returned `403`; the named images and book covers were captured successfully.
- Social links should be verified. Facebook is client-specific; YouTube/Pinterest links exposed by the site appear to be Wix defaults.
