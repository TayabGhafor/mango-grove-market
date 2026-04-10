# Mango Grove Market Progress Tracker

Last updated: 2026-04-10

This file is the source of truth for feature progress. Before changing a feature, check this file. After changing a feature, update the relevant row with implementation status, verification, responsive coverage, and security/data validation notes.

## Status Legend

- Done: implemented and verified for the current scope.
- Partial: UI or scaffold exists, but production behavior, persistence, auth, security, tests, or integration is incomplete.
- Missing: not implemented yet.
- Blocked: cannot finish without an external decision, credential, or service.

## Architecture Snapshot

- Storefront: root Vite React app in `src/`. It has customer-facing pages and cart state, but most data still comes from local mock data.
- Admin: separate deployable Vite scaffold exists in `admin/`.
- Backend: Express/Mongoose scaffold exists in `server/`.
- Database: MongoDB/Mongoose models and connection scaffold exist, but no live MongoDB connection has been verified yet.
- Secrets: `.env` is ignored and has been removed from git tracking. Rotate any real credentials if they were ever pushed.

## Feature Checklist

| Area | Feature | Current status | Data/security checks | Verification |
| --- | --- | --- | --- | --- |
| Customer UI | Homepage hero | Partial | Static content and remote images only | Storefront build passed; mobile/desktop screenshots captured |
| Customer UI | Deals/new products carousel | Partial | Implemented as grid from mock product deals, not a true carousel/API feed | Storefront build passed; mobile/desktop screenshots captured |
| Customer UI | Recommended/trending mangoes | Partial | Uses static `trending` flags, not order-derived analytics | Storefront build passed |
| Customer UI | Product listing | Partial | Local mock products only | Storefront build passed |
| Customer UI | Product detail with image slider and weight selection | Partial | Local product lookup; selected weight validated when adding to cart | Storefront build passed |
| Customer UI | Search with real-time filtering | Partial | Client-side filtering only; no backend search API integration | Storefront build passed |
| Customer UI | Cart add/update/remove | Partial | Quantity is clamped to 1-99 client-side; no server-side stock check yet | Storefront tests passed |
| Customer UI | Checkout form | Partial | Client-side validation added for name, address, phone, and payment details | Storefront tests passed |
| Payments | COD | Partial | Backend dummy verification scaffold accepts COD | Backend tests passed |
| Payments | Easypaisa/JazzCash | Partial | Backend dummy verification requires wallet phone and transaction id | Backend tests passed |
| Payments | Card test payment | Partial | Test card `4242 4242 4242 4242`, CVC `123`, and future expiry validation added | Storefront and backend tests passed |
| Orders | Place order | Partial | Frontend still clears local cart; backend API calculates totals server-side when integrated | Backend tests passed for payment utility; DB flow not yet integration-tested |
| Orders | Customer order tracking statuses | Partial | Backend status enum scaffolded; current client still shows mock orders | Storefront build passed |
| Admin | Separate deployable admin app | Partial | `admin/` app scaffold added; root customer `/admin` route removed | Admin build passed; mobile/desktop screenshots captured |
| Admin | Dashboard metrics/charts | Partial | Admin scaffold fetches protected backend data after admin login | Admin build passed |
| Admin | Product management | Partial | Backend protected product CRUD exists; admin UI currently lists products | Admin build passed |
| Admin | Order management/status updates | Partial | Backend admin-only status update exists; admin UI status select wired to API | Admin build passed |
| Admin | User management | Partial | Backend admin-only user listing exists; admin UI table wired to API | Admin build passed |
| Auth | JWT signup/login | Partial | Backend signup/login hashes passwords and signs JWTs | Backend route scaffold added; DB auth flow not yet integration-tested |
| Auth | Role-based admin/user access | Partial | Backend `protect` and `restrictTo` middleware added; customer app no longer routes to admin | Backend scaffold verified by static build/tests only |
| Images | Cloudinary product image upload | Partial | Backend admin-only upload route allows 2-5 JPEG/PNG/WEBP files, 5 MB each | Not verified without Cloudinary credentials |
| API | RESTful operations | Partial | Product, order, payment, upload, user, auth, and health routes scaffolded | Backend health/auth/payment tests passed; DB integration pending |
| Security | Express hardening | Partial | Helmet, CORS allowlist, rate limiting, HPP, mongo sanitize, JSON body limit added | npm audit clean for root, admin, and server |
| Security | Input validation | Partial | Zod validation added to backend auth/product/order/payment/status routes; client checkout validation added | Storefront and backend tests passed |
| Security | Secrets/env handling | Done | `.env` ignored and untracked; `.env.example` files added for admin/server | `git rm --cached .env` completed |
| UX | Loading/error states | Partial | Existing checkout loading/toasts; admin loading/error states added | Builds passed |
| UX | Responsive design | Partial | Storefront/admin rendered at 390x844 and 1440x1000 via Playwright screenshots | Screenshots saved in `/tmp/mango-*.png` |
| Deployment | Storefront on Vercel | Partial | Root app builds with Vite 8 | `npm run build` passed |
| Deployment | Admin separate deployment | Partial | `admin/` builds independently with Vite 8 | `npm --prefix admin run build` passed |
| Deployment | Backend on Render | Partial | `server/` has start script and env example | `npm --prefix server run test` passed; live DB start pending |

## Update Log

- 2026-04-10: Audited the existing app. Found a polished mock storefront but no MERN backend, no real auth, no database persistence, no Cloudinary integration, no payment verification, and no separate admin deployment.
- 2026-04-10: Added this progress tracker so future work records feature status, validation, responsive checks, security checks, and tests.
- 2026-04-10: Added stricter storefront checkout validation and cart quantity/weight guards.
- 2026-04-10: Removed the customer app `/admin` route and admin nav entry so admin can be deployed separately.
- 2026-04-10: Added `server/` Express/Mongoose scaffold with JWT auth, role middleware, REST routes, Zod validation, dummy payment verification, Cloudinary upload route, and security middleware.
- 2026-04-10: Added `admin/` Vite app scaffold with admin login, dashboard metrics, product/order/user tables, and order status updates wired to the backend API.
- 2026-04-10: Updated dependencies to remove audit findings. Root, admin, and server `npm audit` all report 0 vulnerabilities.
- 2026-04-10: Verified root tests, root build, root lint, server tests, admin build, and Playwright mobile/desktop screenshots. Root lint still has 8 Fast Refresh warnings in existing shared shadcn/context exports, but 0 lint errors.
- 2026-04-10: Added backend smoke tests for `/api/health` and protected payment verification; backend test suite now has 6 passing tests.
- 2026-04-10: Removed all Lovable integration (lovable-tagger + metadata), removed `public/favicon.ico`, and standardized the root app on Vite 8 + `@vitejs/plugin-react`. Verified: `npm run lint` (0 errors), `npm run test` (6 tests passing), `npm run build` (passes), `npm run build:admin` (passes), `npm run test:server` (6 tests passing), and `npm audit` (0 vulnerabilities) for root/admin/server.
