"use client";

import { SenderForm } from "@/components/shared/admin/sender";
import { useSidebar } from "@/components/ui/sidebar";
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

import { expandViewport, init, isMiniAppMounted, miniAppHeaderColor, mountMiniApp, parseInitData, retrieveLaunchParams, setMiniAppHeaderColor } from "@telegram-apps/sdk";
import { SquareMenu } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminMenu() {
  const { toggleSidebar } = useSidebar()
  // const [telegramId, setTelegramId] = useState(0);
  const [role, setRole] = useState(false);
    useEffect(() => {
      const getUserRole = async () => {
        const { initDataRaw } = retrieveLaunchParams();
        const a = parseInitData(initDataRaw);

        if (a?.user) {
          // setTelegramId(a.user.id);

          const response = await fetch('/api/findUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegram_id: a.user.id, // Идентификатор пользователя в Telegram
            }),
          });

          const data = await response.json();
          if (response.ok) {
            if (data.user.role === 'ADMIN') {
              setRole(true);
            } else if (data.user.role === 'EHOST') {
              setRole(true);
            } else {
              setRole(false);
            }
          }
        }
      }
    

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
        getUserRole();
    }, [])

    return (
        <div className="flex flex-col gap-5 justify-center items-center h-screen w-screen bg-gray-100">
           {
            role ? (
              <>
                <button className="fixed top-5 left-5 bg-black rounded-lg py-2 px-4" onClick={toggleSidebar}>
                  <SquareMenu size={30} color="#ffffff" />
                </button>
                <SenderForm />
              </>
            ) : (
              <h1>Нет доступа</h1>
            )
           }
        </div>
    );
}