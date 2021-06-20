import React from "react";
import "./utils.scss";

interface IButton {
  label: string;
  disabled?: boolean;
}

const Button = ({ label, disabled }: IButton) => {
  return (
    <div className="ichat-btn-container">
      <button type="submit" disabled={disabled ?? false} className="ichat-btn">
        {label}
      </button>
    </div>
  );
};

export default Button;
