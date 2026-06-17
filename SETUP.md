# Setup

Get Feeding Brennen running locally. The whole thing should be up in a few
minutes.

## Prerequisites

| Tool       | Version |
| ---------- | ------- |
| Node.js    | 18+     |
| npm        | 9+      |
| PostgreSQL | 14+     |

Check what you have:

```bash
node --version    # v18 or newer
npm --version     # 9 or newer
psql --version    # 14 or newer
```

## 1. Clone

```bash
git clone <your-fork-url> feeding-brennen
cd feeding-brennen
```

## 2. Create the database

Make sure PostgreSQL is running, then create an empty database for the app:

```bash
createdb feeding_brennen
```

If `createdb` isn't available, do it from inside `psql`:

```bash
psql -U postgres -c "CREATE DATABASE feeding_brennen;"
```

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

- Make sure the database server is actually running:
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

### Migration errors

- **`relation "restaurants" already exists`** — the tables are already there.
  The migrations use `IF NOT EXISTS`, so this is usually safe to ignore. To start
  fresh, drop and recreate the database (`dropdb feeding_brennen && createdb
  feeding_brennen`) and re-run `npm run migrate`.
- **`DATABASE_URL is not set`** — you haven't created `server/.env` (or it's
  missing the variable). Revisit step 3.
- **Anything hanging** — double-check Postgres is running and reachable (see
  "connection refused" above).
