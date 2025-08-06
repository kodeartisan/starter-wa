import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type { ContactListOptions } from '@wppconnect/wa-js/dist/contact'
import type { Wid } from '@wppconnect/wa-js/dist/whatsapp'

/**
 * Get a contact by id
 *
 * @example
 * ```javascript
 * await wa.contact.get('[number]@c.us');
 * ```
 *
 */

export const get = async (contactId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Contact.GET,
    body: contactId,
  })
}

/**
 * Get the current text status
 *
 * @example
 * ```javascript
 * const url = await wa.contact.getBusinessProfile('[number]@c.us');
 * ```
 *
 */
export const getBusinessProfile = async (
  contactId: string | Wid,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Contact.GET_BUSINESS_PROFILE,
    body: contactId,
  })
}

/**
 * Get all commons groups for the contact
 *
 * @example
 * ```javascript
 * const groups_ids = await wa.contact.getCommonGroups('[number]@c.us');
 * ```
 *
 */
export const getCommonGroups = async (wid: Wid | string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Contact.GET_COMMON_GROUPS,
    body: wid,
  })
}

/**
 * Get the current text status
 *
 * @example
 * ```javascript
 * const url = await wa.contact.getProfilePictureUrl('[number]@c.us');
 * ```
 *
 */
export const getProfilePictureUrl = async (
  contactId: string | Wid,
  full = true,
): Promise<string> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Contact.GET_PROFILE_PICTURE_URL,
    body: { contactId, full },
  })
}

/**
 * Get the current text status
 *
 * @example
 * ```javascript
 * await wa.contact.getStatus('[number]@c.us');
 * ```
 */
export const getStatus = async (contactId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Contact.GET_STATUS,
    body: contactId,
  })
}

export const list = async (options: ContactListOptions = {}): Promise<[]> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Contact.LIST,
    body: options,
  })
}

export const isExist = async (contactId: string | Wid): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Contact.IS_EXIST,
    body: contactId,
  })
}
