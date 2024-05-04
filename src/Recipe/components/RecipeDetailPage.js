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
        <h3 className='recipeDetail_name'>{recipe.name}</h3>
        <ul className="recipeDetail_edit">
          <li className='recipeDetail_editItem'>編集</li>
          <li className='recipeDetail_editItem'>削除</li>
        </ul>

        <div class="svgContent_main">
          <svg width="0" height="0" viewBox="0 0 393 352">
            <clipPath id="clip01">
              <path d="M390 196.5V326C390 338.703 379.703 349 367 349H26C13.2975 349 3 338.703 3 326V196.5C3 89.6329 89.6329 3 196.5 3C303.367 3 390 89.6329 390 196.5Z" />
            </clipPath>
          </svg>
        </div>
        <div className="svgContent_mainImg">
          <svg width="70%" height="70%" viewBox="0 0 393 352">
            <image href="/images/img_2.JPG" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip01)" />
          </svg>
        </div>

        <div className="recipeDetail_inputItem">
          <RecipeIngredients recipe={recipe} />
        </div>

        <div className="recipeDetail_inputItem">
        <div className="svgContent_subImg">
            <img src="/images/img_2.JPG" alt="" />
            <img src="/images/img_2.JPG" alt="" />
            <img src="/images/img_2.JPG" alt="" />
            <img src="/images/img_2.JPG" alt="" />
            <img src="/images/img_2.JPG" alt="" />
          </div>
          <h3 className='recipeDetail_title'>作り方</h3>
          <p className='recipeDetail_detailsText'>{recipe.details}</p>
        </div>

        <div className="btn_container">
          <Link to="/SelectedRecipes">
            <div className='btn_link'>選択れたレシピ一覧へ</div>
          </Link>
          <Link to="/RecipeListPage">
            <div className='btn_link'>追加されたレシピ一覧へ</div>
          </Link>
        </div>
        <div className="btn_container">
          <Link to="/">
            <div className='btn_link'>リストに戻る</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

