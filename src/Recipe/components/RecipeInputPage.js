// RecipeInputPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, getDocs, onSnapshot, addDoc } from "firebase/firestore";
// import SendMessage from './SendMessage.js';
import SignOut from './SignOut.js';

export const RecipeInputPage = () => {
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newIngredients, setNewIngredients] = useState(['']); // 初期の材料入力フィールドを1つ持つ
  // const [fbMessage, setFbMessage] = useState([]);


  // const handleNameInputChange = (event) => {
  //   setNewRecipeName(event.target.value);
  // };
  // const handleRecipeInputChange = (event) => {
  //   event.preventDefault();
  //   setNewDetail(event.target.value);
  // };
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

    addDoc(collection(db, "posts"), {
      // docId: doc.id,
      title: newRecipeName,
      text: newDetail,
      ingredient: newIngredients,
    });
    // setNewRecipeName('');
    // setNewDetail('');
    // setNewIngredients(['']);


    if (!newRecipeName || !newDetail) {
      return;
    }
    // const ingredients = newIngredients.filter(ingredient => ingredient.trim() !== '');
    // addRecipe(ingredients, ingredients, newDetail);

    setNewRecipeName('');
    setNewDetail('');
    setNewIngredients(['']);
  };

  //材料エリアまとめて送信
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

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
                <div className="recipeInput_title">レシピの名前</div>
                <input type="title" onChange={(e) => setNewRecipeName(e.target.value)} value={newRecipeName}
                />
              </div>
              <div className="recipeInput_item recipeInput_ingredient">
                <div className="recipeInput_title">材料</div>
                {newIngredients.map((ingredient, index) => (
                  <input
                    key={index}
                    type="text"
                    value={ingredient}
                    onChange={(event) => handleAdditionalInfoChange(index, event)}
                  />
                ))}
                <button className='button_additionBtn' type="button" onClick={handleAddIngredientField}>
                  追加する
                </button>
              </div>
              <div className="recipeInput_item">
                <h3 className="recipeInput_title">作り方</h3>
                <input type="text" onChange={(e) => setNewDetail(e.target.value)} value={newDetail}
                />
              </div>
            </div>
            <button className='button_additionBtn' type="submit">追加する</button>
          </form>
        </div>
        <div className="btn_container">
          <Link to="/RecipeListPage">
            <div className='btn_link'>追加されたレシピ一覧へ</div>
          </Link>
        </div>
        <SignOut />
      </div>
    </div>
  );
};
