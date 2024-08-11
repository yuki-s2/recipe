// RecipeInputPage.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import SignOut from './SignOut';
import RecipeInputForm from './RecipeInputForm';

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
    images_detailUrl: []
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
        images_detailUrl: recipe?.images_detailUrl || []
      });
    }
  }, [recipe]);

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
            // 状態の更新
            setImageUrl(downloadURL);
            setEditedRecipe(prevState => ({
              ...prevState,
              imageUrl: downloadURL
            }));
            setLoading(false);
            setUploaded(true);
          });
        }
      );
    }
  };  

  const handleAdditionalInfoChange = (index, event) => {
    const values = [...newIngredients];
    values[index] = event.target.value;
    setNewIngredients(values);
  };

  const handleAddIngredientField = () => {
    setNewIngredients([...newIngredients, '']);
  };

  const uploadDetailImages = async (files) => {
    // filesを配列に変換
    files = Array.from(files);

    const detailImgUrls = await Promise.all(
      files.map(async (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images_detailUrl/" + file.name);
        await uploadBytesResumable(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );
    return detailImgUrls;
  };

  const handleFileSelection = async (e) => {
    setLoadingDetailImgs(true);
    const files = Array.from(e.target.files); // FileListをArrayに変換
    try {
      const detailImgUrls = await uploadDetailImages(files);
      const updatedDetailImgs = [...editedRecipe.images_detailUrl, ...detailImgUrls];
      setEditedRecipe({ ...editedRecipe, images_detailUrl: updatedDetailImgs });

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), {
          images_detailUrl: updatedDetailImgs
        });
      }
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
      const detailImgUrls = await uploadDetailImages(newDetailImgs);

      const newRecipeData = {
        title: newRecipeName,
        text: newDetail,
        ingredient: newIngredients,
        imageUrl: imageUrl,
        images_detailUrl: [...editedRecipe.images_detailUrl, ...detailImgUrls],
      };

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), newRecipeData);
      } else {
        await addDoc(collection(db, "posts"), newRecipeData);
      }

      setNewRecipeName('');
      setNewDetail('');
      setNewIngredients(['']);
      setImageUrl('');
      setNewDetailImgs([]);
      setEditedRecipe({ imageUrl: '', images_detailUrl: [] });
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
      const imageRef = ref(storage, editedRecipe.images_detailUrl[index]);
      await deleteObject(imageRef);

      const updatedDetailImgs = editedRecipe.images_detailUrl.filter((_, i) => i !== index);
      setEditedRecipe({ ...editedRecipe, images_detailUrl: updatedDetailImgs });

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), {
          images_detailUrl: updatedDetailImgs
        });
      }
    } catch (error) {
      console.error("Error removing image: ", error);
    }
  };

  const handleRemoveImage2 = async () => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, editedRecipe.imageUrl);
      await deleteObject(imageRef);
  
      // editedRecipe の imageUrl を空にする
      setEditedRecipe(prevState => ({ ...prevState, imageUrl: '' }));
  
      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), { imageUrl: '' });
      }
    } catch (error) {
      console.error("Error removing image: ", error);
    }
  };
  
  console.log(editedRecipe.imageUrl + "画像");

  return (
    <div className="recipeInput_body">
      <div className='inner'>
        <div className="recipeInput_wrap">
          <div className="recipeInput_head">
            <div className="add">add new recipe</div>
            <div className="recipeInput_menu">
              <button><img className="recipeInput_edit" src="" alt="編集" /></button>
              <button><img className="recipeInput_delete" src="" alt="削除" /></button>
            </div>
          </div>
          <div className="recipeInput_contents">
            <RecipeInputForm
              newRecipeName={newRecipeName}
              setNewRecipeName={setNewRecipeName}
              newDetail={newDetail}
              setNewDetail={setNewDetail}
              newIngredients={newIngredients}
              handleAdditionalInfoChange={handleAdditionalInfoChange}
              handleAddIngredientField={handleAddIngredientField}
              handleSubmit={handleSubmit}
              loading={loading}
              isUploaded={isUploaded}
              editedRecipe={editedRecipe}
              handleRemoveImage={handleRemoveImage}
              handleRemoveImage2={handleRemoveImage2}
              uploadDetailImages={uploadDetailImages}
              handleFileUploadToFirebase={handleFileUploadToFirebase}
              handleFileSelection={handleFileSelection}
              loadingDetailImgs={loadingDetailImgs}
            />
          </div>
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

export default RecipeInputPage;