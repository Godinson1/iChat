import React from "react";
import "./utils.scss";

interface IInput {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label: string;
  type?: string;
  required?: boolean;
  name: string;
  value: string;
  error: string | undefined | null;
}

const Input = ({
  onChange,
  label,
  type,
  value,
  name,
  error,
  required,
}: IInput) => {
  return (
    <div>
      <div className="ichat-input-container">
        <div id="label">
          <label>{label}</label>
        </div>
        <input
          value={value}
          name={name}
          placeholder={label}
          required={required}
          className={error ? "ichat-input-error" : "ichat-input"}
          onChange={onChange}
          type={type ?? "text"}
        />
        <span id="error">{error && error}</span>
      </div>
      {error && <br />}
    </div>
  );
};

export default Input;
