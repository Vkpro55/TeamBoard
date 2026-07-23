function ProjectStatCard({ title, value, icon: Icon, iconBg }) {
  return (
    <div className="flex items-center gap-3 rounded-sm border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded ${iconBg}`}>
        <Icon className="h-6 w-6 text-[var(--color-text)]" />
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-xs font-medium uppercase text-[var(--color-text-muted)]">{title}</p>
        <span className="text-2xl font-semibold text-[var(--color-text)]">{value}</span>
      </div>
    </div>
  );
}

export default ProjectStatCard;
