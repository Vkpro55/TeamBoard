const TextInput = ({ id, name, type = 'text', autoComplete, value, onChange, placeholder, required }) => {
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
      className="w-full rounded-[4px] border border-[var(--color-border)] bg-[#F6F3F4] px-[17px] py-[10px] text-[14px] text-[#76777D] outline-none"
    />
  )
}

export default TextInput
