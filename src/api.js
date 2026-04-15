// =============================================================================
// api.js — ALL REST API CALLS IN ONE PLACE
// =============================================================================
// This file contains every function that communicates with the JSON Server
// backend. Each function uses the browser's built-in fetch() API.
//
// REST API BASICS:
//   REST (Representational State Transfer) uses standard HTTP methods:
//     GET    → Read data        (fetch all recipes, fetch one recipe)
//     POST   → Create new data  (add a recipe, register a user)
//     PUT    → Update data      (edit a recipe — replaces the whole object)
//     DELETE → Remove data      (delete a recipe)
//
//   JSON Server automatically provides these endpoints based on db.json:
//     GET    /recipes       → returns an array of all recipes
//     GET    /recipes/1     → returns the recipe with id 1
//     POST   /recipes       → creates a new recipe (auto-generates id)
//     PUT    /recipes/1     → replaces recipe with id 1
//     DELETE /recipes/1     → deletes recipe with id 1
//     GET    /users?email=x → filters users where email equals x
//
// WHY A SEPARATE FILE?
//   Keeping API calls in one file makes them easy to find, reuse, and
//   change later (e.g. if you switch from JSON Server to a real backend).
// =============================================================================

// The base URL of our JSON Server. It runs on port 3001 (see package.json
// "server" script). The React dev server runs on port 5173, so they don't
// conflict.
const BASE_URL = 'http://localhost:3001';

// ---------------------------------------------------------------------------
// RECIPE ENDPOINTS
// ---------------------------------------------------------------------------

// GET /recipes — fetch the full list of recipes
export async function getRecipes() {
  const res = await fetch(`${BASE_URL}/recipes`);
  // res.json() parses the JSON response body into a JavaScript array/object
  return res.json();
}

// GET /recipes/:id — fetch a single recipe by its id
export async function getRecipe(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`);
  return res.json();
}

// POST /recipes — create a new recipe
// We must send: method, headers (to tell the server we're sending JSON),
// and body (the actual data, converted from a JS object to a JSON string).
export async function createRecipe(recipe) {
  const res = await fetch(`${BASE_URL}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  // The server responds with the newly created recipe (including its new id)
  return res.json();
}

// PUT /recipes/:id — update (replace) an existing recipe
export async function updateRecipe(id, recipe) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  return res.json();
}

// DELETE /recipes/:id — delete a recipe
// No response body needed, so we don't call res.json()
export async function deleteRecipe(id) {
  await fetch(`${BASE_URL}/recipes/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// USER / AUTHENTICATION ENDPOINTS
// ---------------------------------------------------------------------------

// "Login" — there's no real auth token here. We simply query JSON Server
// for a user whose email AND password match. If found, we treat them as
// logged in. This is a simplified approach suitable for a demo project.
export async function loginUser(email, password) {
  // JSON Server supports filtering with query parameters:
  // GET /users?email=x&password=y → returns an array of matching users
  const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
  const users = await res.json();
  // If the array has at least one match, return that user; otherwise null
  return users.length > 0 ? users[0] : null;
}

// Register — first checks if a user with the same email already exists.
// If not, creates a new user via POST.
export async function registerUser(user) {
  // Step 1: Check for existing email
  const existing = await fetch(`${BASE_URL}/users?email=${user.email}`);
  const found = await existing.json();
  if (found.length > 0) {
    // throw an Error so the calling component can catch it and display it
    throw new Error('A user with this email already exists.');
  }
  // Step 2: Create the new user
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
}
