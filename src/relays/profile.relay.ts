import { Action } from '@/constants'
import { relay } from '@plasmohq/messaging/relay'

const get = () => {
  relay(
    {
      name: Action.Profile.EDIT_BUSINESS_PROFILE,
    },
    async ({ body }) => {
      return WPP.status.get(body)
    },
  )
}

const initProfileRelays = () => {
  get()
}

export default initProfileRelays
