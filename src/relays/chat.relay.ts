import { Action } from '@/constants'
import { response } from '@/utils/response'
import serialize from '@/utils/serialize'
import { relay } from '@plasmohq/messaging/relay'

const archive = () => {
  relay(
    {
      name: Action.Chat.ARCHIVE,
    },
    async ({ body }) => {
      return await WPP.chat.archive(body)
    },
  )
}

const canMarkPlayed = () => {
  relay(
    {
      name: Action.Chat.CAN_MARK_PLAYED,
    },
    async ({ body }) => {
      return await WPP.chat.canMarkPlayed(body)
    },
  )
}

const canMute = () => {
  relay(
    {
      name: Action.Chat.CAN_MUTE,
    },
    async ({ body }) => {
      return WPP.chat.canMute(body)
    },
  )
}

const canReply = () => {
  relay(
    {
      name: Action.Chat.CAN_REPLY,
    },
    async ({ body }) => {
      return await WPP.chat.canReply(body)
    },
  )
}

const clear = () => {
  relay(
    {
      name: Action.Chat.CLEAR,
    },
    async ({ body }) => {
      return await WPP.chat.clear(body)
    },
  )
}

const closeChat = () => {
  relay(
    {
      name: Action.Chat.CLOSE_CHAT,
    },
    async ({ body }) => {
      return await WPP.chat.closeChat()
    },
  )
}

const _delete = () => {
  relay(
    {
      name: Action.Chat.DELETE,
    },
    async ({ body }) => {
      return await WPP.chat.delete(body)
    },
  )
}

const deleteMessage = () => {
  relay(
    {
      name: Action.Chat.DELETE_MESSAGE,
    },
    async ({ body }) => {
      const { chatId, ids, deleteMediaInDevice, revoke } = body
      return await WPP.chat.deleteMessage(
        chatId,
        ids,
        deleteMediaInDevice,
        revoke,
      )
    },
  )
}

const list = () => {
  relay(
    {
      name: Action.Chat.LIST,
    },
    async ({ body }) => {
      console.log('body', body)
      return (await WPP.chat.list(body)).map(serialize.chat)
    },
  )
}

const find = () => {
  relay(
    {
      name: Action.Chat.FIND,
    },
    async (req) => {
      try {
        const chatId = req.body
        const chat = await WPP.chat.find(chatId)
        return response.success(serialize.chat(chat))
      } catch (error) {
        return response.error(error.message)
      }
    },
  )
}

const forwardMessage = () => {
  relay(
    {
      name: Action.Chat.FORWARD_MESSAGE,
    },
    async ({ body }) => {
      const { toChatId, msgId, options } = body
      return await WPP.chat.forwardMessage(toChatId, msgId, options)
    },
  )
}

const get = () => {
  relay(
    {
      name: Action.Chat.GET,
    },
    async ({ body }) => {
      try {
        const chat = WPP.chat.get(body)
        return serialize.chat(chat)
      } catch (error) {}
    },
  )
}

const getActiveChat = () => {
  relay(
    {
      name: Action.Chat.GET_ACTIVE_CHAT,
    },
    async (req) => {
      try {
        const chat = WPP.chat.getActiveChat()
        if (!chat) {
          return null
        }
        return serialize.chat(chat)
      } catch (error) {
        return null
      }
    },
  )
}

const getLastSeen = () => {
  relay(
    {
      name: Action.Chat.GET_LAST_SEEN,
    },
    async ({ body }) => {
      return await WPP.chat.getLastSeen(body)
    },
  )
}

const getMessageACK = () => {
  relay(
    {
      name: Action.Chat.GET_MESSAGE_ACK,
    },
    async ({ body }) => {
      return await WPP.chat.getMessageACK(body)
    },
  )
}

const getMessages = () => {
  relay(
    {
      name: Action.Chat.GET_MESSAGES,
    },
    async ({ body }) => {
      const { chatId, options } = body
      const messages = await WPP.chat.getMessages(chatId, options)
      return messages.map(serialize.message)
    },
  )
}

const getNotes = () => {
  relay(
    {
      name: Action.Chat.GET_NOTES,
    },
    async ({ body }) => {
      return await WPP.chat.getNotes(body)
    },
  )
}

const getPlatformFromMessage = () => {
  relay(
    {
      name: Action.Chat.GET_PLATFORM_MESSAGE,
    },
    async ({ body }) => {
      return WPP.chat.getPlatformFromMessage(body)
    },
  )
}

const markIsComposing = () => {
  relay(
    {
      name: Action.Chat.MARK_IS_COMPOSING,
    },
    async ({ body }) => {
      const { chatId, duration } = body
      return WPP.chat.markIsComposing(chatId, duration)
    },
  )
}

const markIsPaused = () => {
  relay(
    {
      name: Action.Chat.MARK_IS_PAUSED,
    },
    async ({ body }) => {
      return await WPP.chat.markIsPaused(body)
    },
  )
}

const markIsRead = () => {
  relay(
    {
      name: Action.Chat.MARK_IS_READ,
    },
    async ({ body }) => {
      return await WPP.chat.markIsRead(body)
    },
  )
}

const markIsRecording = () => {
  relay(
    {
      name: Action.Chat.MARK_IS_RECORDING,
    },
    async ({ body }) => {
      return await WPP.chat.markIsRecording(body)
    },
  )
}

const markIsUnread = () => {
  relay(
    {
      name: Action.Chat.MARK_IS_UNREAD,
    },
    async ({ body }) => {
      return await WPP.chat.markIsUnread(body)
    },
  )
}

const markPlayed = () => {
  relay(
    {
      name: Action.Chat.MARK_PLAYED,
    },
    async ({ body }) => {
      return await WPP.chat.markPlayed(body)
    },
  )
}

const mute = () => {
  relay(
    {
      name: Action.Chat.MUTE,
    },
    async ({ body }) => {
      const { chatId, time } = body
      return await WPP.chat.mute(chatId, time)
    },
  )
}

const openChatAt = () => {
  relay(
    {
      name: Action.Chat.OPEN_CHAT_AT,
    },
    async ({ body }) => {
      const { chatId, messageId } = body
      return await WPP.chat.openChatAt(chatId, messageId)
    },
  )
}

const openChatFromUnread = () => {
  relay(
    {
      name: Action.Chat.OPEN_CHAT_FROM_UNREAD,
    },
    async ({ body }) => {
      return await WPP.chat.openChatFromUnread(body)
    },
  )
}

const pinMsg = () => {
  relay(
    {
      name: Action.Chat.PIN_MSG,
    },
    async ({ body }) => {
      const { msgId, pin, seconds } = body
      return await WPP.chat.pinMsg(msgId, pin, seconds)
    },
  )
}

const openChatBottom = () => {
  relay(
    {
      name: Action.Chat.OPEN_CHAT_BOTTOM,
    },
    async (req) => {
      try {
        const chatId = req.body
        return await WPP.chat.openChatBottom(chatId)
      } catch (error) {
        return false
      }
    },
  )
}

const setChatList = () => {
  relay(
    {
      name: Action.Chat.SET_CHAT_LIST,
    },
    async (req) => {
      try {
        const { type, ids } = req.body
        await WPP.chat.setChatList(type, ids)
      } catch (error) {
        console.error(`setChatList: ${error}`)
      }
    },
  )
}

const setInputText = () => {
  relay(
    {
      name: Action.Chat.SET_INPUT_TEXT,
    },
    async ({ body }) => {
      const { text, chatId } = body
      return await WPP.chat.setInputText(text, chatId)
    },
  )
}

const setNotes = () => {
  relay(
    {
      name: Action.Chat.SET_NOTES,
    },
    async ({ body }) => {
      const { chatId, content } = body
      return await WPP.chat.setNotes(chatId, content)
    },
  )
}

const downloadMedia = () => {
  relay(
    {
      name: Action.Chat.DOWNLOAD_MEDIA,
    },
    async ({ body: messageId }) => {
      try {
        const media = await Promise.race([
          WPP.chat.downloadMedia(messageId),

          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Error download media')), 3000),
          ),
        ])
        return media
      } catch (error) {
        return null
      }
    },
  )
}

const initChatRelay = () => {
  archive()
  canMarkPlayed()
  canMute()
  canReply()
  clear()
  closeChat()
  _delete()
  deleteMessage()
  downloadMedia()
  find()
  forwardMessage()
  get()
  getActiveChat()
  getLastSeen()
  getMessageACK()
  getMessages()
  getNotes()
  getPlatformFromMessage()
  markIsComposing()
  markIsPaused()
  markIsRead()
  markIsRecording()
  markIsUnread()
  markPlayed()
  mute()
  list()
  openChatBottom()
  openChatAt()
  openChatFromUnread()
  pinMsg()
  setChatList()
  setInputText()
  setNotes()
}

export default initChatRelay
