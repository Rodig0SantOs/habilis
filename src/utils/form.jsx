import React, { useRef } from "react";

/* Css module */
import style from "./form.module.css";

const FormField = ({
  label,
  type,
  name,
  id,
  placeholder,
  required,
  options = [],
}) => {
  const inputRef = useRef(null);
  return (
    <div className={style.form}>
      <label htmlFor={id} className={style.label}>
        {label}
      </label>

      {type === "select" ? (
        <select
          className={style.input}
          id={id}
          name={name}
          required={required}
          ref={inputRef}
        >
          <option value="">{placeholder || "Selecione..."}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={style.input}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          ref={inputRef}
        />
      )}
    </div>
  );
};

export default FormField;
