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
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showTime = format(time, "HH:mm:ss", { locale: ru });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const nextNewYear = setYear(startOfYear(now), currentYear + 1);

      if (now.getMonth() === 0 && now.getDate() === 1) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(
        (nextNewYear.getTime() - now.getTime()) / 1000,
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
    <main className="app">
      <div className="app__content">
        <header className="app__header">
          <h1 className="app__title">There's no time left until the new year!</h1>
          <p className="app__subtitle">Reverse countdown to midnight.</p>
        </header>

        <section className="countdown-card">
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
            Current time: <span>{showTime}</span>
          </p>
        </section>
      </div>
    </main>
  );
}

export default App;
