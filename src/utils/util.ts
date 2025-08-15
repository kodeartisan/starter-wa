// src/utils/util.ts
import { Action, Message } from '@/constants'
import type { UseFormReturnType } from '@mantine/form'
import _ from 'lodash'

export async function delay(timeoutMs = 1000) {
  await new Promise((resolve) => setTimeout(resolve, timeoutMs))
}

export const generateRandomDelay = (min: number, max: number) => {
  // Calculate the range of multiples of 1000
  const minThousand = Math.ceil(min / 1000)
  const maxThousand = Math.floor(max / 1000)
  // Generate a random integer in that range and multiply by 1000
  const randomThousand =
    Math.floor(Math.random() * (maxThousand - minThousand + 1)) + minThousand
  return randomThousand * 1000
}

export const truncate = (data: string, length: number = 30) => {
  return _.chain(data)
    .thru((str) => (str.length > length ? `${str.slice(0, length)}...` : str))
    .value()
}

export const postMessage = (action: string, body: any = null) => {
  window.postMessage({ action, body })
}

export const showModalUpgrade = () => {
  postMessage(Action.Window.SHOW_MODAL_UPGRADE)
}

export const showModalMain = () => {
  postMessage(Action.Window.SHOW_MODAL_MAIN)
}

export const showModalActivation = () => {
  postMessage(Action.Window.SHOW_MODAL_ACTIVATION)
}

export const showModalProfile = () => {
  postMessage(Action.Window.SHOW_MODAL_PROFILE)
}

export const showModalFaq = () => {
  postMessage(Action.Window.SHOW_MODAL_FAQ)
}

export const getStoreId = () => {
  return process.env.PLASMO_PUBLIC_STORE_ID
}

export const isTypeMessageMedia = (type: string) => {
  return [Message.MEDIA, Message.IMAGE, Message.VIDEO, Message.FILE].includes(
    type,
  )
}

export const formHasErrors = (
  form1: UseFormReturnType<any>,
  form2: UseFormReturnType<any>,
): boolean => {
  let hasError = false
  if (form1.validate().hasErrors) {
    hasError = true
  }
  if (form2.validate().hasErrors) {
    hasError = true
  }
  return hasError
}

export const resetForms = (
  form1: UseFormReturnType<any>,
  form2: UseFormReturnType<any>,
) => {
  form1.reset()
  form2.reset()
}

/**
 * @description Generates a thumbnail from a video file.
 * @param {File} file The video file.
 * @returns {Promise<string>} A promise that resolves with a base64 data URL of the thumbnail.
 */
export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      video.muted = true
      video.playsInline = true

      video.onloadeddata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        video.currentTime = 1 // Seek to 1 second to get a good frame

        video.onseeked = () => {
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            const thumbnailUrl = canvas.toDataURL('image/png')
            URL.revokeObjectURL(video.src) // Clean up memory
            resolve(thumbnailUrl)
          } else {
            reject(new Error('Could not get canvas context.'))
          }
        }
      }

      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video file for thumbnail.'))
      }

      video.src = URL.createObjectURL(file)
    } catch (error) {
      reject(error)
    }
  })
}

export const getContactName = (contact: any) => {
  return (
    contact.name ||
    contact.pushname ||
    contact.notifyName ||
    contact.formattedName ||
    '-'
  )
}
