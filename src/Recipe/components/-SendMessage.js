import React, { useState } from 'react'
import { db } from '../../Firebase';
import { collection, addDoc } from "firebase/firestore"; 

function SendMessage() {
    const [fbMessage, setFbMessage] = useState([]);
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
            <input type="text" onChange={(e) => setFbMessage(e.target.value)} value={fbMessage}  />
            </div>
        </form>
    </div>
  )
}

export default SendMessage;