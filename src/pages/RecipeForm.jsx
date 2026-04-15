// =============================================================================
// RecipeForm.jsx — ADD / EDIT RECIPE FORM (one component, two purposes)
// =============================================================================
// This component is used for BOTH creating a new recipe AND editing an
// existing one. It figures out which mode it's in by checking the URL:
//   - /recipes/new       → no "id" parameter → CREATE mode
//   - /recipes/3/edit    → id = "3"          → EDIT mode
//
// WHY REUSE ONE COMPONENT?
//   The form fields are identical for creating and editing. The only
//   differences are: (a) edit mode pre-fills the fields from the API,
//   and (b) submit calls createRecipe vs. updateRecipe.
//
// KEY CONCEPTS:
//   - useParams() to detect edit mode (presence of id)
//   - useEffect to pre-fill form fields when editing
//   - Controlled form inputs (value + onChange for each field)
//   - async form submission with error handling
//   - navigate(-1): goes back one step in browser history (like clicking
//     the browser's back button)
// =============================================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createRecipe, getRecipe, updateRecipe } from '../api';

export default function RecipeForm() {
  // If the URL is /recipes/3/edit, id will be "3".
  // If the URL is /recipes/new, id will be undefined.
  const { id } = useParams();

  // Boolean(undefined) is false, Boolean("3") is true
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const { user } = useAuth();

  // One state variable per form field, all start empty
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  // If we're in EDIT mode, fetch the existing recipe and fill the form.
  // The dependency array [id, isEdit] means this runs when those values change.
  useEffect(() => {
    if (isEdit) {
      getRecipe(id).then((recipe) => {
        setTitle(recipe.title);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients);
        setInstructions(recipe.instructions);
        setImageUrl(recipe.imageUrl || '');
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Build the recipe data object from all form fields.
    // userId links the recipe to the logged-in user (for ownership checks).
    const recipeData = {
      title,
      description,
      ingredients,
      instructions,
      imageUrl,
      userId: user.id,
    };

    try {
      if (isEdit) {
        // PUT request — replaces the recipe in the database
        await updateRecipe(id, recipeData);
        // Navigate to the detail page of the edited recipe
        navigate(`/recipes/${id}`);
      } else {
        // POST request — creates a new recipe and returns it (with new id)
        const created = await createRecipe(recipeData);
        // Navigate to the detail page of the newly created recipe
        navigate(`/recipes/${created.id}`);
      }
    } catch {
      setError('Failed to save recipe. Please try again.');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        {/* Dynamic heading based on mode */}
        <h2 className="mb-4">{isEdit ? 'Edit Recipe' : 'Add New Recipe'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ingredients" className="form-label">
              Ingredients (comma-separated)
            </label>
            <textarea
              className="form-control"
              id="ingredients"
              rows="3"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. 2 eggs, 100g flour, 200ml milk"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="instructions" className="form-label">
              Instructions (one step per line)
            </label>
            <textarea
              className="form-control"
              id="instructions"
              rows="5"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={"1. Preheat the oven...\n2. Mix ingredients...\n3. Bake for 30 minutes..."}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label">Image URL (optional)</label>
            <input
              type="url"
              className="form-control"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="d-flex gap-2">
            {/* Dynamic button text based on mode */}
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update Recipe' : 'Add Recipe'}
            </button>
            {/* navigate(-1) goes back one step in browser history */}
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
