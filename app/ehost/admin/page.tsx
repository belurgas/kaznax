"use client";

// Здесь меню управления мероприятием
// Проверка пользователя (Только из БД, ADMIN и EHOST, USER - вход запрещён если пользователя в бд нет, то вообще закрывать сразу, как и пользователям тоже можно)
// Меню сделать из sidebar'a из shadcnui
// Отправка всем пользователям сообщения (ФОРМА ОТПРАВКИ)
// Начать активность

// Конкурс: Когда ведущий нажмёт в админку кнопку "Начать конкурс", то конкурс переходит в стадию активности и выгружаются все 
// фотографии всех пользователей (не выгружаются а websocket проверяте на новыие и добовляет их в онлайне)
// И дальше под каждой фоткой можно выбрать участника за которого ты голосуешь и снизу нажать кнопку (она появляется когда участник выбрал за кого голосует).
// Дальше проверяется, за себя голосовать нельзя, проверка по telegramId

// Сделать отображение спец миню для админов и ведущего

import { expandViewport, init, isMiniAppMounted, miniAppHeaderColor, mountMiniApp, setMiniAppHeaderColor } from "@telegram-apps/sdk";
import { useEffect } from "react";

export default function AdminMenu() {
    useEffect(() => {
        const initializeSdk = async () => {
            // Инициализация и методы SDK только в клиентской части
            init();
            if (mountMiniApp.isAvailable()) {
              mountMiniApp();
              isMiniAppMounted(); // true
            }
            if (setMiniAppHeaderColor.isAvailable()) {
              setMiniAppHeaderColor('#ffffff');
              miniAppHeaderColor(); // 'bg_color'
            }
      
            if (expandViewport.isAvailable()) {
              expandViewport();
            }
        };
        
        initializeSdk();
    }, [])

    return (
        <div className="flex justify-start items-center h-screen w-screen bg-gray-100">
           <h1>Голосование</h1>
        </div>
    );
}