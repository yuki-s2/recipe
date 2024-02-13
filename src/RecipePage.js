// RecipePage.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeListPage from './RecipeListPage';
import RecipeDetailPage from './RecipeDetailPage';
// import RecipeList from './RecipeList';
import SelectedRecipes from './SelectedRecipes';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectRecipes, setSelectRecipes] = useState([]);

  const addRecipe = (recipeName, detail) => {
    const newRecipe = {
      id: recipes.length + 1,
      name: recipeName,
      details: detail,
      /* その他のレシピ情報 */
    };
    setRecipes([...recipes, newRecipe]);
  };
  const addSelectRecipe = (selectRecipeName, selectRecipeDetail) => {
    const newSelectRecipe = {
      id: recipes.length + 1,
      name: selectRecipeName,
      details: selectRecipeDetail,
      /* その他のレシピ情報 */
    };
    setSelectRecipes([...selectRecipes, newSelectRecipe]);
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
          element={<SelectedRecipes selectRecipes={selectRecipes} addSelectRecipe={addSelectRecipe} />}
        />
        {/* <Route path="/recipes/:recipeId" element={<RecipeDetailPage recipes={recipes} />} /> */}
        {/* <Route path="/recipes/:recipeId" element={<SelectedRecipes selectRecipes={selectRecipes} addSelectRecipe={addSelectRecipe} />} /> */}
      </Routes>
    </Router>
  );
};

export default RecipePage;
