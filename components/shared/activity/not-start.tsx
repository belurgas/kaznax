"use client"

import { hapticFeedback } from "@telegram-apps/sdk";
import { useRef, useState } from "react";
import Image from "next/image";
import { SocketIndicator } from "../socket-indicator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NotStartAct() {
    const [telegramId] = useState<number>(0);
    const [imagePreview, setImagePreview] = useState<string>('https://s3.timeweb.cloud/8f8b2e5c-7d3d88b1-cdba-428e-a439-080dc0a97ec5/shlyaa.png');
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);

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
    
            // Отправляем сообщение через POST-запрос
            const response = await fetch('/api/socket/messages', {
              method: 'POST',
              body: formData
            });
    
            const data = await response.json();
            console.log(data);  // Отвечает ли сервер с правильным сообщением
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
    
    return (
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
        
    );
}