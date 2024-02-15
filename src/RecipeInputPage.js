// RecipeInputPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeInputPage = ({ recipes }) => {
  return (
    <div>
      <h2>追加されたレシピ一覧</h2>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recipes/${recipe.id}`}>
              {recipe.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeInputPage;
