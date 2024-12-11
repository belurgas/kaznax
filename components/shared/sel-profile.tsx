"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { closeMiniApp, hapticFeedback, parseInitData, retrieveLaunchParams } from "@telegram-apps/sdk";
import { DialogAvatar } from "./avatar-change";
import { motion } from "framer-motion";

export function ProfileMain() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>("");
  const [telegramId, setTelegramId] = useState(0);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Получение данных о фото из базы данных
  const getFromDbPhoto = async (userId: number, a: any) => {
    try {
      const response = await fetch(`/api/getUserPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.photo_url === "get_from_tg") {
          setUserPhoto(a.user.photoUrl);
          setFullName(a.user.firstName ? `${a.user.firstName} ${a.user.lastName || ''}`.trim() : null);
        } else {
          setUserPhoto(data.user.photo_url);
          setFullName(data.user.full_name);
        }
      } else {
        console.error("Ошибка при получении фото пользователя.");
      }
    } catch (error) {
      console.error("Ошибка при подключении к базе данных:", error);
    }
  };

  // Инициализация данных с Telegram
  useEffect(() => {
    const { initDataRaw } = retrieveLaunchParams();
    const a = parseInitData(initDataRaw);

    if (a?.user) {
      const fullName = a.user.firstName ? `${a.user.firstName} ${a.user.lastName || ''}`.trim() : null;
      setFullName(fullName);
      getFromDbPhoto(a.user.id, a);
      setTelegramId(a.user.id || 0);
      setUsername(a.user.username || '');
      setRole("USER");
    }
  }, []);

  // Отправка сообщения пользователю
  const sendMessageToUser = async (userId: number, message: string) => {
    try {
      const response = await fetch("/api/bot/userRegistered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message }),
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error from sendMessageToUser:", error);
      return false;
    }
  };

  // Обработка отправки данных
  async function handleSendData() {
    hapticFeedback.impactOccurred("medium");
    setIsLoading(true);

    try {
      let s3PhotoUrl: string | undefined;

      if (userPhoto.startsWith("blob:")) {
        const response = await fetch(userPhoto);
        if (!response.ok) throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        
        const blob = await response.blob();
        const formData = new FormData();
        formData.append(`${telegramId}`, blob, 'text.png');
        formData.append("jsonData", JSON.stringify({
          telegram_id: telegramId,
          full_name: fullName,
          username: username,
          role: role,
        }));

        const responses = await fetch('/api/updateUser', {
          method: 'POST',
          body: formData,
        });

        if (!responses.ok) throw new Error('Ошибка при загрузке файлов');
      } else {
        const response = await fetch("/api/updateUser", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegram_id: telegramId,
            photo_url: s3PhotoUrl || userPhoto,
            full_name: fullName,
            username: username,
            role: role,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Ошибка сохранения данных');
      }

      const resa = await sendMessageToUser(telegramId, "edited");
      if (resa) {
        alert("Всё сохранено 😊");
        closeMiniApp();
      } else {
        alert("Ошибка обновления данных")
      }
    } catch (error) {
      console.error("Ошибка при обработке данных:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <svg
              className="animate-spin h-16 w-16 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <motion.span
              className="text-white text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Загрузка...
            </motion.span>
          </div>
        </motion.div>
      )}

      <div className="space-y-8 p-6 bg-white rounded-lg shadow-md mx-5">
        <div className="flex items-center gap-4 justify-center">
          <div className="flex-shrink-0">
            <Avatar className="w-[80px] h-[80px]">
              <AvatarImage className="w-full h-full" src={userPhoto || ""} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <span className="font-bold text-3xl">{fullName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <DialogAvatar
            currentName={fullName}
            currentPhoto={userPhoto}
            onNameChange={setFullName}
            onPhotoChange={setUserPhoto}
          />
          <Button className="font-bold text-lg" size={"lg"} onClick={handleSendData}>
            Сохранить
          </Button>
        </div>
      </div>
    </>
  );
}
