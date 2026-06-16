<div align="center">
  <img src="public/centralB_logo.png" alt="Central Brownie" width="120" />

  <h1>Central Brownie</h1>

  <p><strong>Artisan dessert storefront — built with Astro, React & Tailwind CSS</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Astro-6.4-BC52EE?style=flat-square&logo=astro&logoColor=white" alt="Astro" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Bun-1-fbf0df?style=flat-square&logo=bun&logoColor=black" alt="Bun" />
  </p>

  <br />

  <img src="public/central_brownie_logo.jpg" alt="Central Brownie storefront" width="600" style="border-radius:12px" />
</div>

---

## What is this?

The official storefront for **Central Brownie**, a small-batch artisan dessert shop based in Mexico. Customers browse the catalog, add items to a cart, and place orders directly via WhatsApp.

The catalog is managed entirely through **Google Sheets** — no backend, no CMS. The owner updates a spreadsheet and the next build picks up the changes automatically.

---

## Features

| Feature | Details |
|---|---|
| **Product catalog** | 80+ products across 5 categories, fetched from Google Sheets at build time |
| **Category filter** | Client-side filtering by Brownies, Cheesecakes, Cupcakes, Pasteles, Galletas |
| **Real product photos** | Extracted from the menu PDF and matched to products automatically |
| **Shopping cart** | Persistent cross-island cart powered by Nanostores |
| **WhatsApp checkout** | Cart generates a pre-filled WhatsApp message for order placement |
| **Instagram feed** | Latest posts fetched from the Meta Graph API |
| **Featured glow card** | Most recent Instagram post with an animated gold/rose light-chasing border |
| **Fully static** | Pages are prerendered at build time — fast, no server round-trips |

---

## Tech stack

```
src/
├── components/       React islands + Astro components
│   ├── ProductCard.tsx        Product card with photo / emoji fallback
│   ├── ProductCatalog.tsx     Category filter + grid (React island)
│   ├── CartButton.tsx         Cart icon with item count
│   ├── CartSidebar.tsx        Slide-out cart with WhatsApp checkout
│   └── SocialFeed.tsx         Instagram feed with featured glow post
├── data/
│   ├── products.ts            Product type + mock fallback data
│   └── productImages.ts       Static ID-to-photo lookup map
├── lib/
│   ├── sheets.ts              Google Sheets CSV fetcher
│   └── meta.ts                Meta Graph API client (Instagram)
├── pages/
│   ├── index.astro            Landing page (featured products + social feed)
│   └── productos.astro        Full catalog page
└── stores/
    └── cart.ts                Nanostore for cart state
```

---

## Data flow

```
Google Sheets (public CSV)
        │
        ▼
  sheets.ts — fetches gviz CSV at build time
        │
        ▼
  index.astro — filters featured products (up to 6)
  productos.astro — passes all 80 products to catalog
        │
        ▼
  ProductCard — shows real photo if available, else emoji + gradient
```

The sheet is fetched via the `gviz/tq?tqx=out:csv` endpoint — no API key required as long as the sheet is set to "Anyone with the link can view."

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- A Google Sheet with the product catalog (see schema below)
- A Meta app with Instagram Graph API access (optional — for social feed)

### Install & run

```bash
bun install
bun dev
```

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Google Sheets — share the sheet publicly, paste the sheet ID from the URL
GOOGLE_SHEETS_ID=your_sheet_id_here

# Meta Graph API — for Instagram feed (optional)
META_ACCESS_TOKEN=your_long_lived_token
INSTAGRAM_USER_ID=your_instagram_user_id

# Facebook page stats (optional)
FACEBOOK_PAGE_ID=your_page_id
```

### Google Sheet schema

| Column | Type | Example |
|---|---|---|
| `id` | string slug | `brownies-6` |
| `name` | string | `Caja Brownies 6 pzs` |
| `category` | `brownies` \| `cheesecakes` \| `cupcakes` \| `galletas` \| `pasteles` | `brownies` |
| `description` | string | `6 brownies con toppings a elegir` |
| `price` | number | `210` |
| `emoji` | emoji | `🍫` |
| `from_color` | hex | `#3d1f0d` |
| `to_color` | hex | `#78350f` |
| `active` | `TRUE` \| `FALSE` | `TRUE` |
| `featured` | `TRUE` \| `FALSE` | `TRUE` |
| `image_url` | path or URL (optional) | `/productos/caja-brownies.jpg` |

### Build & deploy

```bash
bun run build    # outputs to /dist
bun run preview  # preview the production build locally
```

Deploy to **Vercel** in one step — it detects Astro automatically. Add the environment variables in the Vercel dashboard under Project Settings > Environment Variables.

---

## Commands

| Command | Action |
|---|---|
| `bun dev` | Start local dev server at `localhost:4321` |
| `bun run build` | Build for production to `./dist/` |
| `bun run preview` | Preview the production build locally |
| `bun run check` | Lint + format all files |

---

## License

Private — all rights reserved. © Central Brownie.
