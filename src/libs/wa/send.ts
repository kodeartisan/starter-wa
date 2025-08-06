import { Action } from '@/constants'
import type { Response } from '@/types'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type {
  AudioMessageOptions,
  AutoDetectMessageOptions,
  DocumentMessageOptions,
  ImageMessageOptions,
  LocationMessageOptions,
  PoolMessageOptions,
  SendMessageOptions,
  StickerMessageOptions,
  TextMessageOptions,
  VCardContact,
  VideoMessageOptions,
} from '@wppconnect/wa-js/dist/chat'
import type { Wid } from '@wppconnect/wa-js/dist/whatsapp'
import type { SendMsgResult } from '@wppconnect/wa-js/dist/whatsapp/enums'

export const text = async (
  chatId: any,
  content: any,
  options: TextMessageOptions = {},
): Promise<Response<SendMsgResult>> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Send.TEXT,
    body: {
      chatId,
      content,
      options,
    },
  })
}

export const file = async (
  chatId: string | Wid,
  content: string | Blob | File,
  options:
    | AutoDetectMessageOptions
    | AudioMessageOptions
    | DocumentMessageOptions
    | ImageMessageOptions
    | VideoMessageOptions
    | StickerMessageOptions
    | TextMessageOptions,
): Promise<Response<SendMsgResult>> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Send.FILE,
    body: {
      chatId,
      content,
      options,
    },
  })
}

export const location = async (
  chatId: string | Wid,
  options: LocationMessageOptions,
): Promise<Response<SendMsgResult>> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Send.LOCATION,
    body: {
      chatId,
      options,
    },
  })
}

export const poll = async (
  chatId: any,
  name: string,
  choices: string[],
  options?: PoolMessageOptions,
): Promise<Response<SendMsgResult>> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Send.POLL,
    body: {
      chatId,
      name,
      choices,
      options,
    },
  })
}

export const vcard = async (
  chatId: string | Wid,
  contacts: string | Wid | VCardContact | (string | Wid | VCardContact)[],
  options?: SendMessageOptions,
): Promise<Response<SendMsgResult>> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Send.VCARD,
    body: {
      chatId,
      contacts,
      options,
    },
  })
}
