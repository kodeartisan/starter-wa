import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type { Wid } from '@wppconnect/wa-js/dist/whatsapp'

export const all = async (): Promise<Wid[]> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Blocklist.ALL,
    body: {},
  })
}

export const blockContact = async (chatId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Blocklist.BLOCK_CONTACT,
    body: chatId,
  })
}

export const isBlocked = async (chatId: string | Wid): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Blocklist.IS_BLOCKED,
    body: chatId,
  })
}

export const unblockContact = async (chatId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Blocklist.UNBLOCK_CONTACT,
    body: chatId,
  })
}
