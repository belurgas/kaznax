"use client";

// Импорт необходимых компонентов и библиотек
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hapticFeedback, openTelegramLink } from "@telegram-apps/sdk";
import { ProfileForm } from "./profile";

// Определение анимаций для кнопок
const buttonVariants = {
  hidden: { 
    opacity: 0, // Скрытие кнопки
    y: 20 // Сдвиг кнопки вниз
  },
  visible: { 
    opacity: 1, // Показ кнопки
    y: 0, // Без сдвига
    transition: { 
      duration: 0.7, // Длительность анимации
      ease: "easeInOut" // Тип анимации
    }
  },
  exit: { 
    opacity: 0, // Скрытие кнопки при выходе
    y: 20, // Сдвиг кнопки вниз
    transition: { 
      duration: 0.3 // Быстрое исчезновение
    }
  }
};

// Функция для выполнения последовательных вибраций
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

// Функция для запуска конфетти и вибрации
const launchConfettiWithHaptics = () => {
  launchConfetti(); // Запуск анимации конфетти
  try {
    confettiHapticFeedback(); // Запуск вибраций
  } catch (error) {
    console.log("Haptic Feedback не поддерживается:", error); // Обработка ошибки
  }
};

// Функция для отображения конфетти
const launchConfetti = () => {
  confetti({
    particleCount: 200, // Количество частиц
    spread: 100, // Угол распространения
    origin: { x: 0.5, y: 0.5 }, // Центр экрана
    colors: ["#ff0", "#0ff", "#f00", "#0f0", "#00f"], // Цвета частиц
  });
};

// Компонент для анимации текста с мигающим курсором
const TypingEffectWithCursor = ({
  texts,
  speed = 100, // Скорость анимации
}: {
  texts: string[]; // Массив текстов для отображения
  speed: number; // Скорость набора текста
}) => {
  const [isFinished, setIsFinished] = useState(false); // Флаг завершения анимации
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // Индекс текущего текста
  const [displayedText, setDisplayedText] = useState(""); // Текущий отображаемый текст
  const [index, setIndex] = useState(0); // Индекс текущего символа в тексте
  const [showCursor, setShowCursor] = useState(true); // Состояние для отображения курсора
  const [showConfettiButton, setShowConfettiButton] = useState(false); // Состояние для отображения кнопки конфетти
  const [pressedHapButton, setPressedHapButton] = useState(false); // Состояние для отслеживания нажатия кнопки
  const [pressedHapButton2, setPressedHapButton2] = useState(false); // Второе состояние для кнопки

  // Логика анимации текста
  useEffect(() => {
    if (isFinished) return; // Если анимация завершена, выходим

    if (index < texts[currentTextIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + texts[currentTextIndex][index]); // Добавляем символ
        setIndex((prev) => prev + 1); // Увеличиваем индекс символа
        try {
          hapticFeedback.impactOccurred("soft"); // Вибрация при каждом символе
        } catch (error) {
          console.log("Haptic feedback не поддерживается или произошла ошибка:", error); // Обработка ошибки
        }
      }, speed);
      return () => clearTimeout(timeout); // Очистка таймера
    } else if (currentTextIndex < texts.length - 1) {
      // Если есть следующий текст, переключаемся на него
      const switchTimeout = setTimeout(() => {
        setDisplayedText(""); // Очистка текста
        setIndex(0); // Сброс индекса
        setCurrentTextIndex((prev) => prev + 1); // Переход к следующему тексту
      }, 1000); // Пауза между текстами
      return () => clearTimeout(switchTimeout);
    } else {
      // После последнего текста показываем кнопку
      setIsFinished(true);
      setShowConfettiButton(true);
    }
  }, [index, texts, speed, currentTextIndex, isFinished]);

  // Анимация мигающего курсора
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev); // Меняем видимость курсора
    }, 500); // Мигает каждые 500 мс
    return () => clearInterval(cursorInterval); // Очистка интервала
  }, []);

  // Возвращаем компонент с анимацией текста
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-100">
      {
        !pressedHapButton2 ? (
          <>
            <span>
              {displayedText}
              <span
                className={cn(
                  "w-1 h-6 bg-black transition-opacity duration-500 ml-1",
                  showCursor ? "opacity-100" : "opacity-0" // Мигание курсора
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
                          launchConfettiWithHaptics(); // Запуск конфетти и вибраций
                          setPressedHapButton2(true); // Обновление состояния
                          setShowConfettiButton(false); // Скрыть кнопку
                        }}>Поздравил 😉</Button>
                      </div>
                    ) : (
                      <>
                        <div className="mt-4">
                          <Button variant={"outline"} className="text-lg p-5 font-bold" onClick={() => {
                            setPressedHapButton(true); // Изменение состояния кнопки
                            handleOpenLink(); // Открытие Telegram-ссылки
                          }}>Поздравить 🎉</Button>
                        </div>
                        <div className="mt-4">
                          <Button variant={"outline"} className="text-lg p-5 font-bold" onClick={() => {
                            launchConfettiWithHaptics(); // Запуск конфетти и вибраций
                            setPressedHapButton2(true); // Обновление состояния
                            setShowConfettiButton(false); // Скрыть кнопку
                          }}>Уже поздравил 🥳</Button>
                        </div>
                      </>
                    )
                  }
                </motion.div>
              </div>
            )}
          </>
        ) : <ProfileForm /> // Если уже нажата кнопка, показываем форму
      }
    </div>
  );
};

// Функция для открытия ссылки в Telegram
const handleOpenLink = () => {
  openTelegramLink("https://t.me/nUle115FZ");
};

// Главный компонент
export default function MainText() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <h1 className="text-2xl font-semibold text-center">
        <TypingEffectWithCursor
          texts={["Неужели...", "Мише 18?", "Быстрее поздравляйте его!"]}
          speed={50} // Установлена скорость набора текста
        />
      </h1>
    </div>
  );
}
