//ボタン パーツ
import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../Firebase'

export const ButtonInputPage = () => {
    return (
        <div className="btn_container">
        <Link to="/">
          <div className='btn_link'>リストに戻る</div>
        </Link>
      </div>
    );
};

export const ButtonSelectedRecipePage = () => {
    return (
        <div className="btn_container">
          <Link to="/SelectedRecipes">
            <div className='btn_link'>選択されたレシピ一覧へ</div>
          </Link>
        </div>
    );
};

export const ButtonListPage = () => {
    return (
        <div className="btn_container">
          <Link to="/RecipeListPage">
            <div className='btn_link'>追加されたレシピ一覧へ</div>
          </Link>
        </div>
    );
};

export function SignOut() {
  return (
    <div className="btn_container">
        <button className='btn_link' onClick={() => auth.signOut()}>サインアウト</button>
    </div>
  )
}