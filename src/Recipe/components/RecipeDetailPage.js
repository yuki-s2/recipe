import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ProcessImg from './ProcessImg';

export const RecipeDetailPage = ({ posts }) => {
  const { postId } = useParams(); // URLパラメータからpostIdを取得
  const recipe = posts ? posts.find(post => post.id === postId) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState({
    title: '',
    ingredient: [],
    text: '',
    imageUrl: '',
    images_detailUrl: []
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipe) {
      setEditedRecipe({
        title: recipe.title,
        ingredient: Array.isArray(recipe.ingredient) ? recipe.ingredient : [],
        text: recipe.text,
        imageUrl: recipe.imageUrl,
        images_detailUrl: recipe.images_detailUrl || []
      });
    }
  }, [recipe]);

  // もしrecipeがnullの場合は「レシピが見つかりません」のメッセージを表示
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

  // 以下、レシピが存在する場合の処理
  const handleClickDelete = async () => {
    try {
      const storage = getStorage();
  
      // メイン画像の削除
      if (recipe.imageUrl) {
        const imageRef = ref(storage, recipe.imageUrl);
        await deleteObject(imageRef);
      }
  
      // 詳細画像の削除
      if (recipe.images_detailUrl && recipe.images_detailUrl.length > 0) {
        const deletePromises = recipe.images_detailUrl.map(async (url) => {
          const detailImageRef = ref(storage, url);
          await deleteObject(detailImageRef);
        });
        await Promise.all(deletePromises);
      }
  
      // Firestore ドキュメントの削除
      await deleteDoc(doc(collection(db, "posts"), recipe.id));
      alert('削除が完了しました');
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  

  // 全てを更新する
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

  // 材料入力
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...editedRecipe.ingredient];
    newIngredients[index] = value;
    setEditedRecipe({ ...editedRecipe, ingredient: newIngredients });
  };

  // 材料追加
  const addIngredientField = () => {
    setEditedRecipe({ ...editedRecipe, ingredient: [...editedRecipe.ingredient, ''] });
  };

  // 材料削除
  const removeIngredientField = (index) => {
    const newIngredients = editedRecipe.ingredient.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, ingredient: newIngredients });
  };

  // 画像を更新する
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // 画像を削除する
  const handleRemoveImage = () => {
    setEditedRecipe({ ...editedRecipe, imageUrl: '' });
  };
  // console.log(editedRecipe.imageUrl + "画像");

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
          <div className="recipeInput_body">
            <div className='inner'>
              <div className="recipeInput_wrap">
                <div className="recipeInput_head">
                  <div className="">編集</div>
                </div>
                <div className="recipeInput_contents">
                  <div className="recipeInput_container">
                    <h2 className='page_ttl'>レシピを編集する</h2>
                    {loading ? (
                      <p>アップロード中...</p>
                    ) : (
                      <div>
                        <input
                          type='file'
                          accept='.png, .jpg, .jpeg, .webp'
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
                    <div className='recipeInput_item'>
                      <div className="recipeInput_title">レシピの名前</div>
                      <input
                        className='input'
                        type="text"
                        value={editedRecipe.title}
                        onChange={(e) => setEditedRecipe({ ...editedRecipe, title: e.target.value })}
                      />
                    </div>
                    {/* 材料編集 */}
                    <div className="recipeInput_item recipeInput_ingredient">
                      <div className="recipeInput_title">材料</div>
                      {editedRecipe.ingredient.map((ingredient, index) => (
                        <div key={index}>
                          <input
                            className='input'
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                          />
                          <button onClick={() => removeIngredientField(index)}>削除</button>
                        </div>
                      ))}
                      <button className='button_additionBtn' onClick={addIngredientField}>材料を追加</button>
                    </div>
                    <div className="recipeInput_item">
                      <h3 className="recipeInput_title">作り方</h3>
                      <textarea
                        className='input'
                        value={editedRecipe.text}
                        onChange={(e) => setEditedRecipe({ ...editedRecipe, text: e.target.value })}
                      />
                    </div>
                    <button className='button_additionBtn' onClick={handleSaveChanges}>保存</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 編集画面ではない場合こちらを表示
          <div>
            <div className="svgContent_main">
              <svg>
                <defs>
                  <clipPath id="clip01" clipPathUnits="objectBoundingBox">
                    <path d="M0.1,0 L0.9,0 Q1,0 1,0.1 L1,0.9 Q1,1 0.9,1 L0.1,1 Q0,1 0,0.9 L0,0.1 Q0,0 0.1,0 Z" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="recipeDetail_inputItem">
              <div className="svgContent_mainImg">
                {recipe.imageUrl && (
                  <svg width="100%" height="100%" style={{ clipPath: "url(#clip01)" }}>
                    <image href={recipe.imageUrl} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                  </svg>
                )}
              </div>
            </div>

            <div className="recipeDetail_inputItem ingredient">
              <h3 className='recipeDetail_title'>材料</h3>
              <div className="recipeDetail_ingredients">
              {recipe.ingredient && recipe.ingredient.map((ingredient, index) => (
                <p key={index}>{ingredient}</p>
              ))}
            </div>
            </div>

            <div className="recipeDetail_inputItem">
              <h3 className='recipeDetail_title'>作り方</h3>
              {recipe.images_detailUrl && (
                <ProcessImg images={recipe.images_detailUrl} />
              )}
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
