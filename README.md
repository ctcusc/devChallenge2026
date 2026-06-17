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

This repo intentionally stops short of a finished product. Things that are **not**
done yet are marked with `TODO` comments throughout the code. At a high level:

- Restaurants only support reads (`GET`). Create / update / delete are stubbed.
- Visits have a data model and seed data, but **no API at all** yet.
- The frontend lists restaurants with no loading, empty, or error states.
- There is no validation on the data going into the database.

There may also be a bug or two. Part of the exercise is finding them.

Build what you think makes this a real, usable app. Have fun.
