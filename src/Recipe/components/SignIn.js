import React from 'react';
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import { auth } from '../../Firebase'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import RecipePage from '../RecipePage';


function SignIn() {
  const signInGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        <RecipePage /> 
      })
      .catch((error) => {
        <SignIn/>
      });
  };

  return (
    <div>
      <button onClick={signInGoogle}>ログイン</button>
    </div>
  );
}

export default SignIn;