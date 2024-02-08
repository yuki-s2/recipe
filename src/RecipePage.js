// RecipePage.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeListPage from './RecipeListPage';
import RecipeDetailPage from './RecipeDetailPage';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([
    { id: 1, name: 'Recipe 1', /* その他のレシピ情報 */ },
    { id: 2, name: 'Recipe 2', /* その他のレシピ情報 */ },
    // 他のレシピも同様に追加
  ]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<RecipeListPage recipes={recipes} />} // handleSelectRecipeを渡さない
        />
        <Route path="/recipes/:recipeId" element={<RecipeDetailPage recipes={recipes} />} />
      </Routes>
    </Router>
  );
};

export default RecipePage;
