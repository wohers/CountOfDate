import React from "react";

interface BackgroundPickerProps {
  onSelectBackground: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetBackground: () => void;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  onSelectBackground,
  onResetBackground,
}) => {
  return (
    <div className="background_picker">
      <label className="custom-file-upload">
        <input
          type="file"
          accept="image/*"
          className="background_picker_btn"
          style={{ display: "none" }}
          onChange={onSelectBackground}
        />
        Выбрать фон
      </label>
      <button className="reset_bg_btn" onClick={onResetBackground}>
        Сбросить фон
      </button>
    </div>
  );
};
