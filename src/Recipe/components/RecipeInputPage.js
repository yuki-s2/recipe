import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, deleteObject } from "firebase/storage";
import SignOut from './SignOut.js';

export const RecipeInputPage = ({ posts }) => {
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newIngredients, setNewIngredients] = useState(['']); // 初期の材料入力フィールドを1つ持つ
  const [loading, setLoading] = useState(false);
  const [loadingDetailImgs, setLoadingDetailImgs] = useState(false); // 新しい状態を追加
  const [isUploaded, setUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [newDetailImgs, setNewDetailImgs] = useState([]);
  const [editedRecipe, setEditedRecipe] = useState({
    imageUrl: '',
    detailImgs: []
  });

  const { postId } = useParams(); // URLパラメータからpostIdを取得
  const recipe = posts ? posts.find(post => post.id === postId) : null;

  useEffect(() => {
    if (recipe) {
      setEditedRecipe({
        imageUrl: recipe.imageUrl,
        detailImgs: recipe.detailImgs || []
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
    setNewIngredients([...newIngredients, '']); // 新しい材料入力フィールドを追加する
  };

  const handleAddDetailImgField = async () => {
    setLoadingDetailImgs(true); // 画像アップロード用のloadingを設定
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
      setLoadingDetailImgs(false); // 画像アップロード用のloadingを解除
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const detailImgUrls = await Promise.all(
      newDetailImgs.map(async (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + file.name);
        await uploadBytesResumable(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );

    if (recipe) {
      // 既存レシピの更新
      await updateDoc(doc(db, "posts", recipe.id), {
        title: newRecipeName,
        text: newDetail,
        ingredient: newIngredients,
        imageUrl: imageUrl,
        detailImgs: detailImgUrls,
      });
    } else {
      // 新規レシピの追加
      await addDoc(collection(db, "posts"), {
        title: newRecipeName,
        text: newDetail,
        ingredient: newIngredients,
        imageUrl: imageUrl,
        detailImgs: detailImgUrls,
      });
    }

    if (!newRecipeName || !newDetail) {
      return;
    }

    setNewRecipeName('');
    setNewDetail('');
    setNewIngredients(['']);
    setImageUrl('');
    setNewDetailImgs([]);
    setUploaded(false);
  };

  const handleRemoveImage = async (index) => {
    const storage = getStorage();
    const imageRef = ref(storage, editedRecipe.detailImgs[index]);
    await deleteObject(imageRef);

    const updatedDetailImgs = editedRecipe.detailImgs.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, detailImgs: updatedDetailImgs });

    if (recipe) {
      await updateDoc(doc(db, "posts", recipe.id), {
        detailImgs: updatedDetailImgs
      });
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
                <input type="title" onChange={(e) => setNewRecipeName(e.target.value)} value={newRecipeName} />
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
                {editedRecipe.detailImgs.map((detailImg, index) => (
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
                  <p>詳細画像をアップロード中...</p> // 新しいloading状態の表示
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
    </div >
  );
};
