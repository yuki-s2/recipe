import React, { useRef } from 'react';

const RecipeInputForm = ({
  tempImageUrl,
  newRecipeName,
  setNewRecipeName,
  newProcess,
  setNewProcess,
  newIngredients,
  handleAdditionalInfoChange,
  handleAddIngredientField,
  handleAddProcessUrlAndText,
  handleSubmit,
  loading,
  editedRecipe,
  handleRemoveImgAndText,
  handleRemoveImage,
  handleFileUploadToFirebase,
  handleFileSelection,
  loadingProcessImgs
}) => {
  const imgInputRef = useRef(null);
  const stepImgInputRef = useRef(null);

  return (
      <form className='recipeInput_form' onSubmit={handleSubmit}>
        <div className='recipeInput_item'>
          {loading ? (
            <p>Uploading...</p>
          ) : (
            editedRecipe.imageUrl ? (
              <div
                className='recipeInput_img'
                style={{
                  backgroundImage: `url(${editedRecipe.imageUrl})`,
                }}
              >
                <button type="button" className='removeButton' onClick={handleRemoveImage}>✖️</button>
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
                  accept='.png, .jpg, .jpeg, .webp'
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
          <div className="recipeInput_processContents">
            {editedRecipe.process && editedRecipe.process.map((step, index) => (
              <div className="recipeInput_imgAndText" key={index}>
                {/* 作り方画像表示 */}
                <div
                  className="recipeInput_img"
                  onClick={() => stepImgInputRef.current.click()}
                  style={{
                    backgroundImage: `url(${step.process})`,
                  }}
                >
                </div>
                {/* 作り方テキスト表示 */}
                <textarea
                  className='textarea'
                  type="text"
                  onChange={(e) => handleAddProcessUrlAndText(index, e)}
                  value={step.text}
                ></textarea>
                {/* 画像とテキスト削除ボタン */}
                <button type="button" className='removeButton' onClick={() => handleRemoveImgAndText(index)}>✖️</button>
              </div>
            ))}
            <div className="recipeInput_imgAndText">
              {loadingProcessImgs ? (
                <div className='recipeInput_img is-input'>
                  <p>Uploading...</p>
                </div>
              ) : (
                // 作り方画像表示
                <div
                  className='recipeInput_img is-input'
                  onClick={() => stepImgInputRef.current.click()}
                  style={{
                    backgroundImage: tempImageUrl ? `url(${tempImageUrl})` : 'none',
                  }}
                >
                  {!tempImageUrl && <span>Upload</span>}
                </div>
              )}
              {/* 作り方画像入力 */}
              <input
                style={{ display: 'none' }}
                ref={stepImgInputRef}
                type='file'
                multiple
                accept='.png, .jpg, .jpeg, .webp'
                onChange={handleFileSelection}
              />
              {/* 作り方テキスト入力 */}
              <textarea
                className='textarea'
                type="text"
                onChange={(e) => setNewProcess(e.target.value)}
                value={newProcess}
              ></textarea>
            </div>
            <button className='button_additionBtn' type="button" onClick={handleAddProcessUrlAndText}>
              追加する
            </button>
          </div>
        </div>
        <button className='button_additionBtn' type="submit">
          追加する
        </button>
      </form>
  );
};

export default RecipeInputForm;
