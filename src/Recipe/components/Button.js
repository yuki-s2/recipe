//ボタン パーツ
import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../Firebase'

export const ButtonInputPage = () => {
    return (
        <Link to="/">
          <div className='btn_link'>Add Recipe</div>
        </Link>
    );
};

export const ButtonSelectedRecipePage = () => {
    return (
          <Link to="/SelectedRecipes">
            <div className='btn_link'>Today's Menu</div>
          </Link>

    );
};

export const ButtonListPage = () => {
    return (
          <Link to="/RecipeListPage">
            <div className='btn_link'>Recipe List</div>
          </Link>

    );
};

export function SignOut() {
  return (
    <div className="btn_container">
        <button className='btn_link' onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}