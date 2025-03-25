import React, { useRef } from "react";

/* Css module */
import style from "./form.module.css";

const FormField = ({ label, type, name, id, placeholder, required }) => {
  const inputRef = useRef(null);
  return (
    <div className={style.form}>
      <label htmlFor={id} className={style.label}>
        {label}
      </label>
      <input
        className={style.input}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        ref={inputRef}
      />
    </div>
  );
};

export default FormField;
