// RecipeListPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RecipeListPage = ({ recipes, addRecipe }) => {
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

  const handleNameInputChange = (event) => {
    setNewRecipeName(event.target.value);
  };
  const handleRecipeInputChange = (event) => {
    setNewDetail(event.target.value);
  };
  const handleAdditionalInfoChange = (event) => {
    setNewMaterial(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addRecipe(newRecipeName, newDetail);
    setNewRecipeName('');
    setNewDetail('');
  };
  const handleAdditionalButtonSubmit = (event) => {
    event.preventDefault();
    addRecipe(newMaterial);
    setNewMaterial('');
    console.log("Additional Button Clicked!");
  };

  console.log(recipes);

  return (
    <div>
      <h2>レシピ一覧</h2>
      <form id="signin" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前"
          value={newRecipeName}
          onChange={handleNameInputChange}
        />
        <div onSubmit={handleAdditionalButtonSubmit}>
          <input
            type="text"
            placeholder="追加情報"
            value={newMaterial}
            onChange={handleAdditionalInfoChange}
          />
          <button form="signin" type="submit">追加ボタン</button>
        </div>
        <input
          type="text"
          placeholder="内容"
          value={newDetail}
          onChange={handleRecipeInputChange}
        />
        <button type="submit">追加</button>
        <Link to="/RecipeInputPage">
          <div>追加されたレシピ一覧へ</div>
        </Link>
      </form>

    </div>
  );
};

export default RecipeListPage;
