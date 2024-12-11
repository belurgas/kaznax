// Пользователь загрузил карточку для участия
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { userId, message } = body;

    try {
        const response = await fetch('http://localhost:7384/receive-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,  // Идентификатор пользователя в Telegram
            message: message, // Сообщение для отправки
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