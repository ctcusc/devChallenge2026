# Setup

Get Feeding Brennen running locally. The whole thing should be up in a few
minutes.

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

Both the server and client ship with a `.env.example`. Copy each to `.env` and
fill in the values.

**Server:**

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set `DATABASE_URL` to point at the database you just
created. The format is:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

For a default local install that's usually something like:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/feeding_brennen
```

**Client:**

```bash
cd ../client
cp .env.example .env
```

The default `NEXT_PUBLIC_API_URL=http://localhost:3001` matches the server, so
you normally don't need to change it.

## 4. Install dependencies

The client and server are separate npm packages. Install each:

```bash
cd server && npm install
cd ../client && npm install
```

## 5. Run migrations

This creates the `restaurants` and `visits` tables:

```bash
cd server
npm run migrate
```

You should see `Applied 1 migration(s).`

## 6. Seed sample data

Loads 5 restaurants and 3 visits:

```bash
npm run seed
```

You should see `Seeded 5 restaurants and 3 visits.`

## 7. Start the server

```bash
# in server/
npm run dev
```

The API comes up on **http://localhost:3001**. Sanity check it:

```bash
curl http://localhost:3001/health
# {"status":"ok"}
```

## 8. Start the client

In a **second terminal**:

```bash
cd client
npm run dev
```

The frontend comes up on **http://localhost:3000** and lists the seeded
restaurants.

## Expected URLs

| Service        | URL                          |
| -------------- | ---------------------------- |
| Client (Next)  | http://localhost:3000        |
| Server (API)   | http://localhost:3001        |
| Health check   | http://localhost:3001/health |

---

## Troubleshooting

### `psql: command not found` (psql not in PATH)

PostgreSQL is installed but its CLI tools aren't on your `PATH`.

- **macOS (Homebrew):** add the bin directory to your shell profile, e.g.
  `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"` (adjust the version),
  then restart your terminal.
- **Postgres.app (macOS):** add
  `/Applications/Postgres.app/Contents/Versions/latest/bin` to your `PATH`.
- **Linux:** install the client package, e.g. `sudo apt install postgresql-client`.

### `connection refused` / `ECONNREFUSED ... 5432`

The server can't reach PostgreSQL.

- **Docker:** make sure the container is up and healthy - `docker compose ps`
  should show the `db` service as `running (healthy)`. If not, `docker compose up
  -d` and check `docker compose logs db`.
- **Native:** make sure the database server is actually running:
  - macOS (Homebrew): `brew services start postgresql@16`
  - Linux (systemd): `sudo systemctl start postgresql`
- Confirm the host and port in `DATABASE_URL` match where Postgres is listening
  (default `localhost:5432`).

### `database "feeding_brennen" does not exist`

You skipped (or mistyped) step 2. Create it:

```bash
createdb feeding_brennen
```

Make sure the database name at the end of `DATABASE_URL` matches exactly.

### `password authentication failed for user ...`

The user/password in `DATABASE_URL` doesn't match your Postgres setup. Update
the credentials, or create a matching role:

```bash
psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"
```

### Port already in use (`EADDRINUSE`)

Something is already listening on 3000 or 3001.

- Find and stop it: `lsof -i :3001` (or `:3000`), then `kill <PID>`.
- Or change the port: set `PORT` in `server/.env`, and `NEXT_PUBLIC_API_URL` in
  `client/.env` plus the `-p` flag in the client `dev` script if you move the
  client.

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
cd server && npm run migrate && npm run seed
```

### Migration errors

- **`relation "restaurants" already exists`** - the tables are already there.
  The migrations use `IF NOT EXISTS`, so this is usually safe to ignore. To start
  fresh, drop and recreate the database (`dropdb feeding_brennen && createdb
  feeding_brennen`) and re-run `npm run migrate`.
- **`DATABASE_URL is not set`** - you haven't created `server/.env` (or it's
  missing the variable). Revisit step 3.
- **Anything hanging** - double-check Postgres is running and reachable (see
  "connection refused" above).
