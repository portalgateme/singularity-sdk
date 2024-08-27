import React, { createContext, useRef } from 'react'
import CustomToast from '../../components/Toast/CustomToast'
import { toast } from 'react-toastify'

interface Props {
  children: React.ReactNode
}

export interface Toast {
  showPendingToast: (hash?: string, message?: string, hint?: string) => void
  updatePendingToast: (hash?: string, message?: string, hint?: string) => void
  showSuccessToast: (hash?: string, message?: string) => void
  closeToast: () => void
  showWarningToast: (hash?: string, message?: string) => void
}

export const ToastContext = createContext<Toast>({
  showPendingToast: () => undefined,
  updatePendingToast: () => undefined,
  showSuccessToast: () => undefined,
  closeToast: () => undefined,
  showWarningToast: () => undefined,
})

export const ToastProvider: React.FC<Props> = ({ children }) => {
  const toastId = useRef<number | string>(0)

  const showPendingToast = (hash?: string, message?: string, hint?: string) => {
    toastId.current = toast.loading(
      <CustomToast hash={hash} message={message ?? 'Transaction Pending'} hint={hint} />,
      { closeButton: true },
    )
  }

  const updatePendingToast = (hash?: string, message?: string, hint?: string) => {
    toast.update(toastId.current, {
      render: (
        <CustomToast hash={hash} message={message ?? 'Transaction Pending'} hint={hint}/>
      ),
      isLoading: true,
      closeButton: true,
    })
  }

  const closeToast = () => {
    toast.dismiss(toastId.current)
  }

  const showSuccessToast = (hash?: string, message?: string) => {
    toast.update(toastId.current, {
      render: (
        <CustomToast
          hash={hash}
          message={message ?? 'Transaction successful'}
        />
      ),
      type: 'success',
      isLoading: false,
      autoClose: 5000,
      closeButton: true,
    })
  }

  const showWarningToast = (hash?: string, message?: string) => {
    toast.update(toastId.current, {
      render: <CustomToast hash={hash} message={message ?? 'Warning'} />,
      type: 'warning',
      isLoading: false,
      autoClose: 5000,
      closeButton: true,
    })
  }

  return (
    <ToastContext.Provider
      value={{
        showPendingToast,
        updatePendingToast,
        closeToast,
        showSuccessToast,
        showWarningToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export default ToastProvider
