import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { title } = body;

    if (!title) {
        return NextResponse.json(
          { error: "Активнось не найдена" },
          { status: 400 }
        );
    } else {
        const client = new MongoClient("mongodb://gen_user:N%3Eyp10S6%5C%24%5Ca%5Cw@195.133.73.180:27017/default_db?authSource=admin&directConnection=true");
        await client.connect();
        const db = client.db("kaznax");
        const users = db.collection("activity");

        const activity = await users.findOne({ title });
        
        return NextResponse.json(
            { activity },
            { status: 200 }
        );
    }
}