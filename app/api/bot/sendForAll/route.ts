// Реализовать отправку запроса на рассылку определённого сообщения абсполютно всем пользователям
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { message } = body;

    const client = new MongoClient("mongodb://gen_user:N%3Eyp10S6%5C%24%5Ca%5Cw@195.133.73.180:27017/default_db?authSource=admin&directConnection=true");
    await client.connect();
    const db = client.db("kaznax");
    const users = db.collection("users");

    const userIds = await users.distinct("telegram_id");

    try {
        const response = await fetch('http://localhost:7384/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userIds,  // Идентификатор пользователя в Telegram
            message: message // Сообщение для отправки
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: `Error sending message: ${data.error}` }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}