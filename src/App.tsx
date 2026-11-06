import { useEffect, useState } from "react";
import "./App.css";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  STORAGE_KEY,
  HISTORY_KEY,
  formatDateInputValue,
  getDefaultTargetDate,
  parseStoredDate,
  getStoredDateValue,
} from "./utils/dateUtils";
import { DatePicker } from "./components/DatePicker";
import { BackgroundPicker } from "./components/BackgroundPicker";
import { CountdownGrid } from "./components/CountdownGrid";

function App() {
  const [time, setTime] = useState(new Date());
  const [targetDate, setTargetDate] = useState<Date>(() =>
    getStoredDateValue(),
  );
  const inputValue = formatDateInputValue(targetDate);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [bgUrl, setbgUrl] = useState(() => {
    const savedBg = localStorage.getItem("bgUrlStorage");
    return savedBg ? savedBg : "";
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextValue = formatDateInputValue(targetDate);


    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, nextValue);

      const storedHistory = window.localStorage.getItem(HISTORY_KEY) ?? "[]";
      const previousHistory = JSON.parse(storedHistory) as string[];
      const nextHistory = [nextValue, ...previousHistory].filter(Boolean);
      const uniqueHistory = [...new Set(nextHistory)].slice(0, 10);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(uniqueHistory));
    } catch {
      // Ignore localStorage issues, keep the countdown functional.
    }
  }, [targetDate]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const totalSeconds = Math.max(
        Math.floor((targetDate.getTime() - now.getTime()) / 1000),
        0,
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
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [targetDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    if (!selectedValue) {
      return;
    }

    const parsedDate = parseStoredDate(selectedValue);
    if (!parsedDate) {
      return;
    }

    setTargetDate(parsedDate);
  };

  const resetToNewYear = () => {
    const defaultDate = getDefaultTargetDate();
    setTargetDate(defaultDate);
  };

  const showTime = format(time, "HH:mm:ss", { locale: ru });
  const isFinished = targetDate.getTime() <= time.getTime();

  const selectBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setbgUrl(base64String);
        localStorage.setItem("bgUrlStorage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBackground = () => {
    localStorage.removeItem("bgUrlStorage");
    setbgUrl("");
  };

  useEffect(() => {
    const body = document.body;

    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundAttachment = "fixed";

    body.style.transition =
      "background-image 0.5s ease-in-out, background 0.5s ease-in-out";

    if (bgUrl) {
      body.style.backgroundImage = `url(${bgUrl})`;
      body.style.background = `url(${bgUrl}) center/cover no-repeat fixed`;
    } else {
      body.style.backgroundImage = "none";
      body.style.background =
        "linear-gradient(-45deg, #ad7564, #a1657b, #5c96ac, #6dafa0)";
    }

    return () => {
      body.style.background = "";
      body.style.backgroundImage = "";
      if (bgUrl) {
        URL.revokeObjectURL(bgUrl);
      }
    };
  }, [bgUrl]);

  return (
    <main className="app">
      <div className="app__content">
        <header className="app__header">
          <h1 className="app__title">
            {isFinished
              ? "Эта дата прошла!"
              : `Осталось до  ${format(targetDate, "dd MMMM yyyy", { locale: ru })}`}
          </h1>
          <p className="app__subtitle">
            Выберите дату, которую хотите. По умолчанию отчет идет до Нового
            Года
          </p>
        </header>

        <section className="countdown-card">
          <DatePicker
            inputValue={inputValue}
            onDateChange={handleDateChange}
            onResetToNewYear={resetToNewYear}
          />
          <BackgroundPicker
            onSelectBackground={selectBackground}
            onResetBackground={resetBackground}
          />
          <CountdownGrid timeLeft={timeLeft} />

          <p className="current-time">
            Настоящие время: <span>{showTime}</span>
          </p>
        </section>
      </div>
    </main>
  );
}

export default App;
