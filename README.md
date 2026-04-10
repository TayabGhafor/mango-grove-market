# Mango Grove Market

Full-stack MERN ecommerce scaffold for selling mangoes online.

## Project Structure

- `src/`: customer storefront Vite React app.
- `admin/`: separate Vite React admin panel for independent deployment.
- `server/`: Express/Mongoose API scaffold for products, orders, users, auth, payments, and uploads.
- `docs/PROGRESS.md`: living feature checklist and implementation audit.

## Local Commands

```bash
npm run dev
npm run build
npm run test
npm run lint

npm run dev:admin
npm run build:admin

npm run dev:server
npm run test:server
```

Run admin/server commands from their folders if you prefer:

```bash
cd admin && npm run dev
cd server && npm run dev
```

## Environment

Copy the examples before running deployed or integrated environments:

```bash
cp admin/.env.example admin/.env
cp server/.env.example server/.env
```

The root `.env` is ignored and should stay out of git. If it was previously committed, rotate any real credentials before production.

## Current State

The storefront has a polished mock ecommerce flow and improved checkout validation. The backend and admin panel are production-oriented scaffolds with JWT role auth, Zod validation, security middleware, dummy payment verification, Cloudinary upload hooks, and separate deployment structure. The storefront still needs to be wired to the API for real persistence and order history.
