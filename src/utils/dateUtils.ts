import { format } from "date-fns";

export const STORAGE_KEY = "countdown-target-date";
export const HISTORY_KEY = "countdown-date-history";

export const formatDateInputValue = (date: Date) => format(date, "yyyy-MM-dd");

export const getDefaultTargetDate = () => {
  const now = new Date();
  return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
};

export const parseStoredDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getStoredDateValue = () => {
  if (typeof window === "undefined") {
    return getDefaultTargetDate();
  }

  const savedDate = parseStoredDate(window.localStorage.getItem(STORAGE_KEY));
  return savedDate ?? getDefaultTargetDate();
};

export const getDayWord = (days: number) => {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "дней";
  if (lastDigit === 1) return "день";
  if (lastDigit >= 2 && lastDigit <= 4) return "дня";
  return "дней";
};

export const getHourWord = (hours: number) => {
  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "часов";
  if (lastDigit === 1) return "час";
  if (lastDigit >= 2 && lastDigit <= 4) return "часа";
  return "часов";
};

export const getMinuteWord = (minutes: number) => {
  const lastDigit = minutes % 10;
  const lastTwoDigits = minutes % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "минут";
  if (lastDigit === 1) return "минута";
  if (lastDigit >= 2 && lastDigit <= 4) return "минуты";
  return "минут";
};
