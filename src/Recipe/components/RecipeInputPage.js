import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import SignOut from './SignOut';
import RecipeInputForm from './RecipeInputForm';
import { useRecipeForm } from './useRecipeForm';

export const RecipeInputPage = ({ posts }) => {
  const { postId } = useParams();
  const recipe = posts ? posts.find(post => post.id === postId) : null;

  // // 作り方画像をFirebaseに保存
  const uploadDetailImages = async (files) => {
    files = Array.from(files);

    const stepImgUrls = await Promise.all(
      files.map(async (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images_processUrl/" + file.name);
        await uploadBytesResumable(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );
    return stepImgUrls;
  };
  
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
  } = useRecipeForm(recipe);

  return (
    <div className="recipeInput_body">
      <div className='inner'>
        <div className="recipeInput_wrap">
          <div className="recipeInput_head">
            <div className="add">add new recipe</div>
            <div className="recipeInput_menu">
              <button><img className="recipeInput_edit" src="" alt="編集" /></button>
              <button><img className="recipeInput_delete" src="" alt="削除" /></button>
            </div>
          </div>
          <div className="recipeInput_contents">
          <div className="recipeInput_container">
            <RecipeInputForm
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
              uploadDetailImages={uploadDetailImages}
              handleFileUploadToFirebase={handleFileUploadToFirebase}
              handleFileSelection={handleFileSelection}
              loadingProcessImgs={loadingProcessImgs}
            />
                </div>
          </div>
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

export default RecipeInputPage;
