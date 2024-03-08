// RecipePage.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeListPage from './RecipeListPage';
import RecipeDetailPage from './RecipeDetailPage';
import RecipeInputPage from './RecipeInputPage';
import SelectedRecipes from './SelectedRecipes';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const addRecipe = (recipeName, detail, ingredient) => {
    const newRecipe = {
      id: recipes.length + 1,
      name: recipeName,
      details: detail,
      ingredients: ingredient,
    };
    setRecipes([...recipes, newRecipe]);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<RecipeListPage recipes={recipes} addRecipe={addRecipe} />}
        />
        <Route
          path="/RecipeInputPage"
          element={<RecipeInputPage recipes={recipes} selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} />}
        />
        <Route 
          path="/SelectedRecipes" 
          element={<SelectedRecipes recipes={recipes} selectedRecipes={selectedRecipes} />} 
        />
        <Route path="/recipes/:recipeId" element={<RecipeDetailPage recipes={recipes} />} />
        <Route element={<RecipeInputPage />} />
      </Routes>
    </Router>
  );
};

export default RecipePage;