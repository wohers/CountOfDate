import React from "react";

interface DatePickerProps {
  inputValue: string;
  onDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetToNewYear: () => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  inputValue,
  onDateChange,
  onResetToNewYear,
}) => {
  return (
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
          onChange={onDateChange}
        />
        <button
          type="button"
          className="date-picker__button"
          onClick={onResetToNewYear}
        >
          Новый Год
        </button>
      </div>
    </div>
  );
};
