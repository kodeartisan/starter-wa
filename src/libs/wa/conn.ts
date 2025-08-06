import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type { Wid } from '@wppconnect/wa-js/dist/whatsapp'

/**
 * Alternative login method using code
 * Get the Link Device Code for Authentication using the phone number
 *
 * @example
 * ```javascript
 * const code = await wa.conn.genLinkDeviceCodeForPhoneNumber('[number]');
 *
 * // Disable push notification
 * const code = await wa.conn.genLinkDeviceCodeForPhoneNumber('[number]', false);
 * ```
 */
export const genLinkDeviceCodeForPhoneNumber = async (): Promise<string> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Conn.GEN_LINK_DEVICE_CODE_FOR_PHONE_NUMBER,
  })
}

/**
 * Return the current auth code
 *
 * @example
 * ```javascript
 * const authCode = await wa.conn.getAuthCode();
 * console.log(authCode.fullCode); // Output: a long string to generate a QRCode
 * ```
 */
export const getAuthCode = async (): Promise<string> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Conn.GET_AUTH_CODE,
  })
}

export const getMyUserId = async (): Promise<Wid | undefined> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Conn.GET_MY_USER_ID,
  })
}
