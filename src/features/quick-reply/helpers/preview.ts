// src/features/quick-reply/helpers/preview.ts
import { Message } from '@/constants'
import type { QuickReply } from '@/libs/db'
import { truncate } from '@/utils/util'

/**
 * @description Generates a consistent text preview for a quick reply based on its type and content.
 * @param {QuickReply} reply - The quick reply object.
 * @param {number} [length=50] - The maximum length for the preview string before truncation.
 * @returns {string} A descriptive string preview of the message content.
 */
export const getQuickReplyMessagePreview = (
  reply: QuickReply,
  length: number = 50,
): string => {
  const { type, message } = reply
  if (!message) return `[${type}]`

  let previewText: string

  switch (type) {
    case Message.TEXT:
      previewText = message as string
      break
    case Message.IMAGE:
    case Message.VIDEO:
      previewText = (message as { caption?: string }).caption || `[${type}]`
      break
    case Message.FILE:
      // The message for a file is its caption, stored as a string.
      previewText = (message as string) || `[${type}]`
      break
    case Message.LOCATION:
      previewText =
        (message as { name?: string; address?: string }).name ||
        (message as { name?: string; address?: string }).address ||
        'Location'
      break
    case Message.POLL:
      previewText = (message as { name: string }).name || 'Poll'
      break
    case Message.VCARD:
      const count = Array.isArray(message) ? (message as any[]).length : 0
      previewText = `Contact Card (${count} contact${count !== 1 ? 's' : ''})`
      break
    default:
      previewText = `[Unsupported Type: ${type}]`
      break
  }

  return truncate(previewText, length)
}
