export default function Input({
  groupClass,
  label,
  name,
  type,
  required,
  value,
  onChange,
  placeholder,
  minLength,
}) {
  let defaultPlaceHolder;
  if (type === "email") {
    defaultPlaceHolder = "you@example.com";
  } else if (type === "password") {
    defaultPlaceHolder = "••••••••";
  }

  return (
    <div className={`form__group ${groupClass || undefined}`}>
      <label className="form__label" htmlFor={name}>
        {label}
      </label>
      <input
        className="form__input"
        name={name}
        id={name}
        type={type}
        placeholder={placeholder || defaultPlaceHolder}
        required={required}
        onChange={onChange}
        value={value}
        minLength={minLength || (type === "password" ? 8 : "")}
      />
    </div>
  );
}
