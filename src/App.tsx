import { useEffect, useState } from "react";
import "./App.css";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const STORAGE_KEY = "countdown-target-date";
const HISTORY_KEY = "countdown-date-history";

const formatDateInputValue = (date: Date) => format(date, "yyyy-MM-dd");

const getDefaultTargetDate = () => {
  const now = new Date();
  return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
};

const parseStoredDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getStoredDateValue = () => {
  if (typeof window === "undefined") {
    return getDefaultTargetDate();
  }

  const savedDate = parseStoredDate(window.localStorage.getItem(STORAGE_KEY));
  return savedDate ?? getDefaultTargetDate();
};

function App() {
  const [time, setTime] = useState(new Date());
  const [targetDate, setTargetDate] = useState<Date>(() =>
    getStoredDateValue(),
  );
  const [inputValue, setInputValue] = useState(() =>
    formatDateInputValue(new Date(targetDate)),
  );
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [bgUrl, setbgUrl] = useState(() => {
    const savedBg = localStorage.getItem("bgUrlStorage");
  return savedBg ? savedBg : '';
  });

  const getDayWord = (days: number) => {
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "дней";
    if (lastDigit === 1) return "день";
    if (lastDigit >= 2 && lastDigit <= 4) return "дня";
    return "дней";
  };

  const getHourWord = (hours: number) => {
    const lastDigit = hours % 10;
    const lastTwoDigits = hours % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "часов";
    if (lastDigit === 1) return "час";
    if (lastDigit >= 2 && lastDigit <= 4) return "часа";
    return "часов";
  };

  const getMinuteWord = (minutes: number) => {
    const lastDigit = minutes % 10;
    const lastTwoDigits = minutes % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "минут";
    if (lastDigit === 1) return "минута";
    if (lastDigit >= 2 && lastDigit <= 4) return "минуты";
    return "минут";
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextValue = formatDateInputValue(targetDate);
    setInputValue(nextValue);

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
    console.log(file);
  };

  const resetBackground = () => {
    localStorage.removeItem('bgUrlStorage')
    setbgUrl('')
  }


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
          <div className="date-picker">
            <label className="date-picker__label" htmlFor="target-date">
              Выберите дату.
            </label>
            <div className="date-picker__controls">
              <input
                id="target-date"
                className="date-picker__input"
                type="date"
                value={inputValue}
                onChange={handleDateChange}
              />
              <button
                type="button"
                className="date-picker__button"
                onClick={resetToNewYear}
              >
                Новый Год
              </button>
            </div>
          </div>
          <div className="background_picker">
            <label className="custom-file-upload">
              <input
                type="file"
                accept="image/*"
                className="background_picker_btn"
                style={{ display: "none" }}
                onChange={selectBackground}
              />
              Выбрать фон
            </label>
            <button className="reset_bg_btn" onClick={resetBackground}>Сбросить фон</button>
          </div>

          <div className="countdown-grid">
            <article className="time-block">
              <div className="time-value">{timeLeft.days}</div>
              <div className="time-label">{getDayWord(timeLeft.days)}</div>
            </article>

            <article className="time-block">
              <div className="time-value">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <div className="time-label">{getHourWord(timeLeft.hours)}</div>
            </article>

            <article className="time-block">
              <div className="time-value">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="time-label">
                {getMinuteWord(timeLeft.minutes)}
              </div>
            </article>

            <article className="time-block">
              <div className="time-value">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="time-label">секунд</div>
            </article>
          </div>

          <p className="current-time">
            Настоящие время: <span>{showTime}</span>
          </p>
        </section>
      </div>
    </main>
  );
}

export default App;
