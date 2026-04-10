# Mango Grove Market Progress Tracker

Last updated: 2026-04-10

This file is the source of truth for feature progress. Before changing a feature, check this file. After changing a feature, update the relevant row with implementation status, verification, responsive coverage, and security/data validation notes.

## Status Legend

- Done: implemented and verified for the current scope.
- Partial: UI or scaffold exists, but production behavior, persistence, auth, security, tests, or integration is incomplete.
- Missing: not implemented yet.
- Blocked: cannot finish without an external decision, credential, or service.

## Architecture Snapshot

- Storefront: root Vite React app in `src/`. It has customer-facing pages, cart state, Supabase auth, and Supabase-backed products/orders with mock fallback.
- Admin: separate deployable Vite app in `admin/`. It uses Supabase auth + RLS for admin-only product/order/user operations and realtime refresh.
- Backend: Express/Mongoose scaffold still exists in `server/` but is no longer required for core storefront/admin CRUD flows when using Supabase.
- Database: Supabase Postgres is the source of truth (products, profiles, orders, order items) with RLS policies and realtime subscriptions.
- Secrets: `.env` is ignored and has been removed from git tracking. Rotate any real credentials if they were ever pushed.

## Feature Checklist

| Area | Feature | Current status | Data/security checks | Verification |
| --- | --- | --- | --- | --- |
| Customer UI | Homepage hero | Partial | Static content and remote images only | Storefront build passed; mobile/desktop screenshots captured |
| Customer UI | Deals/new products carousel | Partial | Implemented as grid from mock product deals, not a true carousel/API feed | Storefront build passed; mobile/desktop screenshots captured |
| Customer UI | Recommended/trending mangoes | Partial | Uses static `trending` flags, not order-derived analytics | Storefront build passed |
| Customer UI | Product listing | Partial | Supabase `products` table is source of truth; falls back to mock data if Supabase is unavailable or empty | Storefront build/test passed |
| Customer UI | Product detail with image slider and weight selection | Partial | Supabase `products` table is source of truth; falls back to mock data for legacy ids | Storefront build/test passed |
| Customer UI | Search with real-time filtering | Partial | Supabase `ilike` search on products; falls back to client-side search on mock data | Storefront build/test passed |
| Customer UI | Cart add/update/remove | Partial | Quantity is clamped to 1-99 client-side; no server-side stock check yet | Storefront tests passed |
| Customer UI | Checkout form | Partial | Client-side validation + Supabase order creation; requires signed-in user before placing order; does not store card details | Storefront tests passed |
| Payments | COD | Partial | Backend dummy verification scaffold accepts COD | Backend tests passed |
| Payments | Easypaisa/JazzCash | Partial | Backend dummy verification requires wallet phone and transaction id | Backend tests passed |
| Payments | Card test payment | Partial | Test card `4242 4242 4242 4242`, CVC `123`, and future expiry validation added | Storefront and backend tests passed |
| Orders | Place order | Partial | Stores orders/order items in Supabase; cart clears only after successful insert; RLS enforces user ownership | Storefront build/test passed; Supabase required |
| Orders | Customer order tracking statuses | Partial | Orders page reads from Supabase and subscribes to realtime status updates | Storefront build/test passed; Supabase required |
| Admin | Separate deployable admin app | Partial | `admin/` app scaffold added; root customer `/admin` route removed | Admin build passed; mobile/desktop screenshots captured |
| Admin | Dashboard metrics/charts | Partial | Derived from Supabase orders/users/products; realtime refresh via Postgres change subscriptions | Admin build passed |
| Admin | Product management | Partial | Admin can create/edit/hide products in Supabase; storefront reflects changes via realtime invalidation | Admin build passed; Supabase required |
| Admin | Order management/status updates | Partial | Admin can update order status in Supabase; customer orders view updates in realtime | Admin build passed; Supabase required |
| Admin | User management | Partial | Admin can list `profiles` (name/email/role) via Supabase RLS | Admin build passed; Supabase required |
| Auth | Email/password signup/login (Supabase) | Partial | Supabase Auth + `profiles` table; profile upserted on signup and editable by user | Storefront build/test passed; Supabase required |
| Auth | Role-based admin/user access (Supabase RLS) | Partial | Admin operations gated by `profiles.role='admin'` and RLS policies; requires admin user role to be set | Storefront/admin build passed; Supabase required |
| Images | Cloudinary product image upload | Partial | Backend admin-only upload route allows 2-5 JPEG/PNG/WEBP files, 5 MB each | Not verified without Cloudinary credentials |
| API | RESTful operations | Partial | Product, order, payment, upload, user, auth, and health routes scaffolded | Backend health/auth/payment tests passed; DB integration pending |
| Security | Express hardening | Partial | Helmet, CORS allowlist, rate limiting, HPP, mongo sanitize, JSON body limit added | npm audit clean for root, admin, and server |
| Security | Input validation | Partial | Client checkout validation added; Supabase RLS policies restrict reads/writes by role and ownership | Storefront and admin builds passed |
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
- 2026-04-10: Added customer auth (login/signup), integrated storefront with backend products/orders APIs (with mock fallback), and required sign-in for placing orders/viewing order history. Added backend seeding for admin credentials `admin@mangogrove.com` / `admin@mangogrove` and sample products when `SEED_SAMPLE_DATA=true` in non-production. Verified: root lint (0 errors), root tests (6 passing), root build (passes), admin build (passes), server tests (6 passing).
- 2026-04-10: Extended admin product management to support create/edit/hide product flows (including weights/images/deal/trending flags) wired to backend protected CRUD endpoints. Verified: `npm run build:admin` (passes).
- 2026-04-10: Switched storefront + admin persistence to Supabase (products, profiles, orders) with RLS policies and realtime refresh. Added customer profile page, updated checkout to store orders in Supabase (no card details stored), and updated admin panel to manage products/orders/users via Supabase auth. Verified: `npm run lint` (0 errors; existing Fast Refresh warnings remain), `npm run test` (6 passing), `npm run build` (passes), `npm run build:admin` (passes), `npm run test:server` (6 passing).
- 2026-04-10: Fixed admin dev crash when Supabase env vars are missing by lazily initializing the Supabase client and surfacing a clear config error instead of a runtime exception. Verified: `npm run build:admin` (passes).
- 2026-04-10: Reduced product detail perceived load time by caching/prefetching product queries, reusing product data passed from listing cards, and narrowing Supabase selects. Verified: root lint/test/build passed.
- 2026-04-10: Made Supabase URL configuration more robust by allowing `VITE_SUPABASE_PROJECT_REF` to derive the URL when `VITE_SUPABASE_URL` is not set (storefront + admin). Verified: root lint/test/build and admin build passed.
- 2026-04-10: Configured local storefront/admin env to use the Supabase project URL and anon public key so Supabase auth works during local development. Verified: storefront and admin dev servers start without Supabase URL errors.
- 2026-04-10: Added a safe server-side Supabase admin seeding script to guarantee `admin@mangogrove.com` / `admin@mangogrove` exists and has `profiles.role=admin` (requires `SUPABASE_SERVICE_ROLE_KEY` in server env; never used in browser). Verified: build/lint/tests pass; seeding is blocked until the Supabase schema migration (profiles/products/orders) is applied in the Supabase project.
- 2026-04-10: Improved Supabase admin seeding error output to explicitly point to the required migration file when the `profiles` table is missing. Verified: seeder fails with a clear actionable message when schema is not applied.
