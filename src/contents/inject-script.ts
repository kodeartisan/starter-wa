import { Action } from '@/constants'
import wa from '@/libs/wa'
import { initInjectScriptRelays } from '@/relays'
import { postMessage } from '@/utils/util'
import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  matches: ['https://web.whatsapp.com/*'],
  world: 'MAIN',
}

initInjectScriptRelays()

wa.on.ready(() => {
  setTimeout(() => {
    onReady()
  }, 2000)
})

const onReady = () => {
  setTimeout(() => {
    window.postMessage({
      action: Action.Window.READY,
      body: {},
    })
    WPP.on('chat.active_chat', (chat) => {
      const body = {
        name:
          chat.contact?.__x_pushname ||
          chat.contact?.__x_verifiedName ||
          chat.name ||
          chat.formattedTitle,
        number: chat.id.user,
        formattedNumber: chat.id._serialized,
        isUser: chat.id._serialized.includes('@c.us'),
        isGroup: chat.id._serialized.includes('@g.us'),
        isBusiness: chat.contact?.__x_isBusiness,
      }
      postMessage(Action.Window.ACTIVE_CHAT, body)
    })
  }, 1000)
}
