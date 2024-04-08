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
    <div className="recipeInput_body">
      <div className='inner'>
        <div className="recipeInput_wrap">
          <div className="recipeInput_ttl">
            <h2 className='page_ttl'>新しいレシピを追加する</h2>
          </div>
          <form className='recipeInput_form recipeInput_container' onSubmit={handleSubmit}>
            <div onKeyDown={handleKeyDown}>
              <div className='recipeInput_item'>
                <div className="recipeInput_text">レシピの名前</div>
                <input
                  type="text"
                  // placeholder="レシピの名前"
                  value={newRecipeName}
                  onChange={handleNameInputChange}
                />
              </div>
              <div className="recipeInput_item recipeInput_ingredient">
                <div className="recipeInput_text">材料</div>
                {newIngredients.map((ingredient, index) => (
                  <input
                    key={index}
                    type="text"
                    // placeholder={`材料${index + 1}`}
                    value={ingredient}
                    onChange={(event) => handleAdditionalInfoChange(index, event)}
                  />
                ))}
                <button className='button_additionBtn' type="button" onClick={handleAddIngredientField}>
                  追加する
                </button>
              </div>
              <div className="recipeInput_item recipeInput_howTo">
                <div className="recipeInput_text">作り方</div>
                <input
                  type="text"
                  // placeholder="作り方"
                  value={newDetail}
                  onChange={handleRecipeInputChange}
                />
              </div>
            </div>
            <button className='button_additionBtn' type="submit">追加する</button>
          </form>
        </div>
        <div className="recipeInput_btnArea">
          <Link to="/RecipeInputPage">
            <div className='btn_link'>追加されたレシピ一覧へ</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
