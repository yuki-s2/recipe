import React from 'react';
import Layout from '../layout/layout';
import { useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import RecipeInputForm from './RecipeInputForm';
import { useRecipeForm } from './useRecipeForm';
import { ButtonListPage, SignOut, ButtonSelectedRecipePage } from '../components/Button';

export const RecipeInputPage = ({ posts }) => {
  const { postId } = useParams();
  const recipe = posts ? posts.find(post => post.id === postId) : null;

  // 作り方画像をFirebaseに保存 
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
    newIngredientQty,
    loading,
    loadingProcessImgs,
    tempImageUrl,
    editedRecipe,
    handleAddIngredient,
    handleAddIngredientQty,
    handleAddIngredientField,
    handleAddProcessUrlAndText,
    handleTextEdited,
    handleSubmit,
    handleRemoveIngredient,
    handleRemoveImgAndText,
    handleRemoveImage,
    handleFileUploadToFirebase,
    handleFileSelection,
    handleFileEdited,
  } = useRecipeForm(recipe);

  return (
    <Layout>
    <div className="recipeInput_main">
      <div className='inner'>
        <div className="recipe_wrap">
          <div className="recipe_head">
            <h2>add new recipe</h2>

          </div>
          <div className="recipe_body">
            <RecipeInputForm
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
              handleAddProcessUrlAndText={handleAddProcessUrlAndText}
              handleTextEdited={handleTextEdited}
              handleSubmit={handleSubmit}
              loading={loading}
              editedRecipe={editedRecipe}
              handleRemoveIngredient={handleRemoveIngredient}
              handleRemoveImgAndText={handleRemoveImgAndText}
              handleRemoveImage={handleRemoveImage}
              uploadDetailImages={uploadDetailImages}
              handleFileUploadToFirebase={handleFileUploadToFirebase}
              handleFileSelection={handleFileSelection}
              handleFileEdited={handleFileEdited}
              loadingProcessImgs={loadingProcessImgs}
            />
          </div>
        </div>
        <div className="btn_container">
          <ButtonListPage />
          <ButtonSelectedRecipePage />
        </div>
        <SignOut />
      </div>
    </div>
    </Layout>
  );
};

export default RecipeInputPage;
