# Feeding Brennen

A fullstack app for tracking restaurants, visits, and how much Brennen spends eating
out. This is a **take-home challenge starter** - the structure, database layer, and a
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

The short version (Docker runs the database; npm runs the apps):

```bash
# database - required, one command, no Postgres install needed
docker compose up -d                                # Postgres on localhost:5432

# server
cd server && npm install && cp .env.example .env   # default DATABASE_URL matches compose
npm run migrate && npm run seed && npm run dev      # http://localhost:3001

# client (in a second terminal)
cd client && npm install && cp .env.example .env
npm run dev                                         # http://localhost:3000
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
