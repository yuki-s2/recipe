import React, { useRef } from 'react';

const RecipeInputForm = ({
  tempImageUrl,
  newRecipeName,
  setNewRecipeName,
  newDetail,
  setNewDetail,
  newIngredients,
  handleAdditionalInfoChange,
  handleAddIngredientField,
  handleAddDetailUrlAndText,
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
      <form className='recipeInput_form' onSubmit={handleSubmit}>
        <div className='recipeInput_item'>
          {loading ? (
            <p>Uploading...</p>
          ) : (
            editedRecipe.imageUrl ? (
              <div
                className='recipeInput_img is-display'
                style={{
                  backgroundImage: `url(${editedRecipe.imageUrl})`,
                }}                
              >
                <button type="button" className='removeButton' onClick={handleRemoveImage2}>✖️</button>
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
            )
          )}
        </div>
        <div className='recipeInput_item'>
          <div className="recipeInput_title">レシピの名前</div>
          <input className='input' type="text" onChange={(e) => setNewRecipeName(e.target.value)} value={newRecipeName} />
        </div>
        <div className="recipeInput_item recipeInput_ingredient">
          <div className="recipeInput_ingredientContainer">
            <div className="recipeInput_title">材料</div>
            <div className="recipeInput_ingredientInput">
              {newIngredients.map((ingredient, index) => (
                <input
                  className='input'
                  key={index}
                  type="text"
                  value={ingredient}
                  onChange={(event) => handleAdditionalInfoChange(index, event)}
                />
              ))}
            </div>
          </div>
          <button className='button_additionBtn' type="button" onClick={handleAddIngredientField}>
            追加する
          </button>
        </div>
        <div className="recipeInput_item is-flow">
          <h3 className="recipeInput_title">作り方</h3>
          <div className="recipeInput_detailContents">
            {editedRecipe.images_detailUrl.map((detailUrlAndText, index) => (
              <div className="recipeInput_imgAndText" key={index}>
                <div
                  className="recipeInput_img"
                  onClick={() => detailImgInputRef.current.click()}
                  style={{
                    backgroundImage: `url(${detailUrlAndText.images_detailUrl})`,
                  }}
                ></div>
                <button
                  type="button"
                  className='removeButton'
                  onClick={() => handleRemoveImage(index)}
                >
                  ✖️
                </button>
                <textarea
                  className='textarea'
                  type="text"
                  onChange={(e) => handleAddDetailUrlAndText(index, e)}
                  value={detailUrlAndText.text}
                ></textarea>
              </div>
            ))}
            <div className="recipeInput_imgAndText">
              {loadingDetailImgs ? (
                <div className='recipeInput_img is-input'>
                  <p>Uploading...</p>
                </div>
              ) : (
                <div
                  className='recipeInput_img is-input'
                  onClick={() => detailImgInputRef.current.click()}
                  style={{
                    backgroundImage: tempImageUrl ? `url(${tempImageUrl})` : 'none',
                  }}
                >
                  {!tempImageUrl && <span>Upload</span>}
                </div>
              )}
              <input
                style={{ display: 'none' }}
                ref={detailImgInputRef}
                type='file'
                multiple
                accept='.png, .jpg, .jpeg, .webp'
                onChange={handleFileSelection}
              />
              <textarea
                className='textarea'
                type="text"
                onChange={(e) => setNewDetail(e.target.value)}
                value={newDetail}
              ></textarea>
            </div>
            <button className='button_additionBtn' type="button" onClick={handleAddDetailUrlAndText}>
              追加する
            </button>
          </div>
        </div>
        <button className='button_additionBtn' type="submit" disabled={!newRecipeName || !newDetail}>追加する</button>
      </form>
    </div>
  );
};

export default RecipeInputForm;
