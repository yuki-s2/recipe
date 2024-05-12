import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/compat/auth";
import "firebase/compat/firestore";

//ファイヤーベースの初期化
const firebaseConfig = {
    apiKey: "AIzaSyCwl10MSlI72Q97Duo4CU1pT6iw7JZbGGo",
    authDomain: "my-recipe-b7757.firebaseapp.com",
    projectId: "my-recipe-b7757",
    storageBucket: "my-recipe-b7757.appspot.com",
    messagingSenderId: "401708231650",
    appId: "1:401708231650:web:ad349121ae9721f53f67bb"
  };

  const app = initializeApp(firebaseConfig);
  // const db = firebaseApp.firestore();
  const db = getFirestore(app);

  // const auth = firebase.auth();
  const auth = getAuth(app);


  export { db, auth };
