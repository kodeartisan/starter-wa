import initBlocklistRelays from './blocklist.relay'
import initCartRelays from './cart.relay'
import initChatRelay from './chat.relay'
import initConnRelays from './conn.relay'
import initContactRelay from './contact.relay'
import initGroupRelay from './group.relay'
import initSendRelay from './send.relay'
import initStatusRelay from './status.relay'

export const initInjectScriptRelays = () => {
  initBlocklistRelays()
  initCartRelays()
  initChatRelay()
  initConnRelays()
  initContactRelay()
  initGroupRelay()
  initSendRelay()
  initStatusRelay()
}
