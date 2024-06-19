import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db, collection, doc, deleteDoc, updateDoc } from '../../Firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const RecipeDetailPage = ({ posts }) => {
  const { postId } = useParams(); // URLパラメータからpostIdを取得
  const recipe = posts ? posts.find(post => post.id === postId) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState({
    title: recipe?.title || '',
    ingredient: Array.isArray(recipe?.ingredient) ? recipe.ingredient : [],
    text: recipe?.text || '',
    imageUrl: recipe?.imageUrl || '',
    imageDetailUrl: recipe?.images_detailUrl || [] // 修正点：初期化を追加
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  //全ての更新
  useEffect(() => {
    if (recipe) {
      setEditedRecipe({
        title: recipe.title,
        ingredient: Array.isArray(recipe.ingredient) ? recipe.ingredient : [],
        text: recipe.text,
        imageUrl: recipe.imageUrl,
        imageDetailUrl: recipe.images_detailUrl || [] // 修正点：imageDetailUrlもセット
      });
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <div>
        <div>登録されたレシピはありません</div>
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
    );
  }
  //全てを削除する
  const handleClickDelete = async () => {
    try {
      if (recipe.imageUrl) {
        const storage = getStorage();
        const imageRef = ref(storage, recipe.imageUrl);
        await deleteObject(imageRef);
      }
      await deleteDoc(doc(collection(db, "posts"), recipe.id));
      alert('削除が完了しました');
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  //全てを更新する
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      let imageUrl = editedRecipe.imageUrl;
      if (newImage) {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(collection(db, "posts"), recipe.id), { ...editedRecipe, imageUrl });
      alert('更新が完了しました');
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  //材料入力
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...editedRecipe.ingredient];
    newIngredients[index] = value;
    setEditedRecipe({ ...editedRecipe, ingredient: newIngredients });
  };

  //材料追加
  const addIngredientField = () => {
    setEditedRecipe({ ...editedRecipe, ingredient: [...editedRecipe.ingredient, ''] });
  };
  //材料削除
  const removeIngredientField = (index) => {
    const newIngredients = editedRecipe.ingredient.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, ingredient: newIngredients });
  };

  //画像を更新する
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };
  //画像を削除する
  const handleRemoveImage = () => {
    setEditedRecipe({ ...editedRecipe, imageUrl: '' });
  };
  console.log(recipe.imageUrl);
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
        {/* 編集画面 */}
        {isEditing ? (
          <div>
            {loading ? (
              <p>アップロード中...</p>
            ) : (
              <div>
                <input
                  type='file'
                  accept='.png, .jpg, .jpeg'
                  onChange={handleImageChange}
                />
                {editedRecipe.imageUrl && (
                  <div>
                    <img src={editedRecipe.imageUrl} alt="Current" style={{ width: '100px', height: '100px' }} />
                    <button onClick={handleRemoveImage}>画像を削除</button>
                  </div>
                )}
              </div>
            )}
            {/* レシピ名編集 */}
            <input
              type="text"
              value={editedRecipe.title}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, title: e.target.value })}
            />
            {/* 材料編集 */}
            {editedRecipe.ingredient.map((ingredient, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                />
                <button onClick={() => removeIngredientField(index)}>削除</button>
              </div>
            ))}
            <button onClick={addIngredientField}>材料を追加</button>
            <textarea
              value={editedRecipe.text}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, text: e.target.value })}
            />
            <button onClick={handleSaveChanges}>保存</button>
          </div>
        ) : (
          // 編集画面ではない場合こちらを表示
          <div>
            <div className="svgContent_main">
              <svg width="700px" height="500px" viewBox="0 0 700 500">
                <defs>
                  <clipPath id="clip01" clipPathUnits="objectBoundingBox">
                    <path d="M0.1,0 L0.9,0 Q1,0 1,0.1 L1,0.9 Q1,1 0.9,1 L0.1,1 Q0,1 0,0.9 L0,0.1 Q0,0 0.1,0 Z" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="svgContent_mainImg">
              {recipe.imageUrl && (
                <svg width="700px" height="500px" viewBox="0 0 700 500" style={{ clipPath: "url(#clip01)" }}>
                  <image href={recipe.imageUrl} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                </svg>
              )}
            </div>

            <div className="recipeDetail_inputItem">
              <h3 className='recipeDetail_title'>材料</h3>
              {recipe.ingredient && recipe.ingredient.map((ingredient, index) => (
                <p key={index}>{ingredient}</p>
              ))}
            </div>

            <div className="recipeDetail_inputItem">
              {recipe.imageDetailUrl && recipe.imageDetailUrl.map((imageDetailUrl, index) => (
                <div className="svgContent_subImg">
                  <div key={index}>
                    <img src={imageDetailUrl}/>
                  </div>
                </div>
              ))}
              <h3 className='recipeDetail_title'>作り方</h3>
              <p className='recipeDetail_detailsText'>{recipe.text}</p>
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
