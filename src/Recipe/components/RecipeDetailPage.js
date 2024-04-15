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
    <div className='recipeDetail_body'>
      <div className="inner">
        <h2 className='page_ttl'>今日の献立</h2>
        <ul className="recipeDetail_edit">
          <li className='recipeDetail_editItem'>編集</li>
          <li className='recipeDetail_editItem'>削除</li>
        </ul>
        <div className="recipeDetail_img">
          <img src="" alt="" />
        </div>
        <h3 className='recipeDetail_name'>{recipe.name}</h3>
        <RecipeIngredients recipe={recipe} />
        <div className="recipeDetail_detailsContainer">
          <h4 className='recipeDetail_title'>作り方</h4>
          <p>{recipe.details}</p>
        </div>
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
    </div>
  );
};

