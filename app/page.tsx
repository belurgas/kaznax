'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { expandViewport, init, isMiniAppMounted, miniAppHeaderColor, mountMiniApp, parseInitData, retrieveLaunchParams, setMiniAppHeaderColor } from '@telegram-apps/sdk';
import { MainMenu } from '@/components/shared/menu';

// Импорт динамического компонента с отключением SSR
const MainText = dynamic(() => import("@/components/shared/main-text"), { ssr: false });

export default function Page() {
  const [registred, setRegistred] = useState(false);  // Состояние для регистрации пользователя
  const [isLoading, setIsLoading] = useState(true);    // Состояние для отслеживания загрузки

  useEffect(() => {
    // Создаём асинхронную функцию для выполнения инициализации
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

    // Вызов асинхронной функции
    initializeSdk();

    const sendMessageToUser = async () => {
      const { initDataRaw } = retrieveLaunchParams();
      const a = parseInitData(initDataRaw);

      if (a?.user) {
        try {
          const response = await fetch("/api/findUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              telegram_id: a.user.id, // Идентификатор пользователя в Telegram
            }),
          });

          const data = await response.json();
          
          if (response.ok) {
            if (data.user?.registered !== null) {
              if (data.user?.registered) {
                setRegistred(true);  // Пользователь зарегистрирован
              } else {
                setRegistred(false); // Пользователь не зарегистрирован
              }
            } else {
              setRegistred(false); // Нет данных о регистрации
            }
          } else {
            setRegistred(false); // Ошибка при получении данных
          }
        } catch (error) {
          console.log(error);
          setRegistred(false); // Ошибка запроса
        } finally {
          setIsLoading(false);  // Окончание загрузки
        }
      }
    };

    sendMessageToUser();  // Запуск асинхронной функции для отправки данных и получения ответа
  }, []); // Эффект выполнится только один раз при монтировании компонента

  // Возвращаем состояние загрузки или соответствующий компонент
  if (isLoading) {
    return <div></div>; // Отображаем индикатор загрузки
  }

  return (
    <div>
      <main>
        {!registred ? (  // Если не зарегистрирован, отображаем MainText
          <MainText />
        ) : (  // Если зарегистрирован, отображаем MainMenu
          <MainMenu />
        )}
      </main>
    </div>
  );
}
