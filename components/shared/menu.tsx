'use client'

import { closeMiniApp, hapticFeedback } from "@telegram-apps/sdk";
import { Button } from "../ui/button";
    

export function MainMenu() {
    // useEffect(() => {
    //     init()
    //     const { initDataRaw } = retrieveLaunchParams();
    //     const a = parseInitData(initDataRaw);

    //     if(a?.user) {
    //         sendMessageToUser(a.user.id || 0, "Я пердоле блять")
    //     }
        
    // }, [])

    // const sendMessage = async () => {
    //     const message = "Твоя мама ШЛЮХА ЕБАНАЯ";
        
    //     // Отправляем сообщение через POST-запрос
    //     const response = await fetch('/api/socket/messages', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ message })
    //     });
    
    //     const data = await response.json();
    //     console.log(data);  // Отвечает ли сервер с правильным сообщением
    //   };

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-100">
            <h1 className="text-4xl">Сюда пока рано...</h1>
            <Button className="mt-7 text-xl font-bold p-6" onClick={() => {
                hapticFeedback.impactOccurred("medium");
                closeMiniApp();
            }}>Ладно 😝</Button>
            {/* <SocketIndicator /> */}
            {/* <Button onClick={sendMessage}>ЖМИ</Button> */}
        </div>
    );
}