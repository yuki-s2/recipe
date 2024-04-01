
import React, { useState } from 'react';
import OpenAI from 'openai';

export default function Chat({ ingredients }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: process.env.REACT_APP_API_KEY,
    });

    const extractPFCFromIngredient = (ingredient) => {
        // 材料の文字列を分割して各情報を取得する
        const parts = ingredient.split(':');
        if (parts.length !== 2) {
            // パターンにマッチしない場合はnullを返す
            return null;
        }

        // 各情報を取得
        const [name, pfcInfo] = parts;
        const [proteinStr, fatStr, carbohydrateStr] = pfcInfo.split(',');

        // 数値に変換してPFCオブジェクトを返す
        const protein = parseFloat(proteinStr.trim());
        const fat = parseFloat(fatStr.trim());
        const carbohydrate = parseFloat(carbohydrateStr.trim());

        return { protein, fat, carbohydrate };
    };


    const calculatePFC = (ingredients) => {
        let totalProtein = 0;
        let totalFat = 0;
        let totalCarbohydrate = 0;

        //それぞれ追加していく？
        ingredients.forEach((ingredient) => {
            const pfc = extractPFCFromIngredient(ingredient);
            if (pfc) {
                totalProtein += pfc.protein;
                totalFat += pfc.fat;
                totalCarbohydrate += pfc.carbohydrate;
            }
        });


        return { protein: totalProtein, fat: totalFat, carbohydrate: totalCarbohydrate };
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userMessage = `Please tell me the amount of PFC in ${ingredients} . The value for the PFC must be float value and the unit of them is gram. This is the ideal structure. {"PFC": { "材料": {"protein": 10, "fat": 10, "carbohydrate": 5}}}`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "You are an excellent assistant. Output the result in JSON format." },
                { "role": "user", "content": userMessage }
            ],
        });


        // 材料のPFCの合計を計算する
        // const totalPFC = calculatePFC(ingredients);



        // API レスポンスからメッセージを取得して JSON 形式に変換する
        let pfcData;
        try {
            pfcData = JSON.parse(response?.choices[0]?.message?.content);
        } catch (error) {
            console.error("Error processing PFC data:", error);
        }

        // 各材料のPFC値の合計を計算する
        const totalPFC = { protein: 0, fat: 0, carbohydrate: 0 };
        Object.keys(pfcData.PFC).forEach(function (key) {
            totalPFC.protein += pfcData.PFC[key].protein;
            totalPFC.fat += pfcData.PFC[key].fat;
            totalPFC.carbohydrate += pfcData.PFC[key].carbohydrate;
        });

           // 新しいPFCオブジェクトを作成
           const pfc = new PFC(totalPFC);

        // メッセージステートにデータを追加
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "ai", PFC: pfc } // メッセージにPFCプロパティを追加
        ]);


        console.log("pfcデータ");
        console.log(pfcData);

        console.log("responseデータ");
        console.log(response);
        console.log(ingredients);

        setIsLoading(false);
    };



    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <button type="submit">
                    {isLoading ? <p>送信中</p> : <p>栄養素を表示</p>}
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