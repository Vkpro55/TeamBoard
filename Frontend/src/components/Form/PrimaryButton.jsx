const PrimaryButton = ({ type = 'button', children, ...props }) => {
  return (
    <button
      type={type}
      className="w-full rounded-[4px] bg-[var(--color-text)] px-4 sm:px-[132px] py-[8px] text-[14px] font-semibold text-[var(--color-surface)] text-center whitespace-nowrap"
      {...props}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
