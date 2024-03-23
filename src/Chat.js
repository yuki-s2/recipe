
import React, { useState } from 'react';
import OpenAI from 'openai';

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const openai = new OpenAI({
        //Reactが自動的に提供するセキュリティ機能を無効にし、外部サイトの<iframe>内でJavaScriptを実行できるようにします。
        dangerouslyAllowBrowser: true,
        apiKey: process.env.REACT_APP_API_KEY,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userMessage = `Please tell me the amount of PFC in ${message}. The the value for the PFC must be float value and the unit of them is gram. This is the ideal structure. {"PFC": {"protein": 10, "fat": 10, "carbohydrate": 5}}`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "You are an excellent assistant. Output the result in JSON format." },
                { "role": "user", "content": userMessage }
            ],
        });

    // API レスポンスからメッセージを取得して JSON 形式に変換する
    const aiMessage = JSON.stringify(response?.choices[0]?.message?.content);

    // メッセージステートにデータを追加
    setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
        { sender: "ai", text: aiMessage }
    ]);


        console.log(response?.choices[0]?.message?.content);

        setMessage(""); 
        setIsLoading(false);

    };
    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} />
                <button type="submit">
                    {isLoading ? <p>送信中</p> : <p>送信</p>}
                </button>
            </form>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>
                        {message.text}
                    </p>
                ))}

            </div>
        </>
    )
};
