// RecipeListPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const RecipeListPage = ({ recipes, addRecipe }) => {
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newIngredients, setNewIngredients] = useState(['']); // 初期の材料入力フィールドを1つ持つ

  const handleNameInputChange = (event) => {
    setNewRecipeName(event.target.value);
  };
  const handleRecipeInputChange = (event) => {
    event.preventDefault();
    setNewDetail(event.target.value);
  };
  const handleAdditionalInfoChange = (index, event) => {
    const values = [...newIngredients];
    values[index] = event.target.value;
    setNewIngredients(values);
  };

  const handleAddIngredientField = () => {
    setNewIngredients([...newIngredients, '']); // 新しい材料入力フィールドを追加する
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!newRecipeName || !newDetail) {
      return;
    }
    const ingredients = newIngredients.filter(ingredient => ingredient.trim() !== '');
    addRecipe(newRecipeName, ingredients, newDetail);

    setNewRecipeName('');
    setNewDetail('');
    setNewIngredients(['']);
  };



  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
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
          {newIngredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              placeholder={`材料${index + 1}`}
              value={ingredient}
              onChange={(event) => handleAdditionalInfoChange(index, event)}
            />
          ))}
          <button type="button" onClick={handleAddIngredientField}>
            材料追加
          </button>
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
