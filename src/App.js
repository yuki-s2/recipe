import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './Firebase.js';
import SignIn from './components/SignIn.js';
import RecipePage from './Recipe/RecipePage.js';

function App() {
  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      {user ? <RecipePage /> : <SignIn />}
    </div>
  );
}

export default App;


