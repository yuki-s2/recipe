import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
//▼活用する
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';
import Process from './Process';

export const RecipeDetailPage = ({
  // handleRemoveImage2,
  // handleFileUploadToFirebase,
  posts
}) => {
  const { postId } = useParams();
  const recipe = posts ? posts.find(post => post.id === postId) : null;
  const [imageUrl, setImageUrl] = useState('');
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
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [newProcess, setNewProcess] = useState('');
  const [loadingProcessImgs, setLoadingProcessImgs] = useState(false);
  const imgInputRef = useRef(null);
  const stepImgInputRef = useRef(null);

  useEffect(() => {
    if (recipe) {
      setImageUrl(recipe.imageUrl);
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
          const stepImageRef = ref(storage, detail.process);
          await deleteObject(stepImageRef);
        });
        await Promise.all(deletePromises);
      }

      await deleteDoc(doc(collection(db, "posts"), recipe.id));
      alert('削除が完了しました');
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const handleRemoveImage2 = async () => {
    if (!editedRecipe.imageUrl) return;

    const storage = getStorage();
    const imageRef = ref(storage, editedRecipe.imageUrl);

    try {
      await deleteObject(imageRef);
      setEditedRecipe({ ...editedRecipe, imageUrl: null });
      // alert('画像が削除されました');
    } catch (error) {
      console.error('画像の削除中にエラーが発生しました: ', error);
    }
  };

  const handleFileUploadToFirebase = (e) => {
    const file = e.target.files[0];

    if (file) {
      console.log('Selected file:', file); // ファイルが選択されているか確認
      const storage = getStorage();
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setLoading(true);
          console.log('Uploading...'); // アップロード中
        },
        (error) => {
          console.error("Error uploading file: ", error); // エラーハンドリング
        },
        () => {
          // アップロード完了時
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('Download URL:', downloadURL); // URLが取得できたか確認
            setImageUrl(downloadURL);
            setEditedRecipe((prevState) => ({
              ...prevState,
              imageUrl: downloadURL,
            }));
            setLoading(false);
          });
        }
      );
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
      // alert('更新が完了しました');
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
//RecipeInputPageと共通にできる？
  const handleAddProcessUrlAndText = () => {
    if (tempImageUrl && newProcess) {
      setEditedRecipe(prevState => ({
        ...prevState,
        process: [
          ...(prevState.process || []),  // デフォルト値として空の配列を設定
          { process: tempImageUrl, text: newProcess }
        ]
      }));
      setNewProcess('');  // テキストをクリア
      setTempImageUrl('');  // 一時的な画像URLをクリア
    } else {
      console.error("Image URL and text are required to add step");
    }
  };

    // 作り方画像をFirebaseに保存
    const uploadDetailImages = async (files) => {
      files = Array.from(files);
  
      const stepImgUrls = await Promise.all(
        files.map(async (file) => {
          const storage = getStorage();
          const storageRef = ref(storage, "images_processUrl/" + file.name);
          await uploadBytesResumable(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );
      return stepImgUrls;
    };
  
  const handleFileSelection = async (e) => {
    setLoadingProcessImgs(true);
    const files = Array.from(e.target.files);

    try {
      const stepImgUrls = await uploadDetailImages(files);
      if (stepImgUrls.length > 0) {
        setTempImageUrl(stepImgUrls[0]);  // 一時的なURLに保存
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setLoadingProcessImgs(false);
    }
  };

  //RecipeInputPageと共通にできる？
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
          //編集画面
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
                      <p>Uploading...</p>
                    ) : (
                      editedRecipe.imageUrl ? (
                        <div
                          className='recipeInput_img is-display'
                          style={{
                            backgroundImage: `url(${editedRecipe.imageUrl})`,
                          }}
                        >
                          <button type="button" className='removeButton' onClick={handleRemoveImage2}>✖️</button>
                        </div>
                      ) : (
                        <React.Fragment>
                          <div className='recipeInput_img' onClick={() => imgInputRef.current.click()}>
                            <span>Upload</span>
                          </div>
                          <input
                            ref={imgInputRef}
                            style={{ display: 'none' }}
                            type='file'
                            accept='.png, .jpg, .jpeg, .webp'
                            onChange={handleFileUploadToFirebase}
                          />
                        </React.Fragment>
                      )
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



                    <div className="recipeInput_item is-flow">
                      <h3 className="recipeInput_title">作り方</h3>
                      <div className="recipeInput_processContents">
                        {editedRecipe.process && editedRecipe.process.map((step, index) => (
                          <div className="recipeInput_imgAndText" key={index}>
                            {/* 作り方画像表示 */}
                            <div
                              className="recipeInput_img"
                              onClick={() => stepImgInputRef.current.click()}
                              style={{
                                backgroundImage: `url(${step.process})`,
                              }}
                            ></div>
                            {/* 画像削除ボタン */}
                            <button
                              type="button"
                              className='removeButton'
                              onClick={() => handleRemoveImage(index)}
                            >
                              ✖️
                            </button>
                            {/* 作り方テキスト表示 */}
                            <textarea
                              className='textarea'
                              type="text"
                              onChange={(e) => handleAddProcessUrlAndText(index, e)}
                              value={step.text}
                            ></textarea>
                          </div>
                        ))}
                        <div className="recipeInput_imgAndText">
                          {loadingProcessImgs ? (
                            <div className='recipeInput_img is-input'>
                              <p>Uploading...</p>
                            </div>
                          ) : (
                            // 作り方画像表示
                            <div
                              className='recipeInput_img is-input'
                              onClick={() => stepImgInputRef.current.click()}
                              style={{
                                backgroundImage: tempImageUrl ? `url(${tempImageUrl})` : 'none',
                              }}
                            >
                              {!tempImageUrl && <span>Upload</span>}
                            </div>
                          )}
                          {/* 作り方画像入力 */}
                          <input
                            style={{ display: 'none' }}
                            ref={stepImgInputRef}
                            type='file'
                            multiple
                            accept='.png, .jpg, .jpeg, .webp'
                            onChange={handleFileSelection}
                          />
                          {/* 作り方テキスト入力 */}
                          <textarea
                            className='textarea'
                            type="text"
                            onChange={(e) => setNewProcess(e.target.value)}
                            value={newProcess}
                          ></textarea>
                        </div>
                        <button className='button_additionBtn' type="button" onClick={handleAddProcessUrlAndText}>
                          追加する
                        </button>
                      </div>
                    </div>





                    <button className='button_additionBtn' onClick={handleSaveChanges}>保存</button>
                  </div>
                </div>
              </div>
            </div>
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
