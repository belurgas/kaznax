import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { telegram_id } = body;

    if (!telegram_id) {
        return NextResponse.json(
          { error: "Пользователь не найден" },
          { status: 400 }
        );
    } else {
        const client = new MongoClient("mongodb://gen_user:N%3Eyp10S6%5C%24%5Ca%5Cw@195.133.73.180:27017/default_db?authSource=admin&directConnection=true");
        await client.connect();
        const db = client.db("kaznax");
        const users = db.collection("users");

        const user = await users.findOne({ telegram_id });

        if (user) {

            return NextResponse.json(
                { user },
                { status: 200 }
            ); 
        } else {
            return NextResponse.json(
                { photo_url: "get_from_tg" },
                { status: 200 }
            )
        }
    }
}