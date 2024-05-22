// RecipePage.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Form } from 'react-router-dom';
import { RecipeDetailPage, RecipeInputPage, RecipeListPage, SelectedRecipes } from './components';
import Chat from '../Chat';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  
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
          element={<RecipeInputPage recipes={recipes} addRecipe={addRecipe} />}
        />
        <Route
          path="/RecipeListPage"
          element={<RecipeListPage recipes={recipes} selectedPosts={selectedPosts} setSelectedPosts={setSelectedPosts} />}
        />
        <Route
          path="/SelectedRecipes"
          element={<SelectedRecipes recipes={recipes} selectedRecipes={selectedRecipes} />}
        />
        <Route path="/recipes/:recipeId" element={<RecipeDetailPage recipes={recipes} />} />
        <Route element={<RecipeListPage />} />
        <Route element={<Chat recipes={recipes} selectedRecipes={selectedRecipes} />} />
      </Routes>
    </Router>
  );
};

export default RecipePage; 