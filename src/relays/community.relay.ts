import { Action } from '@/constants'
import { relay } from '@plasmohq/messaging/relay'

const all = () => {
  relay(
    {
      name: Action.Blocklist.ALL,
    },
    async ({ body }) => {
      return WPP.blocklist.all()
    },
  )
}

const initCommunityRelays = () => {
  all()
}

export default initCommunityRelays
