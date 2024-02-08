// RecipeList.js
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeList = ({ recipes, onSelectRecipe }) => {
  return (
    <ul>
      {recipes.map(recipe => (
        <li key={recipe.id} onClick={() => onSelectRecipe(recipe.id)}>
          {/* レシピのリンクを作成 */}
          <Link to={`/recipes/${recipe.id}`}>
            {recipe.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default RecipeList;

