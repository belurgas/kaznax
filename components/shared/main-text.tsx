"use client";

import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {motion} from "framer-motion";
import { hapticFeedback, openTelegramLink } from "@telegram-apps/sdk";
import { ProfileForm } from "./profile";

const buttonVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 // Сдвиг вниз
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, // Длительность анимации
      ease: "easeInOut" 
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { 
      duration: 0.3 
    }
  }
};

const confettiHapticFeedback = () => {
  const hapticSequence = [
    () => hapticFeedback.impactOccurred("medium"),
    () => hapticFeedback.impactOccurred("heavy"),
    () => hapticFeedback.impactOccurred("rigid"),
    () => hapticFeedback.impactOccurred("medium"),
    () => hapticFeedback.impactOccurred("heavy"),
  ];

  // Выполнение вибраций с паузами
  hapticSequence.forEach((haptic, index) => {
    setTimeout(haptic, index * 100); // 100 мс между вибрациями
  });
};

const launchConfettiWithHaptics = () => {
  launchConfetti(); // Запуск анимации конфетти
  try {
    confettiHapticFeedback(); // Запуск мелодии вибраций
  } catch (error) {
    console.log("Haptic Feedback не поддерживается:", error);
  }
};

const launchConfetti = () => {
  confetti({
    particleCount: 200, // Количество частиц
    spread: 100, // Угол распространения
    origin: { x: 0.5, y: 0.5 }, // Центр экрана
    colors: ["#ff0", "#0ff", "#f00", "#0f0", "#00f"], // Цвета
  });
};

const TypingEffectWithCursor = ({
  texts,
  speed = 100,
}: {
  texts: string[];
  speed: number;
}) => {
  const [isFinished, setIsFinished] = useState(false); // Флаг завершения анимации
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // Индекс текущего текста
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showConfettiButton, setShowConfettiButton] = useState(false); // Кнопка запуска конфетти

  const [pressedHapButton, setPressedHapButton] = useState(false);
  const [pressedHapButton2, setPressedHapButton2] = useState(false);

  // Логика анимации текста
  useEffect(() => {
    if (isFinished) return;

    if (index < texts[currentTextIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + texts[currentTextIndex][index]);
        setIndex((prev) => prev + 1);
        // Проверка на наличие поддержки haptic feedback
        try {
          hapticFeedback.impactOccurred("soft");
        } catch (error) {
          console.log("Haptic feedback не поддерживается или произошла ошибка:", error);
        }
      }, speed);
      return () => clearTimeout(timeout);
    } else if (currentTextIndex < texts.length - 1) {
      // Переход к следующему тексту
      const switchTimeout = setTimeout(() => {
        setDisplayedText("");
        setIndex(0);
        setCurrentTextIndex((prev) => prev + 1);
      }, 1000); // Пауза между текстами
      return () => clearTimeout(switchTimeout);
    } else {
      // Последний текст завершён, показать кнопку
      setIsFinished(true);
      setShowConfettiButton(true);
    }
  }, [index, texts, speed, currentTextIndex, isFinished]);

  // Анимация мигания курсора
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Мигает каждые 500 мс
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-100 ">
      {
        !pressedHapButton2 ? (
          <>
            <span>
              {displayedText}
              <span
                className={cn(
                  "w-1 h-6 bg-black transition-opacity duration-500 ml-1",
                  showCursor ? "opacity-100" : "opacity-0"
                )}
              >
                .
              </span>
            </span>
            {showConfettiButton && (
            <div>
                <motion.div
                    variants={buttonVariants} 
                    initial="hidden" 
                    animate="visible" 
                    exit="exit"
                >
                    {
                        pressedHapButton ? (
                            <div className="mt-4">
                                <Button variant={"outline"} className="text-lg p-5 font-bold" onClick={() => {
                                    launchConfettiWithHaptics();
                                    setPressedHapButton2(true);
                                    setShowConfettiButton(false);
                                }}>Поздравил 😉</Button>
                            </div>
                        ) : (
                            <>
                                <div className="mt-4">
                                    <Button variant={"outline"} className="text-lg p-5 font-bold" onClick={() => {
                                        setPressedHapButton(true);
                                        handleOpenLink();
                                    }}>Поздравить 🎉</Button>
                                </div>
                                <div className="mt-4">
                                    <Button variant={"outline"} className="text-lg p-5 font-bold" onClick={() => {
                                      launchConfettiWithHaptics();
                                      setPressedHapButton2(true);
                                      setShowConfettiButton(false);
                                    }}>Уже поздравил 🥳</Button>
                                </div>
                            </>
                        )
                    }
                </motion.div>
                
            </div>
            
          )}
          </>
          
        ) : <ProfileForm />
      }
    </div>
  );
};

const handleOpenLink = () => {
    openTelegramLink("https://t.me/nUle115FZ");
};

export default function MainText() {
  // Логика для Telegram WebApp

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      
        <h1 className="text-2xl font-semibold text-center">
          <TypingEffectWithCursor
            texts={["Неужели...", "Мише 18?", "Быстрее поздравляйте его!"]}
            speed={50}
          />
        </h1>
      
    </div>
  );
}
