//レシピの詳細画面
import React, { Fragment, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, doc, deleteDoc } from "firebase/firestore";
//▼活用する
import { getStorage, ref, deleteObject } from 'firebase/storage';
import Process from '../components/Process';
import RecipeInputForm from './RecipeInputForm';
import Chat from '../Chat';
import { useRecipeForm } from './useRecipeForm';
import { ButtonInputPage, ButtonSelectedRecipePage, ButtonListPage } from '../components/Button';

export const RecipeDetailPage = ({ selectedPosts, posts }) => {

  const { postId } = useParams();//postIdの値を動的に取得
  const recipe = posts ? posts.find(post => post.id === postId) : null;
  const selectedPostsInfo = posts ? posts.filter(post => selectedPosts?.includes(post.id)) : [];
  const {
    newRecipeName,
    setNewRecipeName,
    newProcess,
    setNewProcess,
    newIngredients,
    newIngredientQty,
    loading,
    loadingProcessImgs,
    imageUrl,
    tempImageUrl,
    editedRecipe,
    handleAddIngredient,
    handleAddIngredientQty,
    handleAddIngredientField,
    handleAddProcessUrlAndText,
    handleSubmit,
    handleRemoveIngredient,
    handleRemoveImgAndText,
    handleRemoveImage,
    handleFileUploadToFirebase,
    handleFileSelection,
    handleFileEdited,
    handleTextEdited,
  } = useRecipeForm(recipe);// recipe を直接渡す

  const [isEditing, setIsEditing] = useState(false);
  const handleClickDelete = async () => {
    try {
      const storage = getStorage();

      if (recipe.imageUrl) {
        const imageRef = ref(storage, recipe.imageUrl);
        await deleteObject(imageRef);
      }

      // 作り方画像の削除処理
      if (recipe.process && recipe.process.length > 0) {
        const deletePromises = recipe.process.map(async (detail) => {
          if (detail.process) { // process が存在する場合のみ削除
            const stepImageRef = ref(storage, detail.process);
            await deleteObject(stepImageRef);
          }
        });
        await Promise.all(deletePromises);
      }

      await deleteDoc(doc(collection(db, "posts"), recipe.id));
      alert('削除が完了しました');
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  if (!recipe) {
    return (
      <div className="recipeDetail">
        <div>レシピが見つかりません。</div>
        <div className="btn_container">
          <ButtonListPage />
          <ButtonSelectedRecipePage />
          <ButtonInputPage />
        </div>
      </div>
    );
  };

  const handleFormSubmit = (e) => {
    handleSubmit(e);
    setIsEditing(false); // 編集モードを終了
  };

  return (
    <div className="recipeDetail">
      <h1 className='page_ttl'>Today's menu</h1>
      {selectedPostsInfo.length === 0 ? (
        <div className='recipeDetail_tabs'>
          <div className="recipeDetail_tab">
            <div className='recipeDetail_tabTtl'>
              <p>{recipe.title}</p>
            </div>
          </div>
        </div>
      ) : (
        <ul className='recipeDetail_tabs'>
          {selectedPostsInfo && selectedPostsInfo.map(post => (
            <li className="recipeDetail_tab" key={post.id}>
              <div className='recipeDetail_tabTtl'>
                <Link to={`/recipes/${post.id}`}>
                  <p>{post.title}</p>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className='recipeDetail_main'>
        <div className="inner">
          <div className="recipe_wrap">

            <div className="recipe_head">
              <h2>{recipe.title}</h2>
              <ul className="recipeDetail_edit">
                <li>
                  <button className='button_edit' onClick={() => setIsEditing(true)}>
                    <div>|||</div>
                  </button>
                </li>
                <li className='recipeDetail_editItem'>
                  <button className='button_deleteBtn' onClick={handleClickDelete}>×</button>
                </li>
              </ul>
            </div>
            {isEditing ? (
              //編集画面
              <div className="recipe_body">
                <RecipeInputForm
                  imageUrl={imageUrl}
                  tempImageUrl={tempImageUrl}
                  newRecipeName={newRecipeName}
                  setNewRecipeName={setNewRecipeName}
                  newProcess={newProcess}
                  setNewProcess={setNewProcess}
                  newIngredients={newIngredients}
                  newIngredientQty={newIngredientQty}
                  handleAddIngredient={handleAddIngredient}
                  handleAddIngredientQty={handleAddIngredientQty}
                  handleAddIngredientField={handleAddIngredientField}
                  handleTextEdited={handleTextEdited}
                  handleAddProcessUrlAndText={handleAddProcessUrlAndText}
                  handleSubmit={handleFormSubmit}//onSubmit={handleSubmit} RecipeInputFormの{ここに入れたいやつ渡す}
                  loading={loading}
                  editedRecipe={editedRecipe}
                  handleRemoveIngredient={handleRemoveIngredient}
                  handleRemoveImgAndText={handleRemoveImgAndText}
                  handleRemoveImage={handleRemoveImage}
                  handleFileUploadToFirebase={handleFileUploadToFirebase}
                  handleFileSelection={handleFileSelection}
                  loadingProcessImgs={loadingProcessImgs}
                  handleFileEdited={handleFileEdited}
                />
              </div>
            ) : (
              <Fragment>
                <div className="recipe_body">
                  {recipe.imageUrl && (
                    <div className="recipeDetail_inputItem">
                      <div className="recipeDetail_mainImg">
                        <img src={recipe.imageUrl} alt="" />
                      </div>
                    </div>
                  )}
                  {recipe.ingredient && recipe.ingredient.length > 0 && (
                    <div className="recipeDetail_inputItem ingredient">
                      <h3 className='recipeDetail_title'>材料</h3>
                      <div className="recipeDetail_ingredients">
                        {recipe.ingredient.map((ingredient, index) => (
                          <p key={index}>
                            {ingredient} <span>{recipe.ingredientQty[index]}</span>
                          </p>
                        ))}
                      </div>
                      <Chat ingredients={recipe.ingredient} ingredientQtys={recipe.ingredientQty} />
                    </div>
                  )}
                  <div className="recipeDetail_inputItem">
                    {recipe.process && recipe.process.length > 0 && (
                      <Process steps={recipe.process} />
                    )}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <div className="btn_container">
            <ButtonListPage />
            <ButtonSelectedRecipePage />
            <ButtonInputPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
