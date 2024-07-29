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
          <div className="recipeInput_wrap">
            <div className="recipeInput_head">
              <div className="add">add</div>
            </div>
            <div className="recipeInput_contents is-img">
            {editedRecipe.images_detailUrl.map((images_detailUrl, index) => (
                <div className="recipeInput_img" key={index} style={{
                  width: '30%',
                  aspectRatio: '1/1',
                  border: '2px dashed #ccc',
                  cursor: 'pointer',
                  backgroundImage: `url(${images_detailUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}>
                  <button type="button" onClick={() => handleRemoveImage(index)} style={{ position: 'absolute', top: 0, right: 0 }}>画像を削除</button>
                </div>
              ))}
              <div className="recipeInput_img" onClick={() => document.getElementById('detailImgInput').click()} style={{
                width: '30%',
                aspectRatio: '1/1',
                border: '2px dashed #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                // backgroundImage: editedRecipe.images_detailUrl.length > 0 ? `url(${editedRecipe.images_detailUrl[0]})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
                 <span>クリックして画像をアップロード</span>
              </div>
              <input
                id='detailImgInput'
                className='input_img'
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
      <button className='button_additionBtn' type="submit">追加する</button>
    </form>
  </div>
);

export default RecipeInputForm;
