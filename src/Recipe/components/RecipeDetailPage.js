
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, doc, deleteDoc } from "firebase/firestore";
//▼活用する
import { getStorage, ref, deleteObject } from 'firebase/storage';
import Process from './Process';
import RecipeInputForm from './RecipeInputForm';
import { useRecipeForm } from './useRecipeForm';

export const RecipeDetailPage = ({ posts }) => {
  const { postId } = useParams();
  const recipe = posts ? posts.find(post => post.id === postId) : null;
  const {
    newRecipeName,
    setNewRecipeName,
    newProcess,
    setNewProcess,
    newIngredients,
    loading,
    loadingProcessImgs,
    imageUrl,
    tempImageUrl,
    editedRecipe,
    handleAdditionalInfoChange,
    handleAddIngredientField,
    handleAddProcessUrlAndText,
    handleSubmit,
    handleRemoveImgAndText,
    handleRemoveImage,
    handleFileUploadToFirebase,
    handleFileSelection,
  } = useRecipeForm(recipe);// recipe を直接渡す

  const [isEditing, setIsEditing] = useState(false);
  const handleClickDelete = async () => {
    try {
      const storage = getStorage();

      if (recipe.imageUrl) {
        const imageRef = ref(storage, recipe.imageUrl);
        await deleteObject(imageRef);
      }

      if (recipe.process && recipe.process.length > 0) {
        const deletePromises = recipe.process.map(async (detail) => {
          const stepImageRef = ref(storage, detail.process);
          await deleteObject(stepImageRef);
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
    return <div>レシピが見つかりません。</div>;
  }
  //RecipeInputPageと共通にできる？
  return (
    <div className='recipeDetail_body'>
      <div className="inner">
        <h3 className='recipeDetail_name'>{recipe.title}</h3>
        <ul className="recipeDetail_edit">
          <li className='recipeDetail_editItem'>
            <button className='button_additionBtn' onClick={() => setIsEditing(true)}>編集</button>
          </li>
          <li className='recipeDetail_editItem'>
            <button className='button_additionBtn' onClick={handleClickDelete}>削除</button>
          </li>
        </ul>
        {isEditing ? (
          //編集画面
          <RecipeInputForm
            imageUrl={imageUrl}
            tempImageUrl={tempImageUrl}
            newRecipeName={newRecipeName}
            setNewRecipeName={setNewRecipeName}
            newProcess={newProcess}
            setNewProcess={setNewProcess}
            newIngredients={newIngredients}
            handleAdditionalInfoChange={handleAdditionalInfoChange}
            handleAddIngredientField={handleAddIngredientField}
            handleAddProcessUrlAndText={handleAddProcessUrlAndText}
            handleSubmit={handleSubmit}
            loading={loading}
            editedRecipe={editedRecipe}
            handleRemoveImgAndText={handleRemoveImgAndText}
            handleRemoveImage={handleRemoveImage}
            handleFileUploadToFirebase={handleFileUploadToFirebase}
            handleFileSelection={handleFileSelection}
            loadingProcessImgs={loadingProcessImgs}
          />
        ) : (
          <div>
            <div className="svgContent_main">
              <svg>
                <defs>
                  <clipPath id="clip01" clipPathUnits="objectBoundingBox">
                    <path d="M0.1,0 L0.9,0 Q1,0 1,0.1 L1,0.9 Q1,1 0.9,1 L0.1,1 Q0,1 0,0.9 L0,0.1 Q0,0 0.1,0 Z" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="recipeDetail_inputItem">
              <div className="svgContent_mainImg">
                {recipe.imageUrl && (
                  <svg width="100%" height="100%" style={{ clipPath: "url(#clip01)" }}>
                    <image href={recipe.imageUrl} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  </svg>
                )}
              </div>
            </div>

            <div className="recipeDetail_inputItem ingredient">
              <h3 className='recipeDetail_title'>材料</h3>
              <div className="recipeDetail_ingredients">
                {recipe.ingredient && recipe.ingredient.map((ingredient, index) => (
                  <p key={index}>{ingredient}</p>
                ))}
              </div>
            </div>

            <div className="recipeDetail_inputItem">
              {recipe.process && recipe.process.length > 0 && (
                <Process steps={recipe.process} />
              )}
            </div>
          </div>
        )}
        <div className="btn_container">
          <Link to="/SelectedRecipes">
            <div className='btn_link'>選択されたレシピ一覧へ</div>
          </Link>
          <Link to="/RecipeListPage">
            <div className='btn_link'>追加されたレシピ一覧へ</div>
          </Link>
        </div>
        <div className="btn_container">
          <Link to="/">
            <div className='btn_link'>リストに戻る</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
