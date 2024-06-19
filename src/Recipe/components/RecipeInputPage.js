import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import SignOut from './SignOut.js';

export const RecipeInputPage = ({ posts }) => {
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newIngredients, setNewIngredients] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [loadingDetailImgs, setLoadingDetailImgs] = useState(false);
  const [isUploaded, setUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [newDetailImgs, setNewDetailImgs] = useState([]);
  const [editedRecipe, setEditedRecipe] = useState({
    imageUrl: '',
    imageDetailUrl: []
  });

  const { postId } = useParams();
  const recipe = posts ? posts.find(post => post.id === postId) : null;

  useEffect(() => {
    if (recipe) {
      setNewRecipeName(recipe.title);
      setNewDetail(recipe.text);
      setNewIngredients(recipe.ingredient);
      setImageUrl(recipe.imageUrl);
      setEditedRecipe({
        imageUrl: recipe.imageUrl,
        imageDetailUrl: recipe.images_detailUrl || []
      });
    }
  }, [recipe]);

  const handleAdditionalInfoChange = (index, event) => {
    const values = [...newIngredients];
    values[index] = event.target.value;
    setNewIngredients(values);
  };

  const handleFileUploadToFirebase = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setLoading(true);
        },
        (error) => {
          console.error("Error uploading file: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            setLoading(false);
            setUploaded(true);
          });
        }
      );
    }
  };

  const handleAddIngredientField = () => {
    setNewIngredients([...newIngredients, '']);
  };

  const handleAddDetailImgField = async () => {
    setLoadingDetailImgs(true);
    try {
      const detailImgUrls = await Promise.all(
        newDetailImgs.map(async (file) => {
          const storage = getStorage();
          const storageRef = ref(storage, "images/" + file.name);
          await uploadBytesResumable(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      const updatedDetailImgs = [...editedRecipe.detailImgs, ...detailImgUrls];
      setEditedRecipe({ ...editedRecipe, detailImgs: updatedDetailImgs });

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), {
          detailImgs: updatedDetailImgs
        });
      }
      setNewDetailImgs([]);
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setLoadingDetailImgs(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const detailImgUrls = await Promise.all(
        newDetailImgs.map(async (file) => {
          const storage = getStorage();
          const storageRef = ref(storage, "images/" + file.name);
          await uploadBytesResumable(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), {
          title: newRecipeName,
          text: newDetail,
          ingredient: newIngredients,
          imageUrl: imageUrl,
          imageDetailUrl: [...editedRecipe.imageDetailUrl, ...detailImgUrls],
        });
      } else {
        await addDoc(collection(db, "posts"), {
          title: newRecipeName,
          text: newDetail,
          ingredient: newIngredients,
          imageUrl: imageUrl,
          imageDetailUrl: detailImgUrls,
        });
      }

      setNewRecipeName('');
      setNewDetail('');
      setNewIngredients(['']);
      setImageUrl('');
      setNewDetailImgs([]);
      setEditedRecipe({ imageUrl: '', imageDetailUrl: [] });
      setUploaded(false);
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, editedRecipe.imageDetailUrl[index]);
      await deleteObject(imageRef);

      const updatedDetailImgs = editedRecipe.imageDetailUrl.filter((_, i) => i !== index);
      setEditedRecipe({ ...editedRecipe, imageDetailUrl: updatedDetailImgs });

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), {
          imageDetailUrl: updatedDetailImgs
        });
      }
    } catch (error) {
      console.error("Error removing image: ", error);
    }
  };

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    setNewDetailImgs(files);
  };

  return (
    <div className="recipeInput_body">
      <div className='inner'>
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
        <div className="recipeInput_wrap">
          <div className="recipeInput_ttl">
            <h2 className='page_ttl'>新しいレシピを追加する</h2>
          </div>
          <form className='recipeInput_form recipeInput_container' onSubmit={handleSubmit}>
            <div>
              <div className='recipeInput_item'>
                <div className="recipeInput_title">レシピの名前</div>
                <input type="text" onChange={(e) => setNewRecipeName(e.target.value)} value={newRecipeName} />
              </div>
              <div className="recipeInput_item recipeInput_ingredient">
                <div className="recipeInput_title">材料</div>
                {newIngredients.map((ingredient, index) => (
                  <input
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
              <div className="recipeInput_item recipeInput_ingredient">
                <div className="recipeInput_title">作り方の画像</div>
                {editedRecipe.imageDetailUrl.map((detailImg, index) => (
                  <div key={index}>
                    <img src={detailImg} alt="Recipe Detail" style={{ width: '100px', height: '100px' }} />
                    <button type="button" onClick={() => handleRemoveImage(index)}>画像を削除</button>
                  </div>
                ))}
                <input
                  type='file'
                  multiple
                  accept='.png, .jpg, .jpeg'
                  onChange={handleFileSelection}
                />
                {loadingDetailImgs ? (
                  <p>詳細画像をアップロード中...</p>
                ) : (
                  <button className='button_additionBtn' type="button" onClick={handleAddDetailImgField}>
                    画像をアップロード
                  </button>
                )}
              </div>
              <div className="recipeInput_item">
                <h3 className="recipeInput_title">作り方</h3>
                <input type="text" onChange={(e) => setNewDetail(e.target.value)} value={newDetail} />
              </div>
            </div>
            <button className='button_additionBtn' type="submit">追加する</button>
          </form>
        </div>
        <div className="btn_container">
          <Link to="/RecipeListPage">
            <div className='btn_link'>追加されたレシピ一覧へ</div>
          </Link>
        </div>
        <SignOut />
      </div>
    </div>
  );
};
