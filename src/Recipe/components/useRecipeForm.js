//レシピを追加・更新するのに使うHooks
import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { updateDoc, doc, collection, addDoc } from "firebase/firestore";
import { db } from '../../Firebase';

export const useRecipeForm = (initialRecipe = null) => {
  const [newRecipeName, setNewRecipeName] = useState(initialRecipe?.title || '');
  const [newProcess, setNewProcess] = useState('');
  const [newIngredients, setNewIngredients] = useState(initialRecipe?.ingredient || ['']);
  const [loading, setLoading] = useState(false);
  const [loadingProcessImgs, setLoadingProcessImgs] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialRecipe?.imageUrl || '');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [editedRecipe, setEditedRecipe] = useState({
    imageUrl: initialRecipe?.imageUrl || '',
    process: initialRecipe?.process || []
  })

  const handleAdditionalInfoChange = (index, event) => {
    const values = [...newIngredients];
    values[index] = event.target.value;
    setNewIngredients(values);
  };
  
//材料追加
  const handleAddIngredientField = () => {
    setNewIngredients([...newIngredients, '']);
  };

  //handleFileSelection で使用
  const uploadDetailImages = async (files) => {
    files = Array.from(files);
//作り方画像をfirebaseに保存
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





  //作り方画像 一時的 をアップロード 
const handleFileSelection = async (e, index) => {
  setLoadingProcessImgs(true);
  const files = Array.from(e.target.files);

  try {
    const stepImgUrls = await uploadDetailImages(files);
    if (stepImgUrls.length > 0) {
      setTempImageUrl(stepImgUrls[0]); // アップロードされた画像[0]を一時的に表示

      setEditedRecipe(prevState => {
        const updatedProcess = [...prevState.process];
        
        // indexに対応するステップが存在しない場合、新しいオブジェクトを作成
        if (!updatedProcess[index]) {
          updatedProcess[index] = { process: '', text: '' };
        }

        updatedProcess[index].process = stepImgUrls[0];  // インデックスに対応するステップの画像を更新
        return { ...prevState, process: updatedProcess };
      });
    }
  } catch (error) {
    console.error("Error uploading process image: ", error);
  } finally {
    setLoadingProcessImgs(false);
  }
};

  //作り方画像をアップロード 
const handleFileEdited = async (e, index) => {
  const files = Array.from(e.target.files);
  try {
    const stepImgUrls = await uploadDetailImages(files);
    if (stepImgUrls.length > 0) {
      setEditedRecipe(prevState => {
        const updatedProcess = [...prevState.process];

        if (!updatedProcess[index]) {
          updatedProcess[index] = { process: '', text: '' };
        }

        updatedProcess[index].process = stepImgUrls[0];

        return { ...prevState, process: updatedProcess };
      });
    }
  } catch (error) {
    console.error("Error uploading process image: ", error);
  } finally {
    setLoadingProcessImgs(false);
  }
};

const handleTextEdited = (index, event) => {
  const updatedText = event.target.value;
  
  setEditedRecipe(prevState => {
    const updatedProcess = [...prevState.process];

    // 更新対象のステップが存在しない場合、空のオブジェクトを作って初期化
    if (!updatedProcess[index]) {
      updatedProcess[index] = { process: '', text: '' };
    }

    updatedProcess[index].text = updatedText;  // 該当のインデックスのテキストを更新

    return { ...prevState, process: updatedProcess };
  });
};

//作り方画像とテキストを追加する
  const handleAddProcessUrlAndText = () => {
    if (newProcess) {
      setEditedRecipe(prevState => ({
        ...prevState,
        process: [
          ...(prevState.process || []),
          { process: tempImageUrl || '', text: newProcess }
        ]
      }));
      setNewProcess('');
      setTempImageUrl('');
    } else {
      console.error("Text is required to add step");
    }
  };

  const handleFileUploadToFirebase = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => setLoading(true),
        (error) => console.error("Error uploading file: ", error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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

  const handleRemoveImgAndText = async (index) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, editedRecipe.process[index].process);

      const updatedProcess = editedRecipe.process.filter((_, i) => i !== index);
      setEditedRecipe({ ...editedRecipe, process: updatedProcess });
      if (imageRef) {
        await deleteObject(imageRef);
        };
      
      if (initialRecipe) {
        await updateDoc(doc(db, "posts", initialRecipe.id), {
          process: updatedProcess
        });
      }
    } catch (error) {
      console.error("Error removing process step: ", error);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, editedRecipe.imageUrl);
      await deleteObject(imageRef);

      setEditedRecipe(prevState => ({ ...prevState, imageUrl: '' }));

      if (initialRecipe) {
        await updateDoc(doc(db, "posts", initialRecipe.id), { imageUrl: '' });
      }
    } catch (error) {
      console.error("Error removing main image: ", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const newRecipeData = {
        title: newRecipeName,
        text: newProcess,
        ingredient: newIngredients,
        imageUrl: imageUrl,
        process: editedRecipe.process,
      };

      if (initialRecipe) {
        await updateDoc(doc(db, "posts", initialRecipe.id), newRecipeData);
      } else {
        await addDoc(collection(db, "posts"), newRecipeData);
      }

      setNewRecipeName('');
      setNewProcess('');
      setNewIngredients(['']);
      setImageUrl('');
      setEditedRecipe({ imageUrl: '', process: [] });
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    newRecipeName,
    setNewRecipeName,
    newProcess,
    setNewProcess,
    newIngredients,
    loading,
    loadingProcessImgs,
    imageUrl,
    setImageUrl,
    tempImageUrl,
    editedRecipe,
    setEditedRecipe, 
    uploadDetailImages,
    handleAdditionalInfoChange,
    handleAddIngredientField,
    handleAddProcessUrlAndText,
    handleTextEdited,
    handleSubmit,
    handleRemoveImgAndText,
    handleRemoveImage,
    handleFileUploadToFirebase,
    handleFileSelection,
    handleFileEdited,
  };
};
