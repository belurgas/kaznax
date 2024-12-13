"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hapticFeedback } from "@telegram-apps/sdk";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface DialogAvatarProps {
  currentName: string | null; // Текущее имя
  currentPhoto: string; // Текущая ссылка на фото
  onNameChange: (newName: string) => void; // Функция для изменения имени
  onPhotoChange: (newPhoto: string) => void; // Функция для изменения фото
}

export function DialogAvatar({
  currentPhoto,
  currentName,
  onNameChange,
  onPhotoChange,
}: DialogAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [inputName, setInputName] = useState<string | null>(currentName);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    setImagePreview(currentPhoto);
  }, [currentPhoto])

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputName(currentName); // Обновляем состояние при изменении пропса
  }, [currentName]);

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

  const handleCancel = () => {
    hapticFeedback.impactOccurred("medium");
    setFile(null);
    setImagePreview(currentPhoto); // Очищаем картинку
    setIsOpen(false); // Закрываем диалог
  };

  const handleSave = async () => {
    hapticFeedback.impactOccurred("medium");

    // Изменение имени
    if (inputName) {
      if (inputName !== currentName) {
        if (inputName.trim() !== "" && inputName.trim().length <= 30) {
          onNameChange(inputName.trim());
        } else if (inputName.trim().length > 30) {
          alert("Имя не должно превышать 30 символов.");
        } else if (inputName.trim() === "") {
          alert("Имя не может быть пустым.");
        }
      }
    }
    

    // Изменение фото
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла должен быть меньше 10 МБ.");
      } else {
        const fileUrl = URL.createObjectURL(file); // Преобразование файла в URL
        onPhotoChange(fileUrl);
      }
    }

    setIsOpen(false); // Закрываем диалог
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold text-lg" size={"lg"} variant="outline" onClick={() => {
          hapticFeedback.impactOccurred("medium");
        }}>
          Изменить
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] w-full max-w-[90%] p-6 rounded-xl"
        style={{
          maxHeight: "90vh",
          position: "fixed",
          top: "10%",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
      >
        <DialogHeader>
          <DialogTitle>Изменить профиль</DialogTitle>
          <DialogDescription>
            Измените данные ниже или оставьте как есть
          </DialogDescription>
          {imagePreview && (
            <Avatar className="relative mx-auto w-[150px] h-[150px] rounded-full overflow-hidden">
              <AvatarImage className="w-full h-full object-cover" src={imagePreview} onClick={() => inputFileRef.current?.click()}/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <Label className="mx-auto">Нажмите на картинку</Label>
        </DialogHeader>
        <div className="grid gap-4 pb-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Имя
            </Label>
            <Input
              id="name"
              className="col-span-3"
              type="text"
              value={inputName as string}
              onChange={(e) => setInputName(e.target.value)}
            />
            <Input
              ref={inputFileRef}
              id="picture"
              className="col-span-3"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }} // Скрываем input
            />
          </div>
        </div>
        <DialogFooter className="gap-y-3">
          <Button className="text-xl font-bold p-7" type="button" onClick={handleCancel} variant="outline">
            Отмена
          </Button>
          <Button className="text-xl font-bold p-7" type="button" onClick={handleSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}