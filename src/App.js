// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import firebase from "firebase/compat/app";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "### FIREBASE API KEY ###", authDomain: "### FIREBASE AUTH DOMAIN ###", projectId: "### CLOUD FIRESTORE PROJECT ID ###",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
var db = getFirestore();
function App() {
    const [posts, setPosts] = useState([]); 
    const onChangeName = (event) => { 
        // `event.target.value` を含む配列をセット
        setPosts([event.target.value]);
    }

    const onClickAdd = async () => {
        try {
            const docRef = await addDoc(collection(db, "users"), { name: posts });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    return (

        <div className="App"> <input type="text" value={posts} onChange={onChangeName} />
            <button onClick={onClickAdd}>追加</button>
            {posts.map((post, index) => (
                <div key={index}>
                    <h1>{post.title}</h1>
                    <p>{post.text}</p>
                </div>
            ))}
        </div>
    );
}
export default App;