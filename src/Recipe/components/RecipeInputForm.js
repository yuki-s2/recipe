import React from 'react';

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
  handleFileUploadToFirebase,
  handleFileSelection,
  loadingDetailImgs
}) => (
  <div className="recipeInput_container">
    <h2 className='page_ttl'>新しいレシピを追加する</h2>
    <form className='recipeInput_form' onSubmit={handleSubmit}>
      <div>
        {loading ? (
          <p>アップロード中...</p>
        ) : isUploaded ? (
          <>
            <p>アップロード完了</p>
            {editedRecipe.imageUrl && (
              <div>
                <img src={editedRecipe.imageUrl} alt="Current" style={{ width: '100px', height: '100px' }} />
                <button onClick={() => handleRemoveImage(0)}>画像を削除</button>
              </div>
            )}
          </>
        ) : (
          <input
            type='file'
            accept='.png, .jpg, .jpeg'
            onChange={handleFileUploadToFirebase}
          />
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
        <div className="recipeInput_item">
          <div className="input_imgBtn">
            <button>作り方の画像を追加する</button>
          </div>
          <div className="recipeInput_wrap">
            <div className="recipeInput_head">
              <div className="add">add</div>
            </div>
            <div className="recipeInput_contents is-img">
              <div className="recipeInput_img">
                {editedRecipe.images_detailUrl.map((images_detailUrl, index) => (
                  <div key={index}>
                    <img src={images_detailUrl} alt="Recipe Detail" style={{ width: '100px', height: '100px' }} />
                    <button type="button" onClick={() => handleRemoveImage(index)}>画像を削除</button>
                  </div>
                ))}
                <input
                  className='input_img'
                  type='file'
                  multiple
                  accept='.png, .jpg, .jpeg, .webp'
                  onChange={handleFileSelection}
                />
                <button><img className="recipeInput_delete" src="" alt="削除" /></button>
              </div>
              {loadingDetailImgs ? (
                <p>詳細画像をアップロード中...</p>
              ) : (
                <p>画像をアップロード</p>
              )}
            </div>
          </div>
        </div>
        <div className="recipeInput_item">
          <h3 className="recipeInput_title">作り方</h3>
          <input className='input' type="text" onChange={(e) => setNewDetail(e.target.value)} value={newDetail} />
        </div>
      </div>
      <button className='button_additionBtn' type="submit">追加する</button>
    </form>
  </div>
);

export default RecipeInputForm;