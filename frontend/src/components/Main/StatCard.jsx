
 function StatCard({card}) {
  return (
   <div key={card.title} className="rounded-sm border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2">
            <p className="text-[12px] font-medium uppercase text-[var(--color-text-muted)]">{card.title}</p>
            <div className="mt-4 flex items-center gap-2 text-[28px] font-semibold text-[var(--color-text)]">
              <span>{card.value}</span>
            </div>
          </div>
  )
}

export default StatCard;