# Recipe Book — Project Documentation

A beginner-friendly, thorough guide to every part of this React application.

---

## Table of Contents

1. [What Does This App Do?](#1-what-does-this-app-do)
2. [Tech Stack — What Tools Are Used and Why](#2-tech-stack--what-tools-are-used-and-why)
3. [Project Structure — Where Everything Lives](#3-project-structure--where-everything-lives)
4. [How to Run the Project](#4-how-to-run-the-project)
5. [The Big Picture — How the App Starts](#5-the-big-picture--how-the-app-starts)
6. [Routing — How Page Navigation Works](#6-routing--how-page-navigation-works)
7. [Authentication — Login, Register, and Staying Logged In](#7-authentication--login-register-and-staying-logged-in)
8. [REST API — How the App Talks to the Database](#8-rest-api--how-the-app-talks-to-the-database)
9. [React Hooks Used in This Project](#9-react-hooks-used-in-this-project)
10. [Component-by-Component Breakdown](#10-component-by-component-breakdown)
11. [Data Flow — What Happens When...](#11-data-flow--what-happens-when)
12. [Key React Concepts Demonstrated](#12-key-react-concepts-demonstrated)

---

## 1. What Does This App Do?

Recipe Book is a web application where users can:

- **Register** a new account and **log in**
- **Browse** a collection of recipes on the home page
- **View** the full details of any recipe (ingredients, instructions, image)
- **Add** new recipes through a form
- **Edit** their own recipes
- **Delete** their own recipes

All data is stored in a local JSON file (`db.json`) and accessed through a REST API provided by JSON Server.

---

## 2. Tech Stack — What Tools Are Used and Why

| Tool | What It Is | Why We Use It |
|------|-----------|---------------|
| **React** | A JavaScript library for building user interfaces | The core of the project — lets us build the UI as reusable components |
| **Vite** | A fast build tool and development server | Bundles our code, provides hot reload during development (instant updates when you save a file) |
| **React Router DOM** | A routing library for React | Enables navigation between pages (Home, Login, Recipe Detail, etc.) without full page reloads |
| **Bootstrap** | A CSS framework | Provides ready-made, responsive styling (buttons, cards, forms, grid, navbar) so we don't write CSS from scratch |
| **JSON Server** | A fake REST API backed by a JSON file | Acts as our backend/database — we can do GET, POST, PUT, DELETE requests against it |

### What's in package.json?

```
"dependencies" — packages needed to RUN the app:
  react            — the React library itself
  react-dom        — connects React to the browser's DOM
  react-router-dom — routing (page navigation)
  bootstrap        — CSS + JS framework for styling

"devDependencies" — packages needed only during DEVELOPMENT:
  vite                — the build tool / dev server
  @vitejs/plugin-react — makes Vite understand JSX syntax
  json-server         — the fake REST API server

"scripts" — shortcuts you can run with "npm run <name>":
  dev     — starts the Vite development server (React app on port 5173)
  build   — creates an optimized production build in /dist
  preview — serves the production build locally for testing
  server  — starts JSON Server on port 3001 (the API)
```

---

## 3. Project Structure — Where Everything Lives

```
react-uni-project/
│
├── index.html                 ← The single HTML page (React mounts into <div id="root">)
├── vite.config.js             ← Vite configuration (plugins, dev server port)
├── package.json               ← Dependencies, scripts, project metadata
├── db.json                    ← The "database" — JSON Server reads/writes this file
├── sample-recipes.txt         ← Ready-to-paste recipe data for testing
│
└── src/                       ← ALL React source code lives here
    ├── main.jsx               ← Entry point — mounts the React app into the DOM
    ├── App.jsx                ← Root component — defines all routes
    ├── api.js                 ← All REST API functions (fetch calls)
    ├── index.css              ← Custom CSS (supplements Bootstrap)
    │
    ├── contexts/
    │   └── AuthContext.jsx    ← Authentication state (React Context + custom hook)
    │
    ├── components/
    │   ├── Navbar.jsx         ← Navigation bar (shown only when logged in)
    │   └── ProtectedRoute.jsx ← Route guard component (kept for reference)
    │
    └── pages/
        ├── Home.jsx           ← Main page — displays recipe cards
        ├── Login.jsx          ← Login form
        ├── Register.jsx       ← Registration form
        ├── RecipeDetail.jsx   ← Full recipe view (with edit/delete for owner)
        └── RecipeForm.jsx     ← Add/Edit recipe form (shared component)
```

### Why this structure?

- **`contexts/`** — Global state that multiple components need (authentication)
- **`components/`** — Reusable UI pieces that are NOT full pages (Navbar)
- **`pages/`** — Full-page components, each one mapped to a route

---

## 4. How to Run the Project

You need **two terminal windows** because the app has two servers:

### Terminal 1 — Start the API server (JSON Server)
```
npm run server
```
This starts JSON Server on **http://localhost:3001**. It serves data from `db.json`.

### Terminal 2 — Start the React development server (Vite)
```
npm run dev
```
This starts the React app on **http://localhost:5173**. Open this URL in your browser.

### Demo Account
- **Email:** demo@example.com
- **Password:** 123456

---

## 5. The Big Picture — How the App Starts

Here's the full chain of execution from when you open the browser:

```
1. Browser loads index.html
       ↓
2. index.html contains <div id="root"> and loads src/main.jsx
       ↓
3. main.jsx runs:
   a. Imports Bootstrap CSS and JS (styling + interactive components)
   b. Imports our custom CSS
   c. Creates the component tree:
        <React.StrictMode>
          <BrowserRouter>        ← enables routing
            <AuthProvider>       ← provides auth state to all components
              <App />            ← the root component
            </AuthProvider>
          </BrowserRouter>
        </React.StrictMode>
   d. Mounts this tree into <div id="root">
       ↓
4. App.jsx renders:
   - Calls useAuth() to check if a user is logged in
   - If NOT logged in → shows Login/Register routes (no Navbar)
   - If logged in → shows Navbar + all recipe routes
       ↓
5. React Router checks the current URL and renders the matching page component
```

---

## 6. Routing — How Page Navigation Works

### What is Routing?

In a traditional website, clicking a link causes the browser to request a new HTML page from the server. In a React **Single Page Application (SPA)**, routing is handled client-side — the browser never reloads. Instead, React Router swaps out which component is displayed based on the URL.

### How It's Set Up

1. **`<BrowserRouter>`** in `main.jsx` enables the routing system
2. **`<Routes>`** in `App.jsx` defines which component maps to which URL
3. **`<Route>`** maps a URL path to a component
4. **`<Link>`** replaces `<a>` tags — changes the URL without reloading
5. **`useNavigate()`** lets you change routes programmatically (e.g. after form submit)
6. **`useParams()`** extracts dynamic segments from the URL

### Route Table

| URL Pattern | Component | Description |
|------------|-----------|-------------|
| `/login` | `<Login />` | Login form (guest only) |
| `/register` | `<Register />` | Registration form (guest only) |
| `/` | `<Home />` | Recipe listing (authenticated) |
| `/recipes/:id` | `<RecipeDetail />` | View a single recipe |
| `/recipes/new` | `<RecipeForm />` | Add a new recipe |
| `/recipes/:id/edit` | `<RecipeForm />` | Edit an existing recipe |
| `*` (anything else) | Redirect | → `/login` (guest) or `/` (authenticated) |

### Dynamic Routes

`:id` is a **URL parameter** — a variable part of the URL. For example:
- `/recipes/3` → `useParams()` returns `{ id: "3" }`
- `/recipes/7/edit` → `useParams()` returns `{ id: "7" }`

---

## 7. Authentication — Login, Register, and Staying Logged In

### The Flow

```
                     ┌─────────────────────────────┐
                     │   User opens the app         │
                     └──────────────┬──────────────┘
                                    ↓
                     ┌─────────────────────────────┐
                     │  AuthProvider checks          │
                     │  localStorage for saved user  │
                     └──────────────┬──────────────┘
                                    ↓
                        ┌───────────┴───────────┐
                        ↓                       ↓
                   User found              No user found
                   in storage              in storage
                        ↓                       ↓
                   Show Navbar +          Show Login page
                   Home page              (guest routes only)
                                                ↓
                                    User fills in Login form
                                    and clicks "Login"
                                                ↓
                                    loginUser() API call
                                    GET /users?email=x&password=y
                                                ↓
                                  ┌─────────────┴────────────┐
                                  ↓                          ↓
                            User found                 No match
                            in database                    ↓
                                  ↓                  Show error message
                            login(userData):
                            1. Save to localStorage
                            2. setUser(userData)
                            3. App re-renders → shows
                               authenticated routes
```

### Why localStorage?

React state is lost when the page reloads (it lives only in memory). `localStorage` is a browser API that stores data persistently — it survives page reloads and even closing the browser. We save the user object there so they don't have to log in every time they refresh.

### The Context Pattern

Without Context, every component that needs user data would require it passed down through props. Context solves this with 3 steps:

1. **Create** — `createContext(null)` in AuthContext.jsx
2. **Provide** — `<AuthContext.Provider value={...}>` wraps the entire app
3. **Consume** — any component calls `useAuth()` (which calls `useContext(AuthContext)`) to read the value

---

## 8. REST API — How the App Talks to the Database

### What is a REST API?

REST (Representational State Transfer) is a convention for how a client (our React app) and a server (JSON Server) communicate over HTTP. The client sends HTTP requests; the server responds with data (usually JSON).

### The Four Operations (CRUD)

| Operation | HTTP Method | Example | What It Does |
|-----------|------------|---------|--------------|
| **C**reate | POST | `POST /recipes` with body `{ title: "..." }` | Adds a new recipe |
| **R**ead | GET | `GET /recipes` or `GET /recipes/3` | Fetches recipes |
| **U**pdate | PUT | `PUT /recipes/3` with body `{ title: "..." }` | Replaces recipe #3 |
| **D**elete | DELETE | `DELETE /recipes/3` | Removes recipe #3 |

### How fetch() Works

`fetch()` is a built-in browser function for making HTTP requests. Basic pattern:

```javascript
// 1. Call fetch with a URL (and optionally, options)
const response = await fetch('http://localhost:3001/recipes', {
  method: 'POST',                              // HTTP method
  headers: { 'Content-Type': 'application/json' }, // tell server: "I'm sending JSON"
  body: JSON.stringify({ title: 'My Recipe' }),    // convert JS object → JSON string
});

// 2. Parse the JSON response body into a JavaScript object
const data = await response.json();
```

### JSON Server — Our Fake Backend

JSON Server reads `db.json` and automatically creates REST endpoints:

```json
{
  "users": [ ... ],    →  GET/POST/PUT/DELETE  http://localhost:3001/users
  "recipes": [ ... ]   →  GET/POST/PUT/DELETE  http://localhost:3001/recipes
}
```

It also supports filtering with query parameters:
```
GET /users?email=demo@example.com&password=123456
→ returns users matching BOTH conditions
```

**Important:** JSON Server writes changes directly to db.json. Deleted data is gone permanently.

### All API Functions (in api.js)

| Function | HTTP Call | Used By |
|----------|----------|---------|
| `getRecipes()` | `GET /recipes` | Home.jsx (load all recipes) |
| `getRecipe(id)` | `GET /recipes/:id` | RecipeDetail.jsx, RecipeForm.jsx (load one recipe) |
| `createRecipe(recipe)` | `POST /recipes` | RecipeForm.jsx (add new recipe) |
| `updateRecipe(id, recipe)` | `PUT /recipes/:id` | RecipeForm.jsx (edit recipe) |
| `deleteRecipe(id)` | `DELETE /recipes/:id` | RecipeDetail.jsx (delete recipe) |
| `loginUser(email, password)` | `GET /users?email=...&password=...` | Login.jsx |
| `registerUser(user)` | `GET /users?email=...` then `POST /users` | Register.jsx |

---

## 9. React Hooks Used in This Project

Hooks are special functions that let you "hook into" React features from function components. Every hook name starts with `use`.

### useState — Managing Local State

```javascript
const [value, setValue] = useState(initialValue);
```

- `value` — the current state value
- `setValue` — a function to update it (triggers a re-render)
- `initialValue` — what the state starts as

**Used for:** form fields (email, password, title...), loading flags, error messages, recipe data.

**Example from Login.jsx:**
```javascript
const [email, setEmail] = useState('');
// email starts as '' (empty string)
// When user types, onChange calls setEmail(e.target.value)
// React re-renders the component with the new email value
```

### useEffect — Running Side Effects

```javascript
useEffect(() => {
  // This code runs AFTER the component renders
}, [dependencies]);
```

- The function runs after render
- The dependency array controls WHEN it re-runs:
  - `[]` (empty) → run once, when the component first mounts
  - `[id]` → run again whenever `id` changes
  - No array → run after every single render (rarely wanted)

**Used for:** fetching data from the API after a component appears.

**Example from Home.jsx:**
```javascript
useEffect(() => {
  getRecipes().then(setRecipes);
}, []);
// Runs ONCE when Home first appears → fetches all recipes → stores in state
```

### useContext — Reading Global State

```javascript
const value = useContext(SomeContext);
```

Reads the current value from the nearest `<SomeContext.Provider>` above in the tree.

**Used for:** reading authentication state (user, login, logout) from AuthContext.

**Wrapped in our custom hook:**
```javascript
// Instead of writing useContext(AuthContext) everywhere, we use:
const { user, login, logout } = useAuth();
```

### useNavigate — Programmatic Navigation

```javascript
const navigate = useNavigate();
navigate('/');        // go to home page
navigate(-1);        // go back one page (like browser's back button)
```

**Used for:** redirecting after login, logout, form submission, or recipe deletion.

### useParams — Reading URL Parameters

```javascript
const { id } = useParams();
```

Extracts dynamic segments from the current URL. For `/recipes/3`, it returns `{ id: "3" }`.

**Used in:** RecipeDetail.jsx and RecipeForm.jsx to know which recipe to load.

---

## 10. Component-by-Component Breakdown

### main.jsx (Entry Point)

**Purpose:** Mounts the entire React app into the DOM.

**What it does:**
1. Imports Bootstrap CSS (styling) and JS (hamburger menu, etc.)
2. Wraps the app in `<BrowserRouter>` (routing) and `<AuthProvider>` (auth state)
3. Renders into `<div id="root">` from index.html

**Why the nesting order matters:**
```
<BrowserRouter>        ← must be outermost (routing hooks need it)
  <AuthProvider>       ← inside router (auth may need navigation)
    <App />            ← uses both routing and auth
  </AuthProvider>
</BrowserRouter>
```

---

### App.jsx (Root Component / Router)

**Purpose:** Decides what the user sees based on whether they're logged in.

**How it works:**
- Calls `useAuth()` to get the current user
- If `user` is `null`: renders only Login and Register routes (no Navbar)
- If `user` exists: renders Navbar + all authenticated routes
- Both branches have a catch-all `path="*"` that redirects unknown URLs

**Why two separate route trees?**
This completely prevents guests from accessing any authenticated page. Even if someone types `/recipes/new` in the URL bar, they'll be redirected to `/login`.

---

### AuthContext.jsx (Authentication State)

**Purpose:** Provides `{ user, login, logout }` to every component in the app.

**How it works:**
1. On first render, checks `localStorage` for a previously saved user
2. `login(userData)` — saves user to localStorage + state
3. `logout()` — clears localStorage + sets state to null
4. Exposes everything through `<AuthContext.Provider value={...}>`
5. Components access it via `useAuth()` custom hook

---

### Navbar.jsx (Navigation Bar)

**Purpose:** Top navigation bar with links and logout button.

**What it shows:**
- Brand name "Recipe Book" (links to home)
- "Home" link
- "Add Recipe" link
- Greeting "Hello, {name}"
- "Logout" button

**Responsive behavior:** On small screens, all links collapse behind a hamburger menu button (Bootstrap's responsive navbar). Bootstrap JS handles the toggle animation.

---

### Home.jsx (Recipe Listing)

**Purpose:** Displays all recipes as a grid of cards.

**Lifecycle:**
1. Component mounts → `useEffect` runs → calls `getRecipes()` API
2. While waiting: shows a loading spinner
3. When data arrives: renders a Bootstrap card grid (3 cards per row)
4. Each card shows: image, title, description, and a "View Recipe" button

**Key details:**
- `onError` on images: if an image URL is broken, shows a placeholder
- `recipes.map(...)` transforms the data array into JSX cards
- `key={recipe.id}` helps React efficiently update the list

---

### Login.jsx (Login Form)

**Purpose:** Email + password form that authenticates the user.

**Flow:**
1. User types email and password (controlled inputs)
2. Clicks "Login" → `handleSubmit` runs
3. `e.preventDefault()` stops the browser from reloading the page
4. Calls `loginUser(email, password)` API
5. If user found → calls `login(user)` from context → navigates to `/`
6. If not found → shows error message

---

### Register.jsx (Registration Form)

**Purpose:** Name + email + password form that creates a new user.

**Flow:**
1. User fills in name, email, password
2. Client-side validation: password must be at least 4 characters
3. Calls `registerUser(...)` API
4. API checks if email already exists (throws error if so)
5. If successful → auto-logs in the new user → navigates to `/`

---

### RecipeDetail.jsx (Single Recipe View)

**Purpose:** Shows full details of one recipe + edit/delete for the owner.

**How it works:**
1. Reads `id` from URL via `useParams()`
2. Fetches the recipe from API
3. Displays: image, title, description, ingredients list, instructions
4. Checks `isOwner` (logged-in user's id === recipe's userId)
5. If owner → shows Edit and Delete buttons

**Ingredients display:** stored as `"eggs, flour, milk"` → `.split(',')` turns it into `["eggs", " flour", " milk"]` → rendered as a `<ul>` list.

**Instructions display:** stored with `\n` between steps → `.split('\n')` → rendered as separate `<p>` tags.

---

### RecipeForm.jsx (Add / Edit Recipe)

**Purpose:** A single form component used for both creating and editing recipes.

**How it knows which mode:**
- URL `/recipes/new` → `useParams()` returns no `id` → CREATE mode
- URL `/recipes/3/edit` → `useParams()` returns `{ id: "3" }` → EDIT mode
- `const isEdit = Boolean(id)` converts this to a simple true/false

**Edit mode behavior:**
- `useEffect` fetches the existing recipe and fills all form fields
- Submit calls `updateRecipe()` instead of `createRecipe()`
- Heading says "Edit Recipe" instead of "Add New Recipe"

---

## 11. Data Flow — What Happens When...

### ...a user logs in

```
Login.jsx: user clicks "Login"
    ↓
handleSubmit() calls loginUser(email, password)       ← api.js
    ↓
fetch GET /users?email=demo@example.com&password=123456  ← JSON Server
    ↓
Server returns [{ id: 1, name: "Demo User", ... }]
    ↓
loginUser() returns the user object
    ↓
login(user) from AuthContext:
  → localStorage.setItem('user', JSON.stringify(user))
  → setUser(user)                                     ← triggers re-render
    ↓
App.jsx re-renders:
  → useAuth() now returns a user (not null)
  → renders Navbar + authenticated routes
    ↓
navigate('/') → React Router shows Home.jsx
    ↓
Home.jsx mounts → useEffect → getRecipes() → renders recipe cards
```

### ...a user adds a recipe

```
RecipeForm.jsx: user fills form and clicks "Add Recipe"
    ↓
handleSubmit() builds recipeData object from all form fields
    ↓
createRecipe(recipeData)                               ← api.js
    ↓
fetch POST /recipes with JSON body                     ← JSON Server
    ↓
Server adds recipe to db.json, assigns a new id, returns the object
    ↓
navigate(`/recipes/${created.id}`)
    ↓
RecipeDetail.jsx mounts → fetches and displays the new recipe
```

### ...a user deletes a recipe

```
RecipeDetail.jsx: user clicks "Delete"
    ↓
window.confirm("Are you sure?") → user clicks OK
    ↓
deleteRecipe(id)                                       ← api.js
    ↓
fetch DELETE /recipes/3                                ← JSON Server
    ↓
Server removes recipe from db.json (PERMANENT)
    ↓
navigate('/') → back to Home.jsx → fetches updated list (without the deleted recipe)
```

---

## 12. Key React Concepts Demonstrated

| Concept | Where It's Used | What It Means |
|---------|----------------|---------------|
| **Components** | Every `.jsx` file | Reusable, self-contained UI building blocks |
| **JSX** | Every `.jsx` file | HTML-like syntax inside JavaScript that React converts to real DOM elements |
| **Props** | `ProtectedRoute({ children })` | Data passed from a parent component to a child |
| **State (useState)** | Login, Register, Home, RecipeDetail, RecipeForm | Local data that, when changed, causes the component to re-render |
| **Effects (useEffect)** | Home, RecipeDetail, RecipeForm | Code that runs after render (API calls, side effects) |
| **Context (useContext)** | AuthContext → useAuth() | Global state shared across many components without prop drilling |
| **Custom Hooks** | `useAuth()` | A reusable function that encapsulates hook logic |
| **Conditional Rendering** | App.jsx (`if (!user)`), Navbar (`{user && ...}`) | Showing different UI based on conditions |
| **List Rendering** | Home.jsx (`recipes.map(...)`) | Turning an array of data into an array of JSX elements |
| **Controlled Inputs** | Login, Register, RecipeForm | Form inputs whose value is driven by React state |
| **Client-side Routing** | App.jsx, Links, useNavigate | Navigating between pages without reloading |
| **Dynamic Routes** | `/recipes/:id` | URL segments that act as variables |
| **Event Handling** | `onClick`, `onSubmit`, `onChange` | Responding to user interactions |
| **Async/Await** | handleSubmit functions, api.js | Handling asynchronous operations (API calls) cleanly |

---

## Quick Reference: Demo Account

| Field | Value |
|-------|-------|
| Email | demo@example.com |
| Password | 123456 |
