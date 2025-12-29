import { useEffect, useState } from "react";
import "./App.css";
import { setYear, startOfYear, format } from "date-fns";
import { ru } from "date-fns/locale";

function App() {

  const [time, setTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Функция для склонения слова "день"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDayWord = (days: any) => {
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'дней';
    if (lastDigit === 1) return 'день';
    if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
    return 'дней';
  };

   // Функция для склонения других слов
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getHourWord = (hours: any) => {
    const lastDigit = hours % 10;
    const lastTwoDigits = hours % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'часов';
    if (lastDigit === 1) return 'час';
    if (lastDigit >= 2 && lastDigit <= 4) return 'часа';
    return 'часов';
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getMinuteWord = (minutes: any) => {
    const lastDigit = minutes % 10;
    const lastTwoDigits = minutes % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'минут';
    if (lastDigit === 1) return 'минута';
    if (lastDigit >= 2 && lastDigit <= 4) return 'минуты';
    return 'минут';
  };
  
  // Вывод времени //////////////////////////

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const ShowTime = format(time, "HH:mm:ss", { locale: ru });

  //////////////////////////////////////////


  // Вывод времени до нового года

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      let nextNewYear;

      if (now.getMonth() === 11 && now.getDate() === 31) {
        nextNewYear = setYear(startOfYear(now), currentYear + 1);
      } else if (now.getMonth() === 11) {
        nextNewYear = setYear(startOfYear(now), currentYear + 1);
      } else {
        nextNewYear = setYear(startOfYear(now), currentYear + 1);
      }

      if (now.getMonth() === 0 && now.getDate() === 1) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(
        (nextNewYear.getTime() - now.getTime()) / 1000
      );

      if (totalSeconds <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div>
        <h1>До нового года осталось!</h1>
        <div>
          <span>{timeLeft.days}</span>{' '}
          <span>{getDayWord(timeLeft.days)}</span>
        </div>
        <div>
          <span>{timeLeft.hours.toString().padStart(2, "0")}</span>{' '}
          <span>{getHourWord(timeLeft.hours)}</span>
        </div>
        <div>
          <span>{timeLeft.minutes.toString().padStart(2, "0")}</span>{' '}
          <span>{getMinuteWord(timeLeft.minutes)}</span>
        </div>
        <div>
          <span>{timeLeft.seconds.toString().padStart(2, "0")}</span>{' '}
          <span>секунд</span>
        </div>
      </div>
      <h1>{ShowTime}</h1>
    </>
  );
}

export default App;
