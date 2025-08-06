import { Action } from '@/constants'
import { response } from '@/utils/response'
import { relay } from '@plasmohq/messaging/relay'

const sendText = () => {
  relay(
    {
      name: Action.Send.TEXT,
    },
    async (req) => {
      try {
        const { chatId, content, options } = req.body
        const { sendMsgResult } = await WPP.chat.sendTextMessage(
          chatId,
          content,
          options,
        )
        const result = await sendMsgResult

        return response.success(result)
      } catch (error) {
        return response.error(error.message)
      }
    },
  )
}

const sendFile = () => {
  relay(
    {
      name: Action.Send.FILE,
    },
    async (req) => {
      console.log('req', req)
      try {
        const { chatId, content, options } = req.body
        const { sendMsgResult } = await WPP.chat.sendFileMessage(
          chatId,
          content,
          options,
        )
        const result = await sendMsgResult

        return response.success(result)
      } catch (error) {
        return response.error(error.message)
      }
    },
  )
}
const sendLocation = () => {
  relay(
    {
      name: Action.Send.LOCATION,
    },
    async (req) => {
      try {
        const { chatId, options } = req.body
        const { sendMsgResult } = await WPP.chat.sendLocationMessage(
          chatId,
          options,
        )
        const result = await sendMsgResult

        return response.success(result)
      } catch (error) {
        return response.error(error.message)
      }
    },
  )
}

const sendPoll = () => {
  relay(
    {
      name: Action.Send.POLL,
    },
    async (req) => {
      try {
        const { chatId, name, choices, options } = req.body
        const { sendMsgResult } = await WPP.chat.sendCreatePollMessage(
          chatId,
          name,
          choices,
          options,
        )
        const result = await sendMsgResult

        return response.success(result)
      } catch (error) {
        return response.error(error.message)
      }
    },
  )
}

const sendVCard = () => {
  relay(
    {
      name: Action.Send.VCARD,
    },
    async (req) => {
      try {
        const { chatId, contacts, options } = req.body
        const { sendMsgResult } = await WPP.chat.sendVCardContactMessage(
          chatId,
          contacts,
          options,
        )
        const result = await sendMsgResult

        return response.success(result)
      } catch (error) {
        return response.error(error.message)
      }
    },
  )
}

const initSendRelay = () => {
  sendText()
  sendFile()
  sendLocation()
  sendPoll()
  sendVCard()
}

export default initSendRelay
