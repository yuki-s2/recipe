import React, { Fragment, useRef } from 'react';

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
  handleFileEdited,
  loadingProcessImgs
}) => {
  const imgInputRef = useRef(null);
  const stepImgInputRef = useRef(null); // 一時的な画像表示用
  const stepImgsInputRef = useRef([]); // 作り方画像のアップロード用

  const handleStepImageClick = (index) => {
    if (stepImgsInputRef.current && stepImgsInputRef.current[index]) {
      stepImgsInputRef.current[index].click(); // refが存在するか確認してからclick()
    }
  };

  return (
    <form className='recipeInput_form' onSubmit={handleSubmit}>
      {/* レシピの画像アップロード */}
      <div className='recipeInput_item'>
        {loading ? (
          <p>Uploading...</p>
        ) : (
          editedRecipe.imageUrl ? (
            <div
              className='recipeInput_img'
              style={{ backgroundImage: `url(${editedRecipe.imageUrl})` }}
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

      {/* レシピの名前入力 */}
      <div className='recipeInput_item is-oneRow'>
        <div className="recipeInput_itemGrid">
          <h3 className="recipeInput_title">レシピの名前</h3>
          <input
            className='input'
            type="text"
            onChange={(e) => setNewRecipeName(e.target.value)}
            value={newRecipeName}
          />
        </div>
      </div>

      {/* 材料入力 */}
      <div className="recipeInput_item is-oneRow">
        <div className="recipeInput_itemGrid">
          <h3 className="recipeInput_title">材料</h3>
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

      {/* 作り方入力 */}
      <div className="recipeInput_item is-flow">
        <h3 className="recipeInput_title">作り方</h3>
        <div className="recipeInput_processContents">
          {/* 作り方リスト表示 */}
          {editedRecipe.process && editedRecipe.process.map((step, index) => (
            <div className="recipeInput_imgAndText" key={index}>
              <div className="recipeInput_itemNumber">{index + 1}.</div>
              {/* 作り方画像表示 */}
              <div
                className="recipeInput_img"
                onClick={() => handleStepImageClick(index)} // 画像をクリックしたときにアップロード
                style={{ backgroundImage: `url(${step.process})` }}
              >
                {!step.process && <span>Upload</span>}
              </div>
              {/* 作り方画像のファイル選択インプット */}
              <input
                style={{ display: 'none' }}
                ref={(el) => {
                  if (!stepImgsInputRef.current) stepImgsInputRef.current = [];
                  stepImgsInputRef.current[index] = el; // indexごとに対応
                }}
                type='file'
                accept='.png, .jpg, .jpeg, .webp'
                onChange={(e) => handleFileEdited(e, index)} // 画像の更新処理
              />
              {/* 作り方テキスト表示 */}
              <textarea
                className='textarea'
                type="text"
                onChange={(e) => handleAddProcessUrlAndText(index, e)}
                value={step.text}
              />
              {/* 画像とテキスト削除ボタン */}
              <button type="button" className='removeButton' onClick={() => handleRemoveImgAndText(index)}>✖️</button>
            </div>
          ))}

          {/* 作り方画像の一時的表示 */}
          <div className="recipeInput_imgAndText">
            {loadingProcessImgs ? (
              <div className='recipeInput_img is-input'>
                <p>Uploading...</p>
              </div>
            ) : (
              <Fragment>
                <div
                  className='recipeInput_img is-input'
                  onClick={() => stepImgInputRef.current && stepImgInputRef.current.click()}
                  style={{ backgroundImage: `url(${tempImageUrl})` }}
                >
                  {!tempImageUrl && <span>Upload</span>}
                </div>
                <input
                  style={{ display: 'none' }}
                  ref={stepImgInputRef} // 一時的画像用
                  type='file'
                  multiple
                  accept='.png, .jpg, .jpeg, .webp'
                  onChange={handleFileSelection}
                />
              </Fragment>
            )}

            {/* 作り方テキスト入力 */}
            <textarea
              className='textarea'
              type="text"
              onChange={(e) => setNewProcess(e.target.value)}
              value={newProcess}
            />
          </div>
          <button className='button_additionBtn' type="button" onClick={handleAddProcessUrlAndText} disabled={!newProcess}>
            追加する
          </button>
        </div>
      </div>

      {/* 追加ボタン */}
      <button className='button_additionBtn' type="submit" disabled={!newRecipeName || editedRecipe.process.length === 0}>
        追加する
      </button>
    </form>
  );
};

export default RecipeInputForm;
