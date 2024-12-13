// Сделать отображение спец миню для админов и ведущего

// Как всё это должно выглядеть
// Пользователи зашли, если активность началась, то появляются компоненты с пользователям и чекбоксами где можно голосовать
'use client';


import { expandViewport, init, isMiniAppMounted, miniAppHeaderColor, mountMiniApp, parseInitData, retrieveLaunchParams, setMiniAppHeaderColor } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { NotStartAct } from "@/components/shared/activity/not-start";

export default function HatAct() {
  const [telegramId, setTelegramId] = useState<number>(0);
  const [isRegistred, setIsRegistred] = useState(false);

  const router = useRouter();

  // Проверка наличия карточки участия
  const getUserCard = async (telegramId: number) => {
    const response = await fetch('/api/getUserCard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: telegramId })
    })

    const data = await response.json();
    if (data.error) {
      // У пользователя ещё нет карточки
      console.log("У пользователя ещё нет карточки");
    } else {
      // Тут нужно что-то делать с карточкой пользователя
      console.log(data.card)
    }
  }

  // Проверка статуса активности МП
  const getActivity = async () => {
    const response = await fetch('/api/getActivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: "hatac" })
    });

    const data = await response.json();
    // Обрабатывать статус ативности надо
    console.log(data);
  }

  // Отправка фото на WebSocket
  
  useEffect(() => {
    const isUserTrue = async (telegram_id: number) => {
      const response = await fetch('/api/findUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegram_id })
      })

      const data = await response.json();
      if (!data.user) {
        router.replace('/')
      } else {
        setIsRegistred(true);
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
      getUserCard(telegramId);

      const { initDataRaw } = retrieveLaunchParams();
      const a = parseInitData(initDataRaw);
      getActivity()

      if (a?.user) {
        setTelegramId(a.user.id || 0);
        isUserTrue(a.user.id);
      }
  }, [telegramId, router])

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen bg-gray-100">
          {isRegistred && (
            <>
              <NotStartAct />
            </>
          )}
      </div>
    );
}