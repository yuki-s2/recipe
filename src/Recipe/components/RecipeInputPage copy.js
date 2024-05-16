// RecipeInputPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import SendMessage from './SendMessage.js';
import SignOut from './SignOut.js';


export const RecipeInputPage = ({ recipes, addRecipe }) => {
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

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postData = collection(db, "posts");
    getDocs(postData).then((snapShot) => {
      setPosts(snapShot.docs.map((doc) => ({ ...doc.data() })));
    });
    //リアルタイムで表示
    onSnapshot(postData, (post) => {
      setPosts(post.docs.map((doc) => ({ ...doc.data() })));

    });

  }, []);

  return (
    <div className="recipeInput_body">
      {posts.map((post) => (
        <div>
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.text}</p>
            <p>{post.text2}</p>
          </div>
        </div>
      ))}
      <SendMessage />
      <div className='inner'>
        <div className="recipeInput_wrap">
          <div className="recipeInput_ttl">
            <h2 className='page_ttl'>新しいレシピを追加する</h2>
          </div>
          <form className='recipeInput_form recipeInput_container' onSubmit={handleSubmit}>
            <div onKeyDown={handleKeyDown}>
              <div className='recipeInput_item'>
                <div className="recipeInput_title">レシピの名前</div>
                <input
                  type="text"
                  value={newRecipeName}
                  onChange={handleNameInputChange}
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
                <input
                  type="text"
                  value={newDetail}
                  onChange={handleRecipeInputChange}
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
