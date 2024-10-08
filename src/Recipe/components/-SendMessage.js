import React, { useState } from 'react'
import { db } from '../../Firebase';
import { collection, addDoc } from "firebase/firestore"; 

function SendMessage({ingredient,ingredientQty}) {
    const [fbMessage, setFbMessage] = useState([]);
    const message = ingredient + ingredientQty;
    function sendMessage(e) {
        e.preventDefault();

        addDoc(collection(db, "posts"), {
            text: fbMessage,
        });
        setFbMessage("");
    }
  return (
    <div>
        <form onSubmit={sendMessage}>
            <div>
            <input type="text" onChange={(e) => setFbMessage(e.target.value)} value={message}  />
            </div>
        </form>
    </div>
  )
}

export default SendMessage;