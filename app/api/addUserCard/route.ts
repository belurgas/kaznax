// Добавление или обнавления карточки участника для голосования

import { MongoClient } from "mongodb";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body);
    const { telegram_id, photo_url } = body;

    if (!telegram_id) {
        return NextResponse.json(
          { error: "Пользователь не найден" },
          { status: 400 }
        );
    } else {
        const client = new MongoClient("mongodb://gen_user:N%3Eyp10S6%5C%24%5Ca%5Cw@195.133.73.180:27017/default_db?authSource=admin&directConnection=true");
        await client.connect();
        const db = client.db("kaznax");
        const users = db.collection("usersCard");

        const existingUser = await users.findOne({ telegram_id });

        if (existingUser) {
            // Обновление существующего пользователя
            await users.updateOne({ telegram_id }, { $set: { photo_url } });
        } else {
            // Добавление нового пользователя
            const newUser = {
                telegram_id,
                photo_url,
                created: new Date(),
            };
            await users.insertOne(newUser); 
        }
        
        return NextResponse.json(
            { message: "Okey vse" },
            { status: 200 }
        );
    }
}
