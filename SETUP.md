# Setup

Get Feeding Brennen running locally. It's a single Next.js app (UI + API) plus a
PostgreSQL database in Docker. Two commands, a few minutes.

## Prerequisites

| Tool                    | Version | Download | Notes |
|-------------------------|---------|----------|-------|
| Node.js                 | 18+     | [nodejs.org](https://nodejs.org/) | Required |
| Docker + Docker Compose | 20.10+  | [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Required - runs PostgreSQL.<br>Docker Desktop includes Compose. |

**Make sure Docker Desktop is open and running before you start.** The setup
script checks for both tools and tells you what's missing, so you don't have to
verify versions by hand.

## Run it

```bash
git clone <your-fork-url> feeding-brennen
cd feeding-brennen
./setup.sh
```

That script starts PostgreSQL in Docker, installs dependencies, creates the
tables, and loads sample data. It's safe to re-run at any point.

Then start the app:

```bash
cd client
npm run dev
```

The app comes up on **http://localhost:3000** - that serves both the UI and the
REST API (under `/api`). Sanity check it:

```bash
curl http://localhost:3000/api/health
# {"status":"ok"}
```

The home page lists the seeded restaurants once the planted bug is fixed (see
[CHALLENGE.md](./CHALLENGE.md)). Until then, `/api/restaurants` returns a 500 -
that's expected, and it's your first task.

## Expected URLs

| What            | URL                               |
| --------------- | --------------------------------- |
| App (UI)        | http://localhost:3000             |
| API base        | http://localhost:3000/api         |
| Health check    | http://localhost:3000/api/health  |
| Restaurants     | http://localhost:3000/api/restaurants |

---

## What the setup script did

You don't need this to get started - it's here so nothing is a black box.

| Step | Command | Why |
| ---- | ------- | --- |
| Start the database | `docker compose up -d` | Runs PostgreSQL 16 on `localhost:5432`, pre-configured with the right user, password, and database name. |
| Install dependencies | `npm install` (in `client/`) | Standard. |
| Create tables | `npm run migrate` (in `client/`) | Applies `client/db/migrations/*.sql`. Prints `Applied 1 migration(s).` |
| Load sample data | `npm run seed` (in `client/`) | Loads 5 restaurants and 3 visits. Prints `Seeded 5 restaurants and 3 visits.` |

Run any of them individually whenever you need to - re-seed after you've made a
mess of the data, re-migrate after you add a migration.

Useful database commands:

```bash
docker compose down       # stop the DB (your data is kept)
docker compose down -v    # stop the DB and wipe all data (fresh start)
docker compose logs db    # tail database logs
docker compose ps         # check status - `db` should be "running (healthy)"
```

## Configuration (you probably don't need this)

There is **no `.env` to set up**. The app defaults to the database that
`docker compose` starts, so the standard setup needs no configuration at all.

If you do need to point somewhere else - a different port, or a Postgres you
manage yourself - create `client/.env` (see `client/.env.example`):

| Variable | Default | What it's for |
| -------- | ------- | ------------- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/feeding_brennen` | Used by the API route handlers and the migrate/seed scripts. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | The origin the frontend uses to call the app's own API. Change it only if you run on a different port. |

---

## Troubleshooting

### `Cannot connect to the Docker daemon` / "Docker is installed but not running"

Docker Desktop isn't running. Open it, wait for the whale icon to settle, then
re-run `./setup.sh`.

### `connection refused` / `ECONNREFUSED ... 5432`

The app can't reach PostgreSQL.

- Check the container: `docker compose ps` should show `db` as
  `running (healthy)`. If not, `docker compose up -d` and check
  `docker compose logs db`.
- If you set a custom `DATABASE_URL`, confirm its host and port match where
  Postgres is actually listening.

### Docker: port 5432 already allocated

Another Postgres (often a native install) already owns port 5432, so the
container can't bind it. Either stop the other one (e.g.
`brew services stop postgresql@16`), or remap the container: change the `ports`
line in `docker-compose.yml` to `"5433:5432"`, then create `client/.env` with a
`DATABASE_URL` using port `5433`.

### Port already in use (`EADDRINUSE` on 3000)

Something is already listening on 3000.

- Find and stop it: `lsof -i :3000`, then `kill <PID>`.
- Or run on another port: `npm run dev -- -p 3001`, and set
  `NEXT_PUBLIC_API_URL=http://localhost:3001` in `client/.env`.

### Starting over with a clean database

Wipe the container's data and rebuild from scratch:

```bash
docker compose down -v
./setup.sh
```

### `relation "restaurants" already exists`

The tables are already there. Migrations use `IF NOT EXISTS`, so this is safe to
ignore. To start genuinely fresh, see "starting over" above.

### Really can't run Docker?

As a last resort, install PostgreSQL natively, create a database with
`createdb feeding_brennen`, and point `DATABASE_URL` at it in `client/.env`.
Then run `npm install`, `npm run migrate`, and `npm run seed` in `client/`
yourself. This isn't the supported path - reviewers run the Docker setup - so
only do this if Docker truly isn't an option.
