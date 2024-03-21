
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

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "あなたは優秀なアシスタントです。JSONで結果を出力します。"
                },
                {
                    "role": "user",
                    "content": "Translate" + {messages} + "to English. This is the ideal structure. {\"original\": \"original text\", \"translation\": \"translated text\"}"
                }
            ],
        });
    // 応答のJSON形式データを組み立てる
    // const jsonResponse = {
    //     translated: 
    // };

    // メッセージステートにJSON形式のデータを追加
    setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
        { sender: "ai", text: JSON.stringify(response?.choices[0]?.message?.content) } // 応答をJSON形式の文字列に変換してセット
    ]);

        // setMessages((PrevMessages) => [
        //     ...PrevMessages,
        //     { sender: "user", text: message },
        //     { sender: "ai", text: response?.choices[0]?.message?.content },
        // ]);


        console.log(messages);

        setMessage(""); 

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
