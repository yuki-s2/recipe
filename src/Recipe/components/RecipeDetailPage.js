// RecipeDetailPage.js
// recipesプロパティとレシピのIDを使用して、詳細情報を表示
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { RecipeIngredients } from './RecipeIngredients';

export const RecipeDetailPage = ({ recipes }) => {
  const { recipeId } = useParams();
   const recipe = recipes.find(recipe => recipe.id === parseInt(recipeId));

  if (!recipe) {
    return <div>登録されたレシピはありません</div>;
  }

  return (
    <div>
      <h2>{recipe.name}</h2>
      <RecipeIngredients recipe={recipe} />
      <p>{recipe.details}</p>
      <Link to="/SelectedRecipes">
        <div className='btn_link'>選択れたレシピ一覧へ</div>
      </Link>
      <Link to="/RecipeListPage">
        <div className='btn_link'>追加されたレシピ一覧へ</div>
      </Link>
      <Link to="/">
        <div className='btn_link'>リストに戻る</div>
      </Link>
    </div>
  );
};

