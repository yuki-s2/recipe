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
    images_detailUrl: [] // 名前変更？
  });

  //現在のルートパスからパラメータを取得
  const { postId } = useParams();
  //取得したパラメーターと同じidのレシピを探す
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

  //firebaseにトップ画像をアップロード
  const handleFileUploadToFirebase = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      // Firebase Storage の参照を取得
      const storage = getStorage();
      const storageRef = ref(storage, "images/" + file.name);
      //アップロードの進行状況をリアルタイムで監視できるため、進行状況バーを表示したりすることができる
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        //snapshot はアップロードの現在の状態を示すオブジェクト
        (snapshot) => {
          setLoading(true);
        },
        (error) => {
          console.error("Error uploading file: ", error);
        },
        () => {
          //アップロードしたファイルのダウンロードURLを取得
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            setLoading(false);
            setUploaded(true);
          });
        }
      );
    }
  };

  //材料フィールドを追加
  const handleAdditionalInfoChange = (index, event) => {
    const values = [...newIngredients];
    values[index] = event.target.value;
    setNewIngredients(values);
  };

  //材料を追加
  const handleAddIngredientField = () => {
    setNewIngredients([...newIngredients, '']);
  };

  // 詳細画像をアップロードする共通関数
  const uploadDetailImages = async (files) => {
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

  // 詳細画像をアップロード
  const handleFileSelection = async (e) => {
    setLoadingDetailImgs(true);
    const files = Array.from(e.target.files);
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

      //recipeがあるなら(更新)
      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), {
          title: newRecipeName,
          text: newDetail,
          ingredient: newIngredients,
          imageUrl: imageUrl,
          images_detailUrl: [...editedRecipe.images_detailUrl, ...detailImgUrls],
        });
      } else {
        //新しいrecipeになる情報を追加
        await addDoc(collection(db, "posts"), {
          title: newRecipeName,
          text: newDetail,
          ingredient: newIngredients,
          imageUrl: imageUrl,
          images_detailUrl: detailImgUrls,
        });
      }
      //フォームを空にする
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

  //画像を削除
  const handleRemoveImage = async (index) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, editedRecipe.images_detailUrl[index]);
      await deleteObject(imageRef);

      //editedRecipe は現在編集中のレシピオブジェクト
      //_ は配列の要素（詳細画像のURL）、i はその要素のインデックス
      //images_detailUrl 配列の中で、指定された index に一致する要素を除外した新しい配列 updatedDetailImgs を作成
      const updatedDetailImgs = editedRecipe.images_detailUrl.filter((_, i) => i !== index);
      setEditedRecipe({ ...editedRecipe, images_detailUrl: updatedDetailImgs });
      console.log(updatedDetailImgs + "テスト");

      if (recipe) {
        await updateDoc(doc(db, "posts", recipe.id), {
          images_detailUrl: updatedDetailImgs
        });
      }
    } catch (error) {
      console.error("Error removing image: ", error);
    }
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
            className='input'
            type='file'
            accept='.png, .jpg, .jpeg'
            onChange={handleFileUploadToFirebase}
          />
        )}
        <div className="recipeInput_wrap">
          <div className="recipeInput_head">
            <div className="add">add</div>
            <div className="recipeInput_menu">
              <button><img className="recipeInput_edit" src="" alt="編集" /></button>
              <button><img className="recipeInput_delete" src="" alt="削除" /></button>
            </div>
          </div>
          <div className="recipeInput_contents">
            <div className="recipeInput_container">
              <h2 className='page_ttl'>新しいレシピを追加する</h2>
              <form className='recipeInput_form' onSubmit={handleSubmit}>
                <div>
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
                    <div className="recipeInput_title">作り方の画像</div>
                    {editedRecipe.images_detailUrl.map((images_detailUrl, index) => (
                      <div key={index}>
                        <img src={images_detailUrl} alt="Recipe Detail" style={{ width: '100px', height: '100px' }} />
                        <button type="button" onClick={() => handleRemoveImage(index)}>画像を削除</button>
                      </div>
                    ))}
                    <div className="recipeInput_wrap">
                      <div className="recipeInput_head">
                        <div className="add">add</div>
                      </div>
                      <div className="recipeInput_contents">
                      <div className="recipeInput_menu">
                          <input
                            className='input_img'
                            type='file'
                            multiple
                            accept='.png, .jpg, .jpeg'
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
