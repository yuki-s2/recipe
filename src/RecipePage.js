// RecipePage.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeListPage from './RecipeListPage';
import RecipeDetailPage from './RecipeDetailPage';
import RecipeInputPage from './RecipeInputPage';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);

  const addRecipe = (recipeName, detail) => {
    const newRecipe = {
      id: recipes.length + 1,
      name: recipeName,
      details: detail,
      /* その他のレシピ情報 */
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
          element={<RecipeInputPage recipes={recipes} addRecipe={addRecipe} />}
        />
        <Route path="/recipes/:recipeId" element={<RecipeDetailPage recipes={recipes} />} />
        <Route element={<RecipeInputPage/>} />
      </Routes>
    </Router>
  );
};

export default RecipePage;