# AiT USA Institute Refresh

Next-hosted refresh of the public AiT USA Institute site, with a legacy
HTML/CSS/JavaScript homepage and Next application/API routes.

## Run Locally

```bash
node ./scripts/serve.mjs
```

Then open http://localhost:5173.

You can also open `index.html` directly in a browser. No package install is required for this version. The app is plain HTML, CSS, and JavaScript with local assets.

## Project Structure

- `index.html` - page shell
- `src/content.js` - structured copy, contact details, active programs, schedules, FAQ, and published media
- `src/main.js` - renders the page and handles filters, mobile menu, FAQ, and lead form behavior
- `src/styles.css` - visual system and responsive layout
- `public/assets/` - media used by current public routes and SEO metadata
- `content/external-links.txt` - Google Forms, WhatsApp, and social links found in the public HTML
- `content/site-content.md` - concise source notes retained from the original migration

## Capture Scripts

```bash
node ./scripts/capture-wix.mjs
node ./scripts/extract-image-inventory.mjs
node ./scripts/extract-links.mjs
node ./scripts/check-assets.mjs
node ./scripts/verify-browser.mjs
```

The capture script needs network access. Its raw HTML, inventory, and dashboard
outputs are local-only migration artifacts and are ignored by Git.

`verify-browser.mjs` starts a temporary local server, opens Chrome/Edge headless through DevTools Protocol, checks desktop and mobile viewports, writes screenshots to `screenshots/`, and saves a JSON report.

## Historical Migration Evidence

The original Wix captures, product snapshots, generated screenshots, and design
evidence remain recoverable from Git commit `3578ef8`. They are not required by
the production build and should not be recommitted to the active product tree.

## Known Follow-Ups

- Verify all addresses and ZIP codes from the Wix dashboard. The public pages disagree on the Bound Brook ZIP; this rebuild uses `08805`, which matches Bound Brook, NJ.
- Replace the public Google Form `edit` links for level test and offers with public `viewform` links if the client wants those CTAs live.
- Connect the lead form to Wix Forms, a CRM, or another backend. The current form prepares a WhatsApp message only.
- Rebuild checkout with the approved provider. The current page preserves backend product/pricing info but does not process payments.
- The public student survey route returned `404`; dashboard access should confirm whether it moved or should be removed.
- A few Wix-generated/resizer asset URLs returned `403`; the named images and book covers were captured successfully.
- Social links should be verified. Facebook is client-specific; YouTube/Pinterest links exposed by the site appear to be Wix defaults.
