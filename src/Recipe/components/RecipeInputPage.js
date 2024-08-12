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
      setNewDetail('');
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
            setImageUrl(downloadURL);
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

  const handleAddDetailUrlAndText = () => {
    if (imageUrl && newDetail) {
      setEditedRecipe(prevState => ({
        ...prevState,
        images_detailUrl: [...prevState.images_detailUrl, { images_detailUrl: imageUrl, text: newDetail }]
      }));
      setNewDetail(''); // テキストをクリア
      setImageUrl('');  // 画像URLをクリア
      setUploaded(false);  // アップロード状態をリセット
    } else {
      console.error("Image URL and text are required to add detail");
    }
  };

  const uploadDetailImages = async (files) => {
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
    const files = Array.from(e.target.files);
    try {
      const detailImgUrls = await uploadDetailImages(files);
      setImageUrl(detailImgUrls[0]); // 1つの画像URLだけを保存
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
      const newRecipeData = {
        title: newRecipeName,
        text: newDetail,
        ingredient: newIngredients,
        imageUrl: imageUrl,
        images_detailUrl: editedRecipe.images_detailUrl,
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
      const imageRef = ref(storage, editedRecipe.images_detailUrl[index].images_detailUrl);
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

      setEditedRecipe(prevState => ({ ...prevState, imageUrl: '' }));

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), { imageUrl: '' });
      }
    } catch (error) {
      console.error("Error removing image: ", error);
    }
  };

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
              handleAddDetailUrlAndText={handleAddDetailUrlAndText}
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
