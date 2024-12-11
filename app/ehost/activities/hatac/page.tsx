// Сделать отображение спец миню для админов и ведущего

// Как всё это должно выглядеть
// Пользователи зашли, если активность началась, то появляются компоненты с пользователям и чекбоксами где можно голосовать
'use client';


import { SocketIndicator } from "@/components/shared/socket-indicator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { expandViewport, hapticFeedback, init, isMiniAppMounted, miniAppHeaderColor, mountMiniApp, parseInitData, retrieveLaunchParams, setMiniAppHeaderColor } from "@telegram-apps/sdk";
import { useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";

const sendMessage = async (formData: any) => {
    // const message = "golos";
    
    // Отправляем сообщение через POST-запрос
    const response = await fetch('/api/socket/messages', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log(data);  // Отвечает ли сервер с правильным сообщением
};

// Функция для получения фотки от пользователя
const getPhoto = async () => {

}

export default function HatAct() {
  const [telegramId, setTelegramId] = useState<number>(0);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isRegistred, setIsRegistred] = useState(false);

  const [imagePreview, setImagePreview] = useState<string>('https://s3.timeweb.cloud/8f8b2e5c-7d3d88b1-cdba-428e-a439-080dc0a97ec5/shlyaa.png');
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const sendToServer = async () => {
    hapticFeedback.impactOccurred("medium");

    // Изменение фото
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла должен быть меньше 10 МБ.");
      } else {
        const fileUrl = URL.createObjectURL(file); // Преобразование файла в URL
        console.log(fileUrl);

        const res = await fetch(fileUrl);

        if (!res.ok) throw new Error(`Ошибка при получении данных: ${res.statusText}`);

        const blob = await res.blob();
        const formData = new FormData();
        formData.append(`${telegramId}`, blob, 'sykioa.png');
        formData.append("jsonData", JSON.stringify({ telegram_id: telegramId }));
        console.log(formData.append);

        sendMessage(formData);
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);

      setFile(selectedFile);
    } else {
      setFile(null);
      alert("Пожалуйста, загрузите изображение.");
    }
  };
  
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

      const { initDataRaw } = retrieveLaunchParams();
      const a = parseInitData(initDataRaw);

      if (a?.user) {
        setTelegramId(a.user.id || 0);
        isUserTrue(a.user.id);
        setPhotoUrl(a.user.photoUrl || '');
      }
  }, [telegramId])

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen bg-gray-100">
          {isRegistred && (
            <>
              <div className="fixed top-0 right-0">
                <SocketIndicator />
              </div>

              {imagePreview && (
                <div className="relative mx-auto w-[200px] h-[250px] rounded-md overflow-hidden">
                  <Image
                    className="object-cover"
                    src={imagePreview}
                    alt="Preview"
                    layout="fill" // Используем fill, чтобы изображение заполнило круг
                    onClick={() => inputFileRef.current?.click()} // Кликаем по скрытому input при клике на изображение
                  />
                </div>
              )}
              <Input
                ref={inputFileRef}
                id="picture"
                className="col-span-3"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }} // Скрываем input
              />
              <Label className="mx-auto">Нажмите на картинку</Label>

              <Button onClick={() => {
                    sendToServer();
              }}>Голосовать</Button>
            </>
          )}
      </div>
    );
}