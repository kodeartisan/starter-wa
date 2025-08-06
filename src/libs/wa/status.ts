import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type {
  ImageStatusOptions,
  TextStatusOptions,
  VideoStatusOptions,
} from '@wppconnect/wa-js/dist/status'
import type { MsgKey, Wid } from '@wppconnect/wa-js/dist/whatsapp'

export const get = async (chatId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Status.GET,
    body: chatId,
  })
}

export const getMyStatus = async (): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Status.GET_MY_STATUS,
    body: {},
  })
}

export const remove = async (msgId: string | MsgKey): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Status.REMOVE,
    body: msgId,
  })
}

/**
 * Send a image message to status stories
 *
 * @example
 * ```javascript
 * wa.status.sendImageStatus('data:image/jpeg;base64,<a long base64 file...>');
 * ```
 */
export const sendImageStatus = async (
  content: any,
  options: ImageStatusOptions = {},
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Status.SEND_IMAGE_STATUS,
    body: { content, options },
  })
}

/**
 * Mark status as read/seen
 *
 * @example
 * ```javascript
 * wa.status.sendReadStatus('[phone_number]@c.us', 'false_status@broadcast_3A169E0FD4BC6E92212F_5521526232927@c.us');
 * ```
 */
export const sendReadStatus = async (
  chatId: string | Wid,
  statusId: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Status.SEND_READ_STATUS,
    body: { chatId, statusId },
  })
}

/**
 * Send a text message to status stories
 *
 * @example
 * ```javascript
 * wa.status.sendTextStatus(`Bootstrap primary color: #0275d8`, { backgroundColor: '#0275d8', font: 2});
 * ```
 */
export const sendTextStatus = async (
  content: any,
  options: TextStatusOptions = {},
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Status.SEND_TEXT_STATUS,
    body: { content, options },
  })
}

/**
 * Send a video message to status stories
 *
 * @example
 * ```javascript
 * wa.status.sendVideoStatus('data:video/mp4;base64,<a long base64 file...>');
 * ```
 */
export const sendVideoStatus = async (
  content: any,
  options: VideoStatusOptions = {},
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Status.SEND_VIDEO_STATUS,
    body: { content, options },
  })
}

/**
 * Define a custom list of participants to send the status message
 *
 * @example
 * ```javascript
 * // Use a custom list
 * await wa.status.updateParticipants(['123@c.us', '456@c.us']);
 * // Use the contacts by default
 * await wa.status.updateParticipants(null);
 * ```
 */
export const updateParticipants = async (
  ids?: (string | Wid)[] | null,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Status.UPDATE_PARTICIPANTS,
    body: ids,
  })
}
