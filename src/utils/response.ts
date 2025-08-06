import { Status } from '@/constants'
import type { Response } from '@/types'

const success = <T = any>(data?: T | null): Response<T | undefined | null> => {
  return {
    status: Status.SUCCESS,
    data: data,
  }
}

const error = (error: string | undefined | null): Response<null> => {
  return {
    status: Status.FAILED,
    error: error,
  }
}

export const response = {
  success,
  error,
}
