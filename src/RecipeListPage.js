// RecipeListPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeList from './RecipeList';

const RecipeListPage = ({ recipes, onSelectRecipe }) => {
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeDetails, setNewRecipeDetails] = useState('');
  const [recipeList, setRecipeList] = useState(recipes);

  const handleNameInputChange = (event) => {
    setNewRecipeName(event.target.value);
  };

  const handleDetailsInputChange = (event) => {
    setNewRecipeDetails(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newRecipe = {
      id: recipeList.length + 1,
      name: newRecipeName,
      details: newRecipeDetails,
    };
    setRecipeList([...recipeList, newRecipe]);
    setNewRecipeName('');
    setNewRecipeDetails('');
  };

  return (
    <div>
      <h2>レシピ一覧</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter recipe name"
          value={newRecipeName}
          onChange={handleNameInputChange}
        />
        <input
          type="text"
          placeholder="Enter recipe details"
          value={newRecipeDetails}
          onChange={handleDetailsInputChange}
        />
        <button type="submit">追加</button>
      </form>
      
      {/* レシピリスト */}
      <ul>
        {recipeList.map(recipe => (
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

export default RecipeListPage;
