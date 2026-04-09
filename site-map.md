# CashBack Club Site Map

Use this map when you want to change one exact thing fast.

## Where things live

- Main page markup: `html/index.html`
- Supabase config: `scripts/config/supabase.js`
- Product data + admin access map: `scripts/data/site-data.js`
- Main app logic: `scripts/app.js`
- All styling (single file): `styles/style.css`
- Product images: `assets/images/products/`
- Payment method images: `assets/images/payments/`

## Quick editing guide

- Change green pill look:
  Edit `.badge`, `.cashback-tag`, `.hover-pop-badge`, or `.status-pill*` in `styles/style.css`

- Change product-image compare hover:
  Edit `.compare-trigger`, `.product-hover-pop`, `.hover-pop-market*`, or `.product-card.show-compare` in `styles/style.css`

- Change product names, prices, links, cashback rates:
  Edit `PRODUCTS` and `PRODUCT_MARKET_DATA` in `scripts/data/site-data.js`

- Change compare button behavior or “Shop now” routing:
  Edit `toggleComparePanel`, `goToMarket`, and `renderProducts` in `scripts/app.js`

- Change auth, claims, withdrawals, admin actions:
  Edit `handleSignup`, `handleLogin`, `submitClaim`, `submitWithdraw`, `loadAdminData`, and approval/rejection functions in `scripts/app.js`

- Change backend project connection:
  Edit `SUPA_URL` and `SUPA_KEY` in `scripts/config/supabase.js`
