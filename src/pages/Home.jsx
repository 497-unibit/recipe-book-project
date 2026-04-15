// =============================================================================
// Home.jsx — THE MAIN PAGE (displays all recipes as cards)
// =============================================================================
// This is the landing page after login. It fetches ALL recipes from the API
// and renders them in a responsive grid of Bootstrap cards.
//
// KEY CONCEPTS:
//   - useState: holds local state (the recipes array, and a loading flag)
//   - useEffect: runs a side effect (the API call) after the component mounts.
//     The empty dependency array [] means "run this once, when the component
//     first appears on screen."
//   - Conditional rendering: shows a spinner while loading, a message if
//     there are no recipes, or the recipe grid otherwise.
//   - .map(): transforms an array of recipe objects into an array of JSX
//     elements (one card per recipe). The "key" prop helps React track
//     which items changed when the list updates.
//   - <Link>: navigates to the detail page without a full page reload.
// =============================================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../api';

export default function Home() {
  // "recipes" holds the array of recipe objects from the API.
  // Initially it's an empty array.
  const [recipes, setRecipes] = useState([]);

  // "loading" controls whether to show a spinner. Starts as true.
  const [loading, setLoading] = useState(true);

  // useEffect with [] runs ONCE after the first render.
  // It calls the API, stores the result in state, and turns off loading.
  //
  // .then(setRecipes)  is shorthand for  .then(data => setRecipes(data))
  // .catch(console.error)  logs any network errors to the browser console
  // .finally(...)  runs regardless of success or failure
  useEffect(() => {
    getRecipes()
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ---------- LOADING STATE ----------
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ---------- MAIN RENDER ----------
  return (
    <>
      <div className="text-center mb-4">
        <h1>Discover Recipes</h1>
        <p className="text-muted">Browse our collection of delicious recipes</p>
      </div>

      {/* Conditional rendering: empty state vs. recipe grid */}
      {recipes.length === 0 ? (
        <p className="text-center text-muted">No recipes found. Be the first to add one!</p>
      ) : (
        // Bootstrap grid: "row" is the container, "col-md-4" means each card
        // takes 4 out of 12 columns on medium+ screens (= 3 cards per row)
        <div className="row">
          {recipes.map((recipe) => (
            // "key" must be a unique identifier — recipe.id is perfect
            <div key={recipe.id} className="col-md-4 mb-4">
              <div className="card recipe-card h-100 shadow-sm">
                <img
                  src={recipe.imageUrl}
                  className="card-img-top"
                  alt={recipe.title}
                  // onError: if the image URL is broken, replace with a placeholder
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x400?text=No+Image';
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {recipe.description}
                  </p>
                  {/* Template literal builds the URL: /recipes/1, /recipes/2, etc. */}
                  <Link to={`/recipes/${recipe.id}`} className="btn btn-outline-primary mt-auto">
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
