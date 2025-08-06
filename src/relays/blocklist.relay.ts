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

const blockContact = () => {
  relay(
    {
      name: Action.Blocklist.BLOCK_CONTACT,
    },
    async ({ body }) => {
      return await WPP.blocklist.blockContact(body)
    },
  )
}

const isBlocked = () => {
  relay(
    {
      name: Action.Blocklist.IS_BLOCKED,
    },
    async ({ body }) => {
      return WPP.blocklist.isBlocked(body)
    },
  )
}

const unblockContact = () => {
  relay(
    {
      name: Action.Blocklist.UNBLOCK_CONTACT,
    },
    async ({ body }) => {
      return WPP.blocklist.unblockContact(body)
    },
  )
}

const initBlocklistRelays = () => {
  all()
  blockContact()
  isBlocked()
  unblockContact()
}

export default initBlocklistRelays
