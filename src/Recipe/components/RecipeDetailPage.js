import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { db, collection, doc, deleteDoc } from '../../Firebase';


export const RecipeDetailPage = ({ posts }) => {
  const { postId } = useParams(); // URLパラメータからpostIdを取得
  // postsが存在することを確認し、該当のレシピを取得
  const recipe = posts ? posts.find(post => post.id === postId) : null;
  if (!recipe) {
    return (
      <div>
    <div>登録されたレシピはありません</div>
    <div className="btn_container">
    <Link to="/SelectedRecipes">
      <div className='btn_link'>選択されたレシピ一覧へ</div>
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
    );
  }

  const handleClickDelete = async () => {
    try {
      await deleteDoc(doc(collection(db, "posts"), recipe.id));
      alert('削除が完了しました');
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

    return (
      <div className='recipeDetail_body'>
        <div className="inner">
          <h3 className='recipeDetail_name'>{recipe.title}</h3>
          <ul className="recipeDetail_edit">
            <li className='recipeDetail_editItem'>編集</li>
            <li className='recipeDetail_editItem'>
              <button onClick={handleClickDelete} >削除</button>
            </li>
          </ul>

          <div className="svgContent_main">
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
            <h3 className='recipeDetail_title'>材料</h3>
            {recipe.ingredient && recipe.ingredient.map((ingredient, index) => (
              <p key={index}>{ingredient}</p>
            ))}
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
            <p className='recipeDetail_detailsText'>{recipe.text}</p>
          </div>

          <div className="btn_container">
            <Link to="/SelectedRecipes">
              <div className='btn_link'>選択されたレシピ一覧へ</div>
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
