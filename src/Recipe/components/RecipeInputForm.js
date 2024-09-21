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
  loadingProcessImgs
}) => {
  const imgInputRef = useRef(null);
  const stepImgInputRef = useRef([]); // 修正点: 空の配列として初期化
  const stepImgsInputRef = useRef([]); // 複数画像用のref

  const handleStepImageClick = (index) => {
    if (stepImgsInputRef.current && stepImgsInputRef.current[index]) {
      stepImgsInputRef.current[index].click(); // refが存在するか確認してからclick()
    }
  };

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
      <div className="recipeInput_item is-flow">
        <h3 className="recipeInput_title">作り方</h3>
        <div className="recipeInput_processContents">

          {editedRecipe.process && editedRecipe.process.map((step, index) => (
            <div className="recipeInput_imgAndText" key={index}>
              <div className="recipeInput_itemNumber">{index + 1}.</div>
              {/* map 作り方画像表示 */}
              <div
                className="recipeInput_img"
                onClick={() => handleStepImageClick(index)} // クリックしたときに画像アップロード
                style={{
                  backgroundImage: `url(${step.process})`,
                }}
              >
                {!step.process && <span>Upload</span>}
              </div>
              {/* ファイル選択インプット */}
              <input
                style={{ display: 'none' }}
                ref={(el) => {
                  if (!stepImgsInputRef.current) {
                    stepImgsInputRef.current = [];
                  }
                  stepImgsInputRef.current[index] = el; // indexごとに対応
                }}
                type='file'
                accept='.png, .jpg, .jpeg, .webp'
                onChange={(e) => handleFileSelection(e, index)}
              />
              {/* 作り方テキスト表示 */}
              <textarea
                className='textarea'
                type="text"
                onChange={(e) => handleAddProcessUrlAndText(index, e)}
                value={step.text}>
              </textarea>
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
              <Fragment>
                {/* 作り方画像 一時的に表示 */}
                <div
                  className='recipeInput_img is-input'
                  onClick={() => stepImgInputRef.current && stepImgInputRef.current.click()} // 修正点
                  style={{
                    backgroundImage: `url(${tempImageUrl})`,
                  }}>
                  {!tempImageUrl && <span>Upload</span>}
                </div>
                <input
                  style={{ display: 'none' }}
                  ref={stepImgInputRef}
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
            ></textarea>
          </div>
          <button className='button_additionBtn' type="button" onClick={handleAddProcessUrlAndText} disabled={!newProcess}>
            追加する
          </button>
        </div>
      </div>
      <button className='button_additionBtn' type="submit" disabled={!newRecipeName || editedRecipe.process.length === 0}>
        追加する
      </button>
    </form>
  );
};

export default RecipeInputForm;
