// =============================================================================
// RecipeDetail.jsx — SINGLE RECIPE VIEW (with Edit/Delete for the owner)
// =============================================================================
// When a user clicks "View Recipe" on a card, React Router navigates to
// /recipes/:id (e.g. /recipes/3). This component reads that "id" from
// the URL, fetches the full recipe from the API, and displays it.
//
// KEY CONCEPTS:
//   - useParams(): a React Router hook that extracts URL parameters.
//     For the route "/recipes/:id", useParams() returns { id: "3" }.
//   - useEffect with [id] dependency: re-fetches whenever the id changes
//     (e.g. if the user navigates from /recipes/1 to /recipes/2).
//   - Ownership check: only the user who created the recipe (userId match)
//     can see the Edit and Delete buttons.
//   - window.confirm(): a built-in browser dialog that asks "Are you sure?"
//     Returns true if the user clicks OK, false if they click Cancel.
//   - String .split(): used to turn the comma-separated ingredients into
//     an array (for a list) and the newline-separated instructions into
//     individual paragraphs.
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipe, deleteRecipe } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function RecipeDetail() {
  // Extract the "id" from the URL (e.g. /recipes/3 → id = "3")
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // recipe starts as null (we haven't fetched it yet)
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the recipe whenever the "id" URL parameter changes
  useEffect(() => {
    getRecipe(id)
      .then(setRecipe)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Delete handler — asks for confirmation, then calls the API and
  // navigates back to the home page
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await deleteRecipe(id);
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If the API returned nothing (e.g. invalid id), show a "not found" message
  if (!recipe) {
    return <p className="text-center mt-5">Recipe not found.</p>;
  }

  // Check if the currently logged-in user is the one who created this recipe.
  // Only the owner can edit or delete.
  const isOwner = user && user.id === recipe.userId;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="recipe-detail-img mb-4"
          onError={(e) => {
            e.target.src = 'https://placehold.co/800x400?text=No+Image';
          }}
        />
        <h1>{recipe.title}</h1>
        <p className="lead text-muted">{recipe.description}</p>

        {/* Ingredients: stored as a comma-separated string in the database.
            .split(',') turns "eggs, flour, milk" into ["eggs", " flour", " milk"]
            .trim() removes the leading/trailing whitespace from each item */}
        <h4 className="mt-4">Ingredients</h4>
        <ul className="list-group mb-4">
          {recipe.ingredients.split(',').map((item, idx) => (
            <li key={idx} className="list-group-item">{item.trim()}</li>
          ))}
        </ul>

        {/* Instructions: stored with "\n" between steps.
            .split('\n') turns them into an array of step strings. */}
        <h4>Instructions</h4>
        <div className="mb-4">
          {recipe.instructions.split('\n').map((step, idx) => (
            <p key={idx} className="mb-1">{step}</p>
          ))}
        </div>

        {/* Action buttons */}
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-secondary">Back to Recipes</Link>
          {/* Edit and Delete — only visible to the recipe owner */}
          {isOwner && (
            <>
              <Link to={`/recipes/${id}/edit`} className="btn btn-warning">Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
