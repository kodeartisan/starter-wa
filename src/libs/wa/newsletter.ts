import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'

/**
 * Create a newsletter
 *
 * @example
 * ```javascript
 * // To edit name
 * wa.newsletter.create('Name for your newsletter', {
 * description: 'Description for that',
 * picture: '<base64_string',
 * });
 * ```
 */
export const create = async (
  name: string,
  opts: { description?: string; picture?: string },
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Newsletter.CREATE,
    body: { name, opts },
  })
}

/**
 * Delete a newsletter
 *
 * @example
 * ```javascript
 * const code = wa.newsletter.destroy('[newsletter-id]@newsletter');
 * ```
 */
export const destroy = async (id: string): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Newsletter.DESTROY,
    body: id,
  })
}

/**
 * Edit the newsletter data
 *
 * @example
 * ```javascript
 * // To edit name
 * const code = wa.newsletter.edit('[newsletter-id]@newsletter', {
 * name: 'New Name'
 * });
 *
 * // To edit description
 * const code = wa.newsletter.edit('[newsletter-id]@newsletter', {
 * description: 'New description'
 * });
 *
 * // To change picture
 * const code = wa.newsletter.edit('[newsletter-id]@newsletter', {
 * picture: '<base64_image>'
 * });
 *
 * // To remove picture
 * const code = wa.newsletter.edit('[newsletter-id]@newsletter', {
 * picture: null
 * });
 * ```
 */
export const edit = async (
  newsletterId: string,
  opts: {
    name?: string
    description?: string
    picture?: string
  },
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Newsletter.EDIT,
    body: { newsletterId, opts },
  })
}

/**
 * Get subscribers of a newsletters
 *
 * @example
 * ```javascript
 * const code = wa.newsletter.getSubscribers('[newsletter-id]@newsletter');
 * ```
 */
export const getSubscribers = async (id: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Newsletter.GET_SUBSCRIBERS,
    body: id,
  })
}

/**
 * Mute and unmute a newsletter
 *
 * @example
 * // Mute
 * ```javascript
 * wa.newsletter.mute('[newsletter-id]@newsletter', true);
 * ```
 *
 * // Unmute
 * ```javascript
 * wa.newsletter.mute('[newsletter-id]@newsletter', false);
 * ```
 */
export const mute = async (
  newsletterId: string,
  value?: boolean,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Newsletter.MUTE,
    body: { newsletterId, value },
  })
}
