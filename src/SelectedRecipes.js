// SelectedRecipes.js
import React from 'react';
import { Link } from 'react-router-dom';

const SelectedRecipes = ({ selectedRecipes }) => {
  return (
    <div>
      <h2>SelectedRecipes</h2>
      <ul>
        {selectedRecipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recipes/${recipe.id}`}>
              {selectedRecipes.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SelectedRecipes;