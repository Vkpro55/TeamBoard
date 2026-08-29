import { useMemo, useRef, useState } from 'react'
import { ToastContext } from './toastContext'

let toastCounter = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))

    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }

  const pushToast = (message, type = 'success') => {
    const id = ++toastCounter
    setToasts((current) => [...current, { id, message, type }])

    const timer = window.setTimeout(() => {
      removeToast(id)
    }, 3000)

    timersRef.current.set(id, timer)
  }

  const value = useMemo(
    () => ({
      success: (message) => pushToast(message, 'success'),
      error: (message) => pushToast(message, 'error'),
      info: (message) => pushToast(message, 'info'),
      removeToast,
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-sm border px-4 py-3 text-sm shadow-lg ${
              toast.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : toast.type === 'info'
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{toast.message}</p>
              <button type="button" onClick={() => removeToast(toast.id)} className="font-semibold leading-none">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}