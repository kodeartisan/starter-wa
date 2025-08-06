import { Action } from '@/constants'
import { relay } from '@plasmohq/messaging/relay'

const create = () => {
  relay(
    {
      name: Action.Newsletter.CREATE,
    },
    async ({ body }) => {
      const { name, opts } = body
      return await WPP.newsletter.create(name, opts)
    },
  )
}

const destroy = () => {
  relay(
    {
      name: Action.Newsletter.DESTROY,
    },
    async ({ body }) => {
      return await WPP.newsletter.destroy(body)
    },
  )
}

const edit = () => {
  relay(
    {
      name: Action.Newsletter.EDIT,
    },
    async ({ body }) => {
      const { newsletterId, opts } = body
      return await WPP.newsletter.edit(newsletterId, opts)
    },
  )
}

const getSubscribers = () => {
  relay(
    {
      name: Action.Newsletter.GET_SUBSCRIBERS,
    },
    async ({ body }) => {
      return await WPP.newsletter.getSubscribers(body)
    },
  )
}

const mute = () => {
  relay(
    {
      name: Action.Newsletter.MUTE,
    },
    async ({ body }) => {
      const { newsletterId, value } = body
      return await WPP.newsletter.mute(newsletterId, value)
    },
  )
}

const initNewsletterRelay = () => {
  create()
  destroy()
  edit()
  getSubscribers()
  mute()
}

export default initNewsletterRelay
