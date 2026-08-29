const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl">
        <p className="text-lg font-semibold text-[var(--color-text)]">{title}</p>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-sm border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-sm px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
            }`}
          >
            {busy ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
