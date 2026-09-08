# Maqeed — Shopify theme

A minimal, warm-toned Shopify Online Store 2.0 theme built for the Maqeed
fragrance brand, based on the provided design: a full-bleed hero, an "on
making scent" story with pull quote, a 2×2 collection grid, an interactive
"Blend your own" tool, a three-step "how to wear it" ritual, and an email
signup, all in a cream / muted-gold / burnt-orange palette with serif
headings.

## What's included

- `layout/theme.liquid` — base HTML, loads theme fonts/colors from settings.
- `sections/` — header, footer, cart drawer, hero, story-quote,
  collection-grid, blend-tool, how-to-wear, newsletter, plus the main
  sections for product, collection, page, cart, search, blog, article,
  list-collections, 404, and every customer account page.
- `templates/` — JSON templates wiring the above sections together.
  `templates/index.json` reproduces the homepage from the design.
- `assets/theme.css`, `assets/theme.js` — styling and interactivity
  (mobile nav, AJAX cart drawer, variant picker, product image switcher,
  the blend-tool slider).
- `config/settings_schema.json` — theme settings: colors, fonts, logo,
  social links, cart behavior (drawer vs. page).

## Deploying to your Shopify store

**Option A — Shopify CLI (recommended)**

```
npm install -g @shopify/cli @shopify/theme
shopify theme dev --store your-store.myshopify.com    # preview locally
shopify theme push --store your-store.myshopify.com   # publish
```

**Option B — Admin upload**
Zip the contents of this repo (not the repo folder itself — `layout/`,
`sections/`, etc. should be at the zip root) and upload it under
**Online Store → Themes → Add theme → Upload zip** in your Shopify admin.

## The Philosophy page

A second, standalone page — "Made for what the light doesn't reach" — lives
at `templates/page.philosophy.json`. It reuses the theme's palette and type
but has its own sections: an in-page jump nav (Philosophy / The ritual /
Notes / Contact), a philosophy intro, a three-step "ritual" (warm the point,
press don't rub, give it a minute), a three-column notes breakdown (top /
heart / base), and a contact block.

- `sections/philosophy-nav.liquid`, `philosophy-intro.liquid`,
  `philosophy-ritual.liquid`, `philosophy-notes.liquid`,
  `philosophy-contact.liquid` — the new sections, each with editable
  settings/blocks in the theme editor.
- After pushing the theme, create a Page in **Online Store → Pages**,
  set its template to **page.philosophy**, and publish it. (This repo's
  automation also creates that page directly in the connected store — see
  below.)

## After installing

1. **Add products.** Create four products (e.g. Ember Ground, Dust Rose,
   Still Moss, Low Amber) with a featured image and a short description —
   the description is used as the teaser line on the homepage grid and
   collection pages.
2. **Create a collection** containing those products, then open the
   theme editor → homepage → **Collection grid** section and pick it.
3. **Set the main menu** (Online Store → Navigation → `main-menu`) with
   links such as Collection (`#collection`), Blend (`#blend`), Ritual
   (`#ritual`), and Contact — the homepage sections carry matching
   anchor ids so these scroll to the right place.
4. **Customize colors, fonts, and the logo** under Theme settings — the
   palette and type choices default to values matching the original
   design but are fully editable.
5. **Add fragrance notes** on each product page via the Product section's
   blocks (top / heart / base notes).
6. **Configure the footer banner image** (optional) in the Footer
   section settings for the dark full-bleed panel at the very bottom.

## Notes

- The newsletter form uses Shopify's native customer form (tagged
  `newsletter`) — no external app required.
- The cart is a slide-out drawer by default; switch to a full cart page
  under Theme settings → Cart.
- All required Shopify templates (index, product, collection, page,
  cart, search, blog, article, list-collections, 404, gift_card, and the
  customer account pages) are present so nothing 404s out of the box.
