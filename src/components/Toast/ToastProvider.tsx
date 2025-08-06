import { useToastStore } from '@/stores/toast'
import { Box } from '@mantine/core'
import React from 'react'
import ToastComponent from './Toast'

const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useToastStore()

  return (
    <Box
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Box>
  )
}

export default ToastProvider
