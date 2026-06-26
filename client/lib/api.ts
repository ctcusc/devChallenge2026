/**
 * Tiny API helpers and shared types for talking to the Feeding Brennen server.
 */

// The API now lives in this same Next app under /api (route handlers). We still
// read a base URL from the environment because Server Components fetch on the
// server, where relative URLs don't resolve - so we need an absolute origin.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string | null;
  address: string | null;
  rating: number | null;
  createdAt: string;
}

export interface Visit {
  id: number;
  restaurantId: number;
  date: string;
  amountSpent: number | null;
  notes: string | null;
  createdAt: string;
}

/**
 * Fetch every restaurant from the API.
 *
 * NOTE: this is intentionally a bare fetch with no error handling. Callers get
 * whatever the server returns. Hardening this (non-200 responses, network
 * failures) is part of the exercise.
 */
export async function getRestaurants(): Promise<Restaurant[]> {
  const res = await fetch(`${API_URL}/api/restaurants`, { cache: 'no-store' });
  return res.json();
}

/**
 * Fetch a single restaurant by id.
 */
export async function getRestaurant(id: number | string): Promise<Restaurant> {
  const res = await fetch(`${API_URL}/api/restaurants/${id}`, { cache: 'no-store' });
  return res.json();
}
