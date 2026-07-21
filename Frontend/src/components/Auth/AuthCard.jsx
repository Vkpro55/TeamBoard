const AuthCard = ({ title, children }) => {
  return (
    <div className="flex w-full flex-col items-start gap-[24px] rounded-[4px] border border-[var(--color-border)] bg-[var(--color-surface)] p-[25px] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex justify-center items-center w-full">
        <span className="text-[24px] font-bold text-[#1B1B1D]">{title}</span>
      </div>

      {children}
    </div>
  )
}

export default AuthCard
