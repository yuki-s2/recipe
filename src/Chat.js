
import React, { useState } from 'react';
import OpenAI from 'openai';

export default function Chat({ingredients}) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: process.env.REACT_APP_API_KEY,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userMessage = `Please tell me the amount of PFC in ${ingredients}. The value for the PFC must be float value and the unit of them is gram. This is the ideal structure. {"PFC": {"protein": 10, "fat": 10, "carbohydrate": 5}}`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "You are an excellent assistant. Output the result in JSON format." },
                { "role": "user", "content": userMessage }
            ],
        });

        // API レスポンスからメッセージを取得して JSON 形式に変換する
        let pfcData;
        try {
            pfcData = JSON.parse(response?.choices[0]?.message?.content);
        } catch (error) {
            console.error("Error processing PFC data:", error);
        }

        // 新しいPFCオブジェクトを作成
        const pfc = new PFC(pfcData?.PFC || {});

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "ai", PFC: pfc } // メッセージにPFCプロパティを追加
        ]);

        // メッセージステートにデータを追加
        setMessages((prevMessages) => [
            ...prevMessages,
            pfcData // pfcDataを直接追加
        ]);



        console.log(response);
        console.log(ingredients);

        setIsLoading(false);
    };

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <button type="submit">
                    {isLoading ? <p>送信中</p> : <p>送信</p>}
                </button>
            </form>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.sender === "ai" && (
                            <>
                                <p>タンパク質 {message.PFC.protein} g</p>
                                <p>脂質git  {message.PFC.fat} g</p>
                                <p>炭水化物 {message.PFC.carbohydrate} g</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

class PFC {
    constructor(pfcData) {
        this.protein = pfcData.protein;
        this.fat = pfcData.fat;
        this.carbohydrate = pfcData.carbohydrate;
    }
}