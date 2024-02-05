// RecipePage.js
import React, { useState } from 'react';
import { Routes, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import RecipeList from './RecipeList';
import SelectedRecipes from './SelectedRecipes';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([
    { id: 1, name: 'Recipe 1', /* その他のレシピ情報 */ },
    { id: 2, name: 'Recipe 2', /* その他のレシピ情報 */ },
    // 他のレシピも同様に追加
  ]);

  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const handleRecipeSelect = (recipeId) => {
    const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
    setSelectedRecipes(prevSelectedRecipes => [...prevSelectedRecipes, selectedRecipe]);
  };

  return (
    <Router>
      <div>
        {/* RecipeListコンポーネントを呼び出し */}
        <RecipeList recipes={recipes} onSelectRecipe={handleRecipeSelect} />
        
        {/* SelectedRecipesコンポーネントを呼び出し */}
        <SelectedRecipes selectedRecipes={selectedRecipes} />

        {/* レシピページへのルートを設定 */}
        <Routes>
          <Route path="/recipes/:recipeId" element={<RecipeDetail recipes={recipes} />} />
        </Routes>
      </div>
    </Router>
  );
};

const RecipeDetail = ({ recipes }) => {
  return (
    <div>
      <h2>Recipe Detail</h2>
      {/* その他のレシピ情報を表示 */}
    </div>
  );
};

export default RecipePage;
