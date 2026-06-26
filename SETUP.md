# Setup

Get Feeding Brennen running locally. The whole thing should be up in a few
minutes. It's a single Next.js app (UI + API) plus a PostgreSQL database in
Docker.

## Prerequisites

| Tool                    | Version | Notes                                    |
| ----------------------- | ------- | ---------------------------------------- |
| Node.js                 | 18+     | Required                                 |
| npm                     | 9+      | Required                                 |
| Docker + Docker Compose | 20.10+  | Required - runs PostgreSQL for everyone  |

Check what you have:

```bash
node --version            # v18 or newer
npm --version             # 9 or newer
docker --version          # 20.10 or newer
docker compose version    # comes with modern Docker Desktop
```

We run PostgreSQL through Docker so everyone - and every reviewer - is on the
exact same database setup. Don't have Docker? Get it from
[docker.com/get-started](https://www.docker.com/get-started/) (Docker Desktop on
macOS/Windows includes Compose).

## 1. Clone

```bash
git clone <your-fork-url> feeding-brennen
cd feeding-brennen
```

## 2. Start the database

Everyone runs PostgreSQL the same way: through Docker Compose. It spins up the
database with the right user, password, and database name already configured, so
there's nothing to install or create by hand.

From the repo root:

```bash
docker compose up -d
```

That starts PostgreSQL in the background on `localhost:5432`, pre-configured to
match the default `DATABASE_URL`. Confirm it's healthy:

```bash
docker compose ps
# the `db` service should show "running (healthy)"
```

Useful commands later:

```bash
docker compose down       # stop the DB (your data is kept)
docker compose down -v    # stop the DB and wipe all data (fresh start)
docker compose logs db     # tail database logs
```

That's it - no need to create the database by hand; Compose already did.

> **Really can't run Docker?** As a last resort you can install PostgreSQL
> natively, create a database with `createdb feeding_brennen` (or
> `psql -U postgres -c "CREATE DATABASE feeding_brennen;"`), and point
> `DATABASE_URL` at it. This isn't the supported path - reviewers run the Docker
> setup - so only do this if Docker truly isn't an option for you.

## 3. Configure environment variables

The app reads its config from a `.env` file in `client/`. Copy the example:

```bash
cd client
cp .env.example .env
```

The defaults already match the Docker database and the app's own port, so you
normally don't need to change anything:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/feeding_brennen
NEXT_PUBLIC_API_URL=http://localhost:3000
```

`DATABASE_URL` is used by both the API route handlers and the migrate/seed
scripts. `NEXT_PUBLIC_API_URL` is the origin the frontend uses to call the app's
own API (it's the same app, on the same port).

## 4. Install dependencies

```bash
# in client/
npm install
```

## 5. Run migrations

This creates the `restaurants` and `visits` tables:

```bash
npm run migrate
```

You should see `Applied 1 migration(s).`

## 6. Seed sample data

Loads 5 restaurants and 3 visits:

```bash
npm run seed
```

You should see `Seeded 5 restaurants and 3 visits.`

## 7. Start the app

```bash
# in client/
npm run dev
```

The app comes up on **http://localhost:3000** - that serves both the UI and the
REST API (under `/api`). Sanity check the API:

```bash
curl http://localhost:3000/api/health
# {"status":"ok"}
```

The home page lists the seeded restaurants once the planted bug is fixed (see
CHALLENGE.md).

## Expected URLs

| What            | URL                               |
| --------------- | --------------------------------- |
| App (UI)        | http://localhost:3000             |
| API base        | http://localhost:3000/api         |
| Health check    | http://localhost:3000/api/health  |
| Restaurants     | http://localhost:3000/api/restaurants |

---

## Troubleshooting

### `connection refused` / `ECONNREFUSED ... 5432`

The app can't reach PostgreSQL.

- Make sure the container is up and healthy: `docker compose ps` should show the
  `db` service as `running (healthy)`. If not, `docker compose up -d` and check
  `docker compose logs db`.
- Confirm the host and port in `DATABASE_URL` match where Postgres is listening
  (default `localhost:5432`).

### `DATABASE_URL is not set`

You haven't created `client/.env` (or it's missing the variable). Revisit
step 3.

### Port already in use (`EADDRINUSE` on 3000)

Something is already listening on 3000.

- Find and stop it: `lsof -i :3000`, then `kill <PID>`.
- Or run the app on another port: `npm run dev -- -p 3001`, and update
  `NEXT_PUBLIC_API_URL` in `client/.env` to match.

### Docker: port 5432 already allocated

Another Postgres (often a native install) is already using port 5432, so the
container can't bind it. Either stop the other one (e.g. `brew services stop
postgresql@16`), or remap the container in `docker-compose.yml` - change the
`ports` line to `"5433:5432"` and update the port in `DATABASE_URL` to `5433`.

### Docker: starting over with a clean database

Wipe the container's data and bring it back up empty, then re-migrate and
re-seed:

```bash
docker compose down -v
docker compose up -d
cd client && npm run migrate && npm run seed
```

### Migration errors

- **`relation "restaurants" already exists`** - the tables are already there.
  The migrations use `IF NOT EXISTS`, so this is usually safe to ignore. To start
  fresh, wipe the Docker database (see "starting over" above).
- **`DATABASE_URL is not set`** - you haven't created `client/.env`. Revisit
  step 3.
- **Anything hanging** - double-check Postgres is running and reachable (see
  "connection refused" above).
