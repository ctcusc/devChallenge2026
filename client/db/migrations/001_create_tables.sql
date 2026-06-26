-- Migration 001: create the core tables for Feeding Brennen.
--
-- Run with: npm run migrate

CREATE TABLE IF NOT EXISTS restaurants (
  id         SERIAL PRIMARY KEY,
  name       TEXT    NOT NULL,
  cuisine    TEXT,
  address    TEXT,
  rating     NUMERIC,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visits (
  id           SERIAL PRIMARY KEY,
  "restaurantId" INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  date         DATE    NOT NULL,
  "amountSpent" NUMERIC(10, 2),
  notes        TEXT,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visits_restaurant_id ON visits ("restaurantId");
