import React, { useState } from 'react'
import { db } from '../../Firebase';
import { collection, addDoc } from "firebase/firestore"; 

function SendMessage() {
    const [fbMessage, setFbMessage] = useState([]);
    function sendMessage(e) {
        e.preventDefault();

        addDoc(collection(db, "posts"), {
        // db.collection("posts").add({
            text: fbMessage,
        });
    }
  return (
    <div>
        <form onSubmit={sendMessage}>
            <div>
            <input type="text" onChange={(e) => setFbMessage(e.target.value)}/>
            </div>
        </form>
    </div>
  )
}

export default SendMessage;