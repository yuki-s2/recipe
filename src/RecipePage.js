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

  const addRecipe = (recipeName, detail) => {
    const newRecipe = {
      id: recipes.length + 1,
      name: recipeName,
      details: detail,
      /* その他のレシピ情報 */
    };
    setRecipes([...recipes, newRecipe]);
  };
  const addSelectedRecipe = (recipeName, detail) => {
    const newSelectedRecipes = {
      id: recipes.length + 1,
      name: recipeName,
      details: detail,
      /* その他のレシピ情報 */
    };
    setSelectedRecipes([...selectedRecipes, newSelectedRecipes]);
  };


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<RecipeListPage recipes={recipes} addRecipe={addRecipe} />}
        />
                <Route
          path="/"
          element={<RecipeInputPage recipes={recipes} setSelectedRecipes={setSelectedRecipes} />} // setSelectedRecipes を追加
        />
        <Route
          path="/RecipeInputPage"
          element={<RecipeInputPage recipes={recipes} addRecipe={addRecipe} />}
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