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
  const [imageUrl, setImageUrl] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [editedRecipe, setEditedRecipe] = useState({
    imageUrl: '',
    processImg: []
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
        process: recipe?.process || []
      });
    }
  }, [recipe]);

  //レシピ画像 firebase保存
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
          // Firebaseの画像URLをセット
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);  // imageUrlに設定
            setEditedRecipe((prevState) => ({
              ...prevState,
              imageUrl: downloadURL,  // これでeditedRecipe.imageUrlにセット 重要！！！
            }));
            setLoading(false);
          });
        }
      );
    }
  };
  //レシピ画像 firebase保存




  const handleAdditionalInfoChange = (index, event) => {
    const values = [...newIngredients];
    values[index] = event.target.value;
    setNewIngredients(values);
  };

  const handleAddIngredientField = () => {
    setNewIngredients([...newIngredients, '']);
  };

  //作り方画像 firebase 保存
  const uploadDetailImages = async (files) => {
    files = Array.from(files);

    const detailImgUrls = await Promise.all(
      files.map(async (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images_processUrl/" + file.name);
        await uploadBytesResumable(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );
    return detailImgUrls;
  };
  //作り方画像 firebase 保存

  //作り方画像 firebase 保存
  const handleFileSelection = async (e) => {
    //ローディング始
    setLoadingDetailImgs(true);
    const files = Array.from(e.target.files);

    try {
      const detailImgUrls = await uploadDetailImages(files);
      if (detailImgUrls.length > 0) {
        setTempImageUrl(detailImgUrls[0]);  // 一時的なURLに保存
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      //ローディング終
      setLoadingDetailImgs(false);
    }
  };
  //作り方画像 firebase 保存

  //作り方の画像とテキストをeditedRecipeへ
  const handleAddDetailUrlAndText = () => {
    if (tempImageUrl && newDetail) {
      setEditedRecipe(prevState => ({
        ...prevState,
        process: [
          ...(prevState.process || []),  // デフォルト値として空の配列を設定
          { process: tempImageUrl, text: newDetail }
        ]
      }));
      setNewDetail('');  // テキストをクリア
      setTempImageUrl('');  // 一時的な画像URLをクリア
    } else {
      console.error("Image URL and text are required to add detail");
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
        process: editedRecipe.process,
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
      setEditedRecipe({ imageUrl: '', process: [] });
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, editedRecipe.process[index].processImg);
      await deleteObject(imageRef);

      const updatedDetailImgs = editedRecipe.process.filter((_, i) => i !== index);
      setEditedRecipe({ ...editedRecipe, process: updatedDetailImgs });

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), {
          process: updatedDetailImgs
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
              tempImageUrl={tempImageUrl}
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
              // isUploaded={isUploaded}
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
