import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type { SendMessageOptions } from '@wppconnect/wa-js/dist/chat'

/**
 * Add product in cart
 *
 * @example
 * ```javascript
 * const cart = wa.cart.add('[number]@c.us', [
 *   { id: 'productId', qnt: 2 },
 * ]);
 * ```
 */
export const add = async (
  chatId: string,
  products: {
    id: string
    qnt: number
  }[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Cart.ADD,
    body: { chatId, products },
  })
}

/**
 * Clear all items of cart
 *
 */
export const clear = async (wid: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Cart.CLEAR,
    body: wid,
  })
}

/**
 * Get products in cart chat
 *
 * @example
 * ```javascript
 * const cart = wa.cart.get('[number]@c.us');
 * ```
 */
export const get = async (wid: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Cart.GET,
    body: wid,
  })
}

/**
 * Get thumb of a cart
 *
 * @example
 * ```javascript
 * const cart = wa.cart.getThumbFromCart('[number]@c.us');
 * ```
 */
export const getThumbFromCart = async (wid: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Cart.GET_THUMB_FROM_CART,
    body: wid,
  })
}

/**
 * Remove a product in cart
 *
 * @example
 * ```javascript
 * const cart = wa.cart.remove('[number]@c.us', '6987301181294productId');
 * ```
 */
export const remove = async (
  chatId: string,
  productId: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Cart.REMOVE,
    body: { chatId, productId },
  })
}

/**
 * Send a request order to business chat
 *
 * @example
 * ```javascript
 * const cart = wa.cart.submit('[number]@c.us');
 * ```
 *
 * @example
 * ```javascript
 * // Send cart with a custom message
 * const cart = wa.cart.submit('[number]@c.us', 'Custom message here');
 * ```
 */
export const submit = async (
  wid: string,
  msg?: string,
  options?: SendMessageOptions,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Cart.SUBMIT,
    body: { wid, msg, options },
  })
}

/**
 * Update product in cart
 *
 * @example
 * ```javascript
 * const cart = wa.cart.update('[number]@c.us', '6987301181294productId', { quantity: 12 });
 * ```
 */
export const update = async (
  chatId: string,
  productId: string,
  options: { quantity: number },
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Cart.UPDATE,
    body: { chatId, productId, options },
  })
}
