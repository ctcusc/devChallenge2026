# Feeding Brennen

A fullstack app for tracking restaurants, visits, and how much Brennen spends eating
out. This is a **take-home challenge starter** — the structure, database layer, and a
couple of read endpoints are wired up for you. The rest is yours to build.

## Stack

| Layer    | Tech                                          |
| -------- | --------------------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind |
| Backend  | Node.js + Express, TypeScript                 |
| Database | PostgreSQL (`pg`)                             |

## Layout

```
.
├── client/     # Next.js frontend
├── server/     # Express + PostgreSQL API
└── SETUP.md    # Full setup & troubleshooting guide
```

## Quick start

See **[SETUP.md](./SETUP.md)** for the full walkthrough (prerequisites, database
creation, env files, migrations, seeds, troubleshooting).

The short version:

```bash
# server
cd server && npm install && cp .env.example .env   # fill in DATABASE_URL
npm run migrate && npm run seed && npm run dev      # http://localhost:3001

# client (in a second terminal)
cd client && npm install && cp .env.example .env
npm run dev                                         # http://localhost:3000
```

## Your task

This repo intentionally stops short of a finished product. The structure,
database layer, and read endpoints work; the rest is yours. Everything below is
also marked with a `TODO` comment at the relevant spot in the code.

Build what you think makes this a real, usable app. You don't have to do all of
it — tackle what you can and leave notes on what you'd do next. Have fun.

### 1. Finish the Restaurant API

Only `GET /restaurants` and `GET /restaurants/:id` are implemented. The
write routes are stubbed and currently return `501 Not Implemented`.

📍 `server/src/routes/restaurants.ts`

- **`POST /restaurants`** — read the fields from `req.body`, insert a row, and
  return the created restaurant with `201 Created`.
- **`PUT /restaurants/:id`** — update the matching row and return the updated
  record, or `404` if it doesn't exist.
- **`DELETE /restaurants/:id`** — delete the matching row and return `204`, or
  `404` if it doesn't exist. Decide what should happen to that restaurant's
  visits.

### 2. Build the Visit API from scratch

`Visit` has a data model, a table, and seed data — but **no API at all**. There
is no route file for it yet.

📍 `server/src/routes/index.ts` (mount point) — create `server/src/routes/visits.ts`

- List, read, create, update, and delete visits.
- Consider nesting visits under a restaurant (e.g. `GET /restaurants/:id/visits`)
  and/or a top-level `/visits` resource — your call.
- Mount the new router in `routes/index.ts`.

### 3. Add validation

Nothing validates the data going into the database right now.

📍 `server/src/routes/restaurants.ts` (and your new visit routes)

- `rating` accepts **any** number — including `6`, `-3`, or `1000`. Decide what
  valid means (e.g. `0–5`) and enforce it, returning `400` on bad input.
- Validate required fields and types for both restaurants and visits.

### 4. Harden the error handler

The error handler is a stub that always returns a generic `500`.

📍 `server/src/middleware/errorHandler.ts`

- Map known error types to appropriate status codes (`400`, `404`, `409`, …).
- Avoid leaking internal error details in responses.

### 5. Flesh out the frontend

The restaurant list is a bare server-side fetch.

📍 `client/app/page.tsx` and `client/lib/api.ts`

- Add **loading**, **empty**, and **error** states.
- Handle non-`200` responses and network failures in the API helpers.
- Anything else that makes it feel like a real app: a restaurant detail view,
  showing visits, forms to add data, etc. (No forms exist yet.)

### 6. Find the bug(s) 🐛

There is at least one planted bug. `GET /restaurants` does not behave the way
you'd expect once you hit it — figure out why and fix it.

---

### TODO map

Quick index of every `TODO` in the code:

| Where | What |
| ----- | ---- |
| `server/src/routes/restaurants.ts` | `POST` / `PUT` / `DELETE` handlers + rating validation |
| `server/src/routes/index.ts` | Visits router is not implemented / not mounted |
| `server/src/middleware/errorHandler.ts` | Map error types to status codes; don't leak details |
| `client/app/page.tsx` | No loading / empty / error states |
| `client/lib/api.ts` | Bare fetch — no response/network error handling |
