import React from "react";
import { getDayWord, getHourWord, getMinuteWord } from "../utils/dateUtils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownGridProps {
  timeLeft: TimeLeft;
}

export const CountdownGrid: React.FC<CountdownGridProps> = ({ timeLeft }) => {
  return (
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
        <div className="time-label">{getMinuteWord(timeLeft.minutes)}</div>
      </article>

      <article className="time-block">
        <div className="time-value">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </div>
        <div className="time-label">секунд</div>
      </article>
    </div>
  );
};
