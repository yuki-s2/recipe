import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Process from './Process';

export const RecipeDetailPage = ({ posts }) => {
  const { postId } = useParams();
  const recipe = posts ? posts.find(post => post.id === postId) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState({
    title: '',
    ingredient: [],
    text: '',
    imageUrl: '',
    process: []
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
        process: recipe.process || []
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

  const handleClickDelete = async () => {
    try {
      const storage = getStorage();

      if (recipe.imageUrl) {
        const imageRef = ref(storage, recipe.imageUrl);
        await deleteObject(imageRef);
      }

      if (recipe.process && recipe.process.length > 0) {
        const deletePromises = recipe.process.map(async (detail) => {
          const detailImageRef = ref(storage, detail.process);
          await deleteObject(detailImageRef);
        });
        await Promise.all(deletePromises);
      }

      await deleteDoc(doc(collection(db, "posts"), recipe.id));
      alert('削除が完了しました');
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

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

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...editedRecipe.ingredient];
    newIngredients[index] = value;
    setEditedRecipe({ ...editedRecipe, ingredient: newIngredients });
  };

  const addIngredientField = () => {
    setEditedRecipe({ ...editedRecipe, ingredient: [...editedRecipe.ingredient, ''] });
  };

  const removeIngredientField = (index) => {
    const newIngredients = editedRecipe.ingredient.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, ingredient: newIngredients });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setEditedRecipe({ ...editedRecipe, imageUrl: '' });
  };

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
        {isEditing ? (
          <div className="recipeInput_body">
            {/* 編集画面 */}
          </div>
        ) : (
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
              {recipe.process && recipe.process.length > 0 && (
                <Process steps={recipe.process} />
              )}
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

export default RecipeDetailPage;
