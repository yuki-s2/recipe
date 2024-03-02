// RecipeListPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RecipeListPage = ({ recipes, addRecipe }) => {
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newIngredients, setNewIngredients] = useState('');

  const handleNameInputChange = (event) => {
    setNewRecipeName(event.target.value);
  };
  const handleRecipeInputChange = (event) => {
    event.preventDefault();
    setNewDetail(event.target.value);
  };
  const handleAdditionalInfoChange = (event) => {
    setNewIngredients(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addRecipe(newRecipeName, newIngredients, newDetail);
    setNewRecipeName('');
    setNewDetail('');
    setNewIngredients('');
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Enterキーのデフォルト動作を無効化
    }
  };

  console.log(recipes);

  return (
    <div>
      <h2>レシピ一覧</h2>
      <form onSubmit={handleSubmit}>
      <div onKeyDown={handleKeyDown}>
        <input
          type="text"
          placeholder="名前"
          value={newRecipeName}
          onChange={handleNameInputChange}
        />
          <input
            type="text"
            placeholder="材料"
            value={newIngredients}
            onChange={handleAdditionalInfoChange}
          />
        <input
          type="text"
          placeholder="内容"
          value={newDetail}
          onChange={handleRecipeInputChange}
        />
        </div>
        <button type="submit">追加</button>
        <Link to="/RecipeInputPage">
          <div>追加されたレシピ一覧へ</div>
        </Link>
      </form>

    </div>
  );
};

export default RecipeListPage;
