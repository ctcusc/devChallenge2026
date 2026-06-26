# Feeding Brennen - Take-Home Challenge

Welcome! This repo is a deliberately **unfinished** fullstack app for tracking
restaurants, visits, and spending. Your job is to take it from "scaffold" to
"real, usable app."

We care more about how you think than about how much you finish. A focused,
well-built subset beats a sprawling, half-working everything. If you run out of
time, leave notes on what you'd do next.

## Time expectation

Plan for roughly **3-4 hours**. Don't gold-plate. If you're past 4 hours, stop
and write up what's left.

## Before you start

Get it running by following **[SETUP.md](./SETUP.md)** (prerequisites, database,
env files, migrations, seeds). You should be able to load
http://localhost:3000 and see a list of restaurants once the bug below is fixed.

## What's already done

So you know where the floor is:

- A single Next.js app that serves both the UI and the REST API (route handlers)
- PostgreSQL connection pool, a migration, and a seed script
- `GET /api/restaurants` and `GET /api/restaurants/:id` (route handlers)
- A bare Next.js page that lists restaurants
- A shared error helper for the API (`lib/errors.ts`) - currently a stub
- A Postman collection (`postman/`) that encodes the API contract you build against

## How it's put together

It's **one Next.js app**. The UI lives in `app/` and the REST API lives in route
handlers under `app/api/` (e.g. `app/api/restaurants/route.ts`). Those handlers
talk to Postgres through the shared pool in `db/pool.ts`. There is no separate
backend server and no Server Actions - the frontend reaches data only by calling
the `/api` endpoints over HTTP, so building real REST endpoints is the whole job.

## What we want you to build

**You are not expected to do everything here.** Scope is deliberate:

1. **Fix the bug (required).** It's a small fix, and the app doesn't really run
   until it's done - think of it as part of getting set up.
2. **Then pick *two* of the five build-out tasks below (2-6)** and take them to
   real depth. Two well-built features beat five half-built ones.

Depth over breadth. If you finish your two early and want to do more, great -
but a focused, polished pair is exactly what we're looking for. Each item is
marked with a `TODO` in the code.

### Required first: Fix the bug

`GET /api/restaurants` does not behave correctly. Find out why and fix it. (Hint:
compare the query in the route handler to the migration.) Once fixed, `curl
http://localhost:3000/api/restaurants` should return `200` with a JSON array of
the seeded restaurants, and the frontend list at http://localhost:3000 should
load.

`client/app/api/restaurants/route.ts`, `client/db/migrations/001_create_tables.sql`

---

### Then pick two of the following five

### 2. Finish the Restaurant write API

The write handlers are stubbed and return `501`.

`client/app/api/restaurants/route.ts` (POST),
`client/app/api/restaurants/[id]/route.ts` (PUT, DELETE)

- **`POST /api/restaurants`** -> insert and return the created restaurant with `201`.
- **`PUT /api/restaurants/:id`** -> update and return the record, or `404`.
- **`DELETE /api/restaurants/:id`** -> delete and return `204`, or `404`. Decide what
  happens to that restaurant's visits.

### 3. Add validation

Nothing validates input today. Most visibly: `rating` accepts **any** number,
including `6`.

`client/app/api/restaurants/` (and your visit handlers)

- Reject out-of-range ratings (decide the range, e.g. `0-5`) with a `400`.
- Validate required fields and types for restaurants and visits.

### 4. Build the Visit API from scratch

`Visit` has a table and seed data, but **no API at all**. There are no route
handlers for it yet.

create `client/app/api/visits/route.ts` (and/or
`client/app/api/restaurants/[id]/visits/route.ts`)

- Support listing, reading, creating, updating, and deleting visits.
- Decide on the shape: nested under a restaurant
  (`GET /api/restaurants/:id/visits`), a top-level `/api/visits` resource, or both.
- A visit for a restaurant that doesn't exist should be rejected (not 500).

### 5. Harden the error handling

The shared error helper is a stub that always returns `500`.

`client/lib/errors.ts`

- Map known error types to appropriate status codes (`400`, `404`, `409`, ...).
- Call it consistently from your route handlers' `catch` blocks.
- Don't leak internal error details in responses.

### 6. Make the frontend real

The list is a bare server-side fetch with no states.

`client/app/page.tsx`, `client/lib/api.ts`

- Add **loading**, **empty**, and **error** states.
- Handle non-`200` responses and network failures in the API helpers.
- Anything that makes it feel finished: a restaurant detail view, showing a
  restaurant's visits, forms to add data, totals/spend summaries, etc.

## API contract

This is a REST API exercise. Your endpoints are Next.js route handlers under
`app/api/`. They must speak HTTP and return JSON, and both the frontend and our
review talk to them only over HTTP at `http://localhost:3000/api` - there is no
shortcut around building real endpoints (no Server Actions, no direct DB calls
from the page).

### Restaurants (fixed contract)

| Method and path | Success | Errors |
| --------------- | ------- | ------ |
| `GET /api/restaurants` | `200` + JSON array | - |
| `GET /api/restaurants/:id` | `200` + restaurant | `404` if missing |
| `POST /api/restaurants` | `201` + created restaurant (with `id`) | `400` on invalid body (missing `name`, `rating` outside 0-5, ...) |
| `PUT /api/restaurants/:id` | `200` + updated restaurant | `404` if missing, `400` on invalid body |
| `DELETE /api/restaurants/:id` | `204`, no body | `404` if missing |

Restaurant shape:

```json
{
  "id": 1,
  "name": "The Rusty Spoon",
  "cuisine": "American",
  "address": "12 Main St",
  "rating": 4.5,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### Visits (you design the shape)

Visits must be a real REST resource too, but the routing is your call: nested
under a restaurant (`GET /api/restaurants/:id/visits`), a top-level
`/api/visits`, or both. Whatever you choose, support list / read / create /
update / delete with sensible status codes, and make creating a visit for a
restaurant that does not exist fail with a `4xx` (not a `500`). Document your
routes in your PR.

## Verifying your work

There's no unit-test suite - verify your endpoints yourself against your running
database. A Postman collection that encodes the contract above lives at
`postman/feeding-brennen.postman_collection.json`. Import it into
[Postman](https://www.postman.com/) / [Insomnia](https://insomnia.rest/), or run
it headless:

```bash
npx newman run postman/feeding-brennen.postman_collection.json
```

The Restaurants requests assert the exact status codes, so a green run means you
match the contract. The Visits requests are templates - point them at the routes
you designed. Make sure Postgres is up (`docker compose up -d`), you've run
`npm run migrate` and `npm run seed`, and the app is running (`npm run dev`).

You can also spot-check with `curl`. A few things your finished endpoints should
do (for whichever tasks you pick):

```bash
# Reads (work today once the bug is fixed)
curl http://localhost:3000/api/restaurants          # 200 + JSON array
curl http://localhost:3000/api/restaurants/1        # 200 + one restaurant
curl -i http://localhost:3000/api/restaurants/99999 # 404

# Create - should return 201 with the created row
curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Valid Spot","cuisine":"Test","address":"2 Test St","rating":4.5}'

# Validation - an out-of-range rating should be rejected with 400, not stored
curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Out Of Range","rating":6}'
```

Walk through the equivalent cases for any resource you build (e.g. creating a
visit for a restaurant that doesn't exist should fail cleanly, not 500). Showing
your verification - a Postman collection, a `curl` script, or notes in your PR -
is a great way to demonstrate you checked the edge cases.

## How we evaluate

We grade the **two tasks you chose** (plus the required bug fix) on how well
they're built - not on how many of the six you touched. A focused, polished pair
is a strong submission. For each task you take on, we look at:

| What we look for | Means |
| ---------------- | ----- |
| **Correctness** | It actually works, including edge cases and the right status codes |
| **Design** | Sensible routes, request/response shapes, or UI structure - choices a reviewer would make too |
| **Validation & errors** | Bad input is rejected with useful 4xx responses; failures are handled, not leaked |
| **Code quality** | Readable, consistent, well-organized; no obvious footguns |
| **Edge cases** | You handled the unhappy paths - bad input, missing records, duplicates - and can show how you verified them |

We'd rather see two features that nail all of the above than five that gesture
at each. Tell us in your write-up which two you chose and why.

Bonus (not required, only if your two are already solid): thoughtful spend/visit
summaries, pagination or filtering, optimistic UI, accessibility, CI.

### What we're **not** grading on

- Pixel-perfect design or a component library - clean and clear is plenty.
- Auth, deployment, or multi-user concerns. Out of scope.
- Finishing every single item. Depth over breadth.

## Submitting

1. Work on a branch and open a pull request against your fork (or push to a repo
   you share with us - whatever was arranged).
2. In the PR description, include a short **README of your changes**:
   - **Which two tasks you chose**, and why.
   - What you built and any decisions/tradeoffs you made.
   - What you'd do next with more time.
   - Anything you want us to look at first.

Good luck - and tell us if anything in the setup fights you. That's useful
feedback too.
