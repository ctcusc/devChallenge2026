# Feeding Brennen

A fullstack app for tracking restaurants, visits, and how much Brennen spends eating
out. This is a **take-home challenge starter** - the structure, database layer, and a
couple of read endpoints are wired up for you. The rest is yours to build.

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| App      | Next.js 14 (App Router), TypeScript, Tailwind     |
| API      | Next.js Route Handlers (`app/api/*`), TypeScript  |
| Database | PostgreSQL (`pg`)                                 |

One Next.js app serves both the UI and the REST API. There is no separate
backend server: the API lives in route handlers under `app/api/`.

## Layout

```
.
├── client/     # the Next.js app: UI + REST API (route handlers) + DB layer
└── SETUP.md    # Full setup & troubleshooting guide
```

Inside `client/`: the UI is in `app/` (pages) and the REST API is in
`app/api/` (route handlers); `db/` holds the connection pool, migrations, and
seed script; `lib/` has the frontend fetch client and a shared error helper.

## Quick start

See **[SETUP.md](./SETUP.md)** for the full walkthrough (prerequisites, database
creation, env files, migrations, seeds, troubleshooting).

The short version (Docker runs the database; one Next app serves the UI and API):

```bash
# database - required, one command, no Postgres install needed
docker compose up -d                                # Postgres on localhost:5432

# the app (UI + API)
cd client && npm install && cp .env.example .env    # default DATABASE_URL matches compose
npm run migrate && npm run seed                     # create tables + sample data
npm run dev                                          # http://localhost:3000 (API under /api)
```

## Your task

This repo intentionally stops short of a finished product. The structure,
database layer, and read endpoints work; the rest is yours.

**Read [CHALLENGE.md](./CHALLENGE.md)** for the full brief: what to build, the
time expectation, how to verify your work, and exactly how submissions are
evaluated.

**Scope:** fix the one planted bug (required - the app barely runs without it),
then pick **two** of the five build-out tasks below and do them well. You are
**not** expected to finish all of them - depth over breadth.

The five build-out tasks (pick two):

- Restaurants only support reads (`GET`). Create / update / delete are stubbed.
- Visits have a data model and seed data, but **no API at all** yet.
- There's no validation on the data going into the database.
- The error handler is a stub.
- The frontend list has no loading / empty / error states.

Everything above is marked with a `TODO` in the code. There's no test suite -
verify your endpoints yourself with `curl` or Postman against your running
database (see CHALLENGE.md for examples). Take your two tasks from "scaffold" to
"real, usable app," and leave notes on what you'd do next. Have fun.
