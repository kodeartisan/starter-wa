import { useToastStore } from '@/stores/toast'

const showSuccess = (message: string, title: string = 'Success') => {
  useToastStore.getState().addToast({
    type: 'success',
    title,
    message,
  })
}

const showError = (message: string, title: string = 'Error') => {
  useToastStore.getState().addToast({
    type: 'error',
    title,
    message,
  })
}

const showInfo = (message: string, title: string = 'Information') => {
  useToastStore.getState().addToast({
    type: 'info',
    title,
    message,
  })
}

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
}
