// RecipeDetailPage.js
// recipesプロパティとレシピのIDを使用して、詳細情報を表示
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Chat from '../../Chat';

export const RecipeDetailPage = ({ recipes }) => {
  const { recipeId } = useParams();
  const recipe = recipes.find(recipe => recipe.id === parseInt(recipeId));

  if (!recipe) {
    return <div>登録されたレシピはありません</div>;
  }

  return (
    <div>
      <h2>{recipe.name}</h2>
      <p>{recipe.ingredients}</p>
      <Chat ingredients={recipe.ingredients} />
      <p>{recipe.details}</p>
      <Link to="/SelectedRecipes">
        <div>選択れたレシピ一覧へ</div>
      </Link>
      <Link to="/RecipeInputPage">
        <div>追加されたレシピ一覧へ</div>
      </Link>
      <Link to="/">
        <div>リストに戻る</div>
      </Link>
    </div>
  );
};
