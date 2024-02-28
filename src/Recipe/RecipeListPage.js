// RecipeListPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RecipeListPage = ({ recipes, addRecipe }) => {
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleNameInputChange = (event) => {
    setNewRecipeName(event.target.value);
  };
  const handleRecipeInputChange = (event) => {
    setNewDetail(event.target.value);
  };
  const handleAdditionalInfoChange = (event) => {
    setAdditionalInfo(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addRecipe(newRecipeName, newDetail);
    setNewRecipeName('');
    setNewDetail('');
  };
  const handleAdditionalButtonSubmit = () => {
    // このボタンの処理をここに記述
    console.log("Additional Button Clicked!");
  };

  return (
    <div>
      <h2>レシピ一覧</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前"
          value={newRecipeName}
          onChange={handleNameInputChange}
        />
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
      <form onSubmit={handleAdditionalButtonSubmit}>
        <input
          type="text"
          placeholder="追加情報"
          value={additionalInfo}
          onChange={handleAdditionalInfoChange}
        />
        <button type="submit">追加ボタン</button>
      </form>
    </div>
  );
};

export default RecipeListPage;
