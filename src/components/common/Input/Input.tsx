import React, { useRef } from "react";

interface InputProps extends React.PropsWithChildren {
  id?: string | number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  type: React.HTMLInputTypeAttribute;
  value?: string | number;
  style?: React.CSSProperties;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  onInput?: <T = HTMLInputElement | HTMLTextAreaElement>(
    e: React.ChangeEvent<T>
  ) => void;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  callback?: (...args: any[]) => void;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    id,
    min,
    max,
    step,
    type,
    label,
    value,
    style,
    accept,
    required,
    disabled,
    className,
    placeholder,
    readOnly,
    children,
    onInput,
    onChange,
    callback,
  } = props;
  const filePickerRef = useRef<HTMLInputElement>(null);

  function pickFileHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length === 1) {
      const file = event.target.files[0];
      filePickerRef.current && (filePickerRef.current.value = "");
      callback && callback(file);
    }
  }

  return (
    <>
      {label && <label htmlFor={id?.toString()}>{label}</label>}
      {type === "file" ? (
        <>
          <input
            id={id?.toString()}
            type={type}
            min={min}
            max={max}
            step={step}
            style={style}
            accept={accept}
            ref={filePickerRef}
            required={required}
            disabled={disabled}
            className={className}
            placeholder={placeholder}
            readOnly={readOnly}
            onInput={onInput}
            onChange={pickFileHandler}
          />
          <button
            id="file-picker-btn"
            type="button"
            disabled={disabled}
            className={className}
            onClick={() => filePickerRef.current?.click()}
          >
            {children}
          </button>
        </>
      ) : type === "textarea" ? (
        <textarea
          id={id?.toString()}
          value={value}
          style={style}
          required={required}
          disabled={disabled}
          className={className}
          placeholder={placeholder}
          readOnly={readOnly}
          onInput={onInput}
          onChange={onChange}
        ></textarea>
      ) : (
        <input
          id={id?.toString()}
          type={type}
          min={min}
          max={max}
          step={step}
          value={value}
          style={style}
          required={required}
          disabled={disabled}
          className={className}
          placeholder={placeholder}
          readOnly={readOnly}
          onInput={onInput}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default Input;
