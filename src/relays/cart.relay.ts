import { Action } from '@/constants'
import { relay } from '@plasmohq/messaging/relay'

const add = () => {
  relay(
    {
      name: Action.Cart.ADD,
    },
    async ({ body }) => {
      const { chatId, products } = body
      return await WPP.cart.add(chatId, products)
    },
  )
}

const clear = () => {
  relay(
    {
      name: Action.Cart.CLEAR,
    },
    async ({ body }) => {
      return await WPP.cart.clear(body)
    },
  )
}

const get = () => {
  relay(
    {
      name: Action.Cart.GET,
    },
    async ({ body }) => {
      return WPP.cart.get(body)
    },
  )
}

const getThumbFromCart = () => {
  relay(
    {
      name: Action.Cart.GET_THUMB_FROM_CART,
    },
    async ({ body }) => {
      return await WPP.cart.getThumbFromCart(body)
    },
  )
}

const remove = () => {
  relay(
    {
      name: Action.Cart.REMOVE,
    },
    async ({ body }) => {
      const { chatId, productId } = body
      return WPP.cart.remove(chatId, productId)
    },
  )
}

const submit = () => {
  relay(
    {
      name: Action.Cart.SUBMIT,
    },
    async ({ body }) => {
      const { wid, msg, options } = body
      return WPP.cart.submit(wid, msg, options)
    },
  )
}

const update = () => {
  relay(
    {
      name: Action.Cart.SUBMIT,
    },
    async ({ body }) => {
      const { chatId, productId, options } = body
      return WPP.cart.update(chatId, productId, options)
    },
  )
}

const initCartRelays = () => {
  add()
  clear()
  get()
  getThumbFromCart()
  remove()
  submit()
  update()
}

export default initCartRelays
