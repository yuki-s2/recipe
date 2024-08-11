
// RecipeInputForm.js
import React, { useRef } from 'react';

const RecipeInputForm = ({
  newRecipeName,
  setNewRecipeName,
  newDetail,
  setNewDetail,
  newIngredients,
  handleAdditionalInfoChange,
  handleAddIngredientField,
  handleSubmit,
  loading,
  isUploaded,
  editedRecipe,
  handleRemoveImage,
  handleRemoveImage2,
  handleFileUploadToFirebase,
  handleFileSelection,
  loadingDetailImgs
}) => {
  const imgInputRef = useRef(null);
  const detailImgInputRef = useRef(null);
return (
  <div className="recipeInput_container">
    {/* <h2 className='page_ttl'>新しいレシピを追加する</h2> */}
    <form className='recipeInput_form' onSubmit={handleSubmit}>
      <div>
        {loading ? (
          <p>Uploading...</p>
        ) : isUploaded ? (
          <div className='recipeInput_item'>
            {editedRecipe.imageUrl ? (
              <div className='recipeInput_img is-display'
              style={{
                backgroundImage: `url(${editedRecipe.imageUrl})`,
              }}
              >
                <button type="button"  className='removeButton' onClick={handleRemoveImage2}>✖️</button>
              </div>
            ) : (
              <React.Fragment>
              <div className='recipeInput_img' onClick={() => imgInputRef.current.click()}>
                <span>Upload</span>
              </div>
              <input
              ref={imgInputRef}
                style={{ display: 'none' }}
                type='file'
                accept='.png, .jpg, .jpeg'
                onChange={handleFileUploadToFirebase}
              />
            </React.Fragment>
            )}
          </div>
        ) : (
          <div className='recipeInput_item'>
            <div className='recipeInput_img' onClick={() => imgInputRef.current.click()}>
              <span>Upload</span>
            </div>
            <input
            ref={imgInputRef}
              style={{ display: 'none' }}
              // id='imgInput'
              type='file'
              accept='.png, .jpg, .jpeg'
              onChange={handleFileUploadToFirebase}
            />
          </div>
        )}
        <div className='recipeInput_item'>
          <div className="recipeInput_title">レシピの名前</div>
          <input className='input' type="text" onChange={(e) => setNewRecipeName(e.target.value)} value={newRecipeName} />
        </div>
        <div className="recipeInput_item recipeInput_ingredient">
          <div className="recipeInput_title">材料</div>
          {newIngredients.map((ingredient, index) => (
            <input
              className='input'
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
        <div className="smallItem">
          <div className="recipeInput_wrap">
            <div className="recipeInput_head">
              <div className="add">add</div>
            </div>
            <div className="recipeInput_contents is-flow">
              {editedRecipe.images_detailUrl.map((images_detailUrl, index) => (
                <div className="recipeInput_img is-display" key={index} style={{
                  backgroundImage: `url(${images_detailUrl})`,
                }}>
                  <button type="button" className='removeButton' onClick={() => handleRemoveImage(index)} >✖️</button>
                </div>
              ))}
              <div className="recipeInput_img" onClick={() => detailImgInputRef.current.click()}>
                <span>Upload</span>
              </div>
              <input
              ref={detailImgInputRef}
                // id='detailImgInput'
                // className='input_img'
                type='file'
                multiple
                accept='.png, .jpg, .jpeg, .webp'
                style={{ display: 'none' }}
                onChange={handleFileSelection}
              />
            </div>
            {loadingDetailImgs ? (
              <p>詳細画像をアップロード中...</p>
            ) : (
              <p>画像をアップロード</p>
            )}
          </div>
        </div>
        <div className="recipeInput_item">
          <h3 className="recipeInput_title">作り方</h3>
          <input className='input' type="text" onChange={(e) => setNewDetail(e.target.value)} value={newDetail} />
        </div>
      </div>
      <button className='button_additionBtn' type="submit" disabled={!newRecipeName || !newDetail}>追加する</button>
    </form>
  </div>
);
};

export default RecipeInputForm;