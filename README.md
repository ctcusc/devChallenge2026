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

Make sure **Docker Desktop is running**, then:

```bash
./setup.sh                  # database, dependencies, tables, sample data
cd client && npm run dev    # http://localhost:3000 (UI + API under /api)
```

That's it - there's no `.env` to configure. See **[SETUP.md](./SETUP.md)** for
prerequisites, what the script does, and troubleshooting.

## Your task

This repo intentionally stops short of a finished product. The structure,
database layer, and read endpoints work; the rest is yours.

**Read [CHALLENGE.md](./CHALLENGE.md)** for the full brief: what to build, the
time expectation, how to verify your work, and exactly how submissions are
evaluated.

The challenge is in two halves, roughly 90 minutes each:

- **Part A (prescribed) - three tasks.** Fix the one planted bug, finish the
  Restaurant write API (`POST`, `PUT`, `DELETE`) against a fixed contract, then
  validate the input and handle errors properly. Everyone builds this, so we can
  compare submissions fairly.
- **Part B (wide open).** Ship one thing that makes the app better. You decide
  the feature, the routes, the data shape, the UI. There's no list to pick from
  and no answer key - build the thing you find interesting.

There's no test suite - verify your endpoints yourself against your running
database (see CHALLENGE.md). Go small, finish what you start, and write up why
you built what you built. Have fun.
