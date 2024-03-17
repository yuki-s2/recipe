// RecipePage.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Form } from 'react-router-dom';
import { RecipeDetailPage, RecipeListPage, RecipeInputPage, SelectedRecipes } from './components';
import Chat from '../Chat.js';

export const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const addRecipe = (recipeName, ingredient, detail) => {
    const newRecipe = {
      id: recipes.length + 1,
      name: recipeName,
      ingredients: ingredient,
      details: detail,
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
        <Route element={<Chat />} />
      </Routes>
    </Router>
  );
};
