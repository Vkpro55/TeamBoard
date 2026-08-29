const TextInput = ({ id, name, type = 'text', autoComplete, value, onChange, placeholder, required, className = '' }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full rounded-[4px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[17px] py-[5px] text-[14px] text-[#76777D] outline-none placeholder:text-gray-500 placeholder:italic ${className}`}
    />
  )
}

export default TextInput
