import { Action } from '@/constants'
import type { Response } from '@/types'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type {
  ChatListOptions,
  DeleteMessageReturn,
  ForwardMessagesOptions,
  GetMessagesOptions,
  RawMessage,
} from '@wppconnect/wa-js/dist/chat'
import type { ParticipantStatusACK } from '@wppconnect/wa-js/dist/chat/functions/getMessageACK'
import type { Stringable } from '@wppconnect/wa-js/dist/types'
import type { MsgKey, MsgModel, Wid } from '@wppconnect/wa-js/dist/whatsapp'
import type { ACK } from '@wppconnect/wa-js/dist/whatsapp/enums'

/**
 * Archive a chat
 *
 * @example
 * // Archive a chat
 * wa.chat.archive('[number]@c.us');
 *
 * // Unarchive a chat
 * wa.chat.archive('[number]@c.us', false);
 * ```
 */
export const archive = async (
  chatId: string | Wid,
  archive = true,
): Promise<{
  wid: Wid
  archive: boolean
}> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.ARCHIVE,
    body: { chatId, archive },
  })
}

/**
 * Get if message can played
 *
 * @example
 * ```javascript
 * wa.chat.canMarkPlayed('[message_id]');
 * ```
 */
export const canMarkPlayed = async (
  messageId: string | MsgKey | MsgModel | Stringable,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.CAN_MARK_PLAYED,
    body: messageId,
  })
}

/**
 * Check if is possible to mute this chat
 *
 * @example
 * ```javascript
 * const canMute = wa.chat.canMute('[number]@c.us');
 * ```
 */
export const canMute = async (chatId: string | Wid): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.CAN_MUTE,
    body: chatId,
  })
}

/**
 * Get if message can reply
 *
 * @example
 * ```javascript
 * wa.chat.canReply('[message_id]');
 * ```
 */
export const canReply = async (
  messageId: string | MsgKey | MsgModel | Stringable,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.CAN_REPLY,
    body: messageId,
  })
}

/**
 * Clear a chat message
 *
 */
export const clear = async (
  chatId: string | Wid,
  keepStarred = true,
): Promise<{
  wid: Wid
  status: number
  keepStarred: boolean
}> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.CLEAR,
    body: { chatId, keepStarred },
  })
}

/**
 * Close the chat tab
 *
 * @example
 * ```javascript
 * await wa.chat.closeChat();
 * ```
 *
 */
export const closeChat = async (): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.CLOSE_CHAT,
    body: {},
  })
}

/**
 * Delete a chat
 *
 */
export const _delete = async (chatId: string | Wid): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.DELETE,
    body: chatId,
  })
}

/**
 * Delete a message
 *
 * @example
 * ```javascript
 * // Delete a message
 * wa.chat.deleteMessage('[number]@c.us', 'msgid');
 * // Delete a list of messages
 * wa.chat.deleteMessage('[number]@c.us', ['msgid1', 'msgid2]);
 * // Delete a message and delete media
 * wa.chat.deleteMessage('[number]@c.us', 'msgid', true);
 * // Revoke a message
 * wa.chat.deleteMessage('[number]@c.us', 'msgid', true, true);
 * ```
 *
 */
export const deleteMessage = async (
  chatId: string | Wid,
  ids: string | string[],
  deleteMediaInDevice = false,
  revoke = false,
): Promise<DeleteMessageReturn | DeleteMessageReturn[]> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.DELETE_MESSAGE,
    body: { chatId, ids, deleteMediaInDevice, revoke },
  })
}

export const find = async (chatId: string | Wid): Promise<Response<any>> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.FIND,
    body: chatId,
  })
}

/**
 * Forward messages to a chat
 *
 * @example
 * ```javascript
 * // Forward messages
 * wa.chat.forwardMessage('[number]@c.us', 'true_[number]@c.us_ABCDEF');
 * ```
 */
export const forwardMessage = async (
  toChatId: string | Wid,
  msgId: string | MsgKey,
  options: ForwardMessagesOptions = {},
): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.FORWARD_MESSAGE,
    body: { toChatId, msgId, options },
  })
}

/**
 * Find a chat by id
 *
 */
export const get = async (chatId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.GET,
    body: chatId,
  })
}

export const getActiveChat = async () => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.GET_ACTIVE_CHAT,
    body: {},
  })
}

/**
 * Get timestamp of last seen
 * @example
 * ```javascript
 * wa.chat.getLastSeen('[number]@c.us');
 * ```
 */
export const getLastSeen = async (
  chatId: string | Wid,
): Promise<number | boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.GET_LAST_SEEN,
    body: chatId,
  })
}

/**
 * Get message ACK from a message
 *
 * @example
 * ```javascript
 * // Get message ACK
 * const ackInfo = await WPP.chat.getMessageACK('true_[number]@c.us_ABCDEF');
 *
 * console.log(ackInfo.deliveryRemaining); // Delivery Remaining
 * console.log(ackInfo.readRemaining); // Read Remaining
 * console.log(ackInfo.playedRemaining); // PlayedRemaining, for audio(ptt) only
 *
 * console.log(ackInfo.participants[0].deliveredAt); // Delivered At, in timestamp format
 * console.log(ackInfo.participants[0].readAt); // Read At, in timestamp format
 * console.log(ackInfo.participants[0].playedAt); // Played At, in timestamp format, for audio(ptt) only
 *
 * //To get only how was received
 * const received = ackInfo.participants.filter(p => p.deliveredAt || p.readAt || p.playedAt);
 *
 * //To get only how was read
 * const read = ackInfo.participants.filter(p => p.readAt || p.playedAt);
 *
 * //To get only how was played
 * const played = ackInfo.participants.filter(p => p.playedAt);
 * ```
 */
export const getMessageACK = async (
  msgId: string | MsgKey,
): Promise<{
  ack: ACK
  fromMe: boolean
  deliveryRemaining: number
  readRemaining: number
  playedRemaining: number
  participants: ParticipantStatusACK[]
}> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.GET_MESSAGE_ACK,
    body: msgId,
  })
}

/**
 * Fetch messages from a chat
 *
 * @example
 * ```javascript
 * // Some messages
 * wa.chat.getMessages('[number]@c.us', {
 *   count: 20,
 * });
 *
 * // All messages
 * wa.chat.getMessages('[number]@c.us', {
 *   count: -1,
 * });
 *
 * // Last 20 unread messages
 * wa.chat.getMessages('[number]@c.us', {
 *   count: 20,
 *   onlyUnread: true,
 * });
 *
 * // All unread messages
 * wa.chat.getMessages('[number]@c.us', {
 *   count: -1,
 *   onlyUnread: true,
 * });
 *
 * // 20 messages before specific message
 * wa.chat.getMessages('[number]@c.us', {
 *   count: 20,
 *   direction: 'before',
 *   id: '<full message id>'
 * });
 *
 * // Only media messages (url, document and links)
 * wa.chat.getMessages('[number]@c.us', {
 *   count: 20,
 *   media: 'all',
 * });
 *
 * // Only image messages
 * wa.chat.getMessages('[number]@c.us', {
 *   count: 20,
 *   media: 'image',
 * });
 *
 * // Only document messages
 * wa.chat.getMessages('[number]@c.us', {
 *   count: 20,
 *   media: 'document',
 * });
 *
 * // Only link (url) messages
 * wa.chat.getMessages('[number]@c.us', {
 *   count: 20,
 *   media: 'url',
 * });
 * ```
 */
export const getMessages = async (
  chatId: string | Wid,
  options: GetMessagesOptions = {},
): Promise<any[]> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.GET_MESSAGES,
    body: { chatId, options },
  })
}

/**
 * Get notes from a contact
 * Only when are connected with business device
 * @example
 * ```javascript
 * wa.chat.getNotes('[number]@c.us', 'Text for your notes');
 * ```
 */
export const getNotes = async (chatId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.GET_NOTES,
    body: chatId,
  })
}

/**
 * Get the platform message from message ID
 *
 * The platform can be:
 * * android
 * * iphone
 * * web
 * * unknown
 *
 * @example
 * ```javascript
 * // to get platform from a message
 * const platform = wa.chat.getPlatformFromMessage('[message_id]');
 * ```
 */
export const getPlatformFromMessage = async (
  messageId: string | MsgKey | MsgModel | Stringable,
): Promise<'android' | 'iphone' | 'web' | 'unknown'> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.GET_PLATFORM_MESSAGE,
    body: messageId,
  })
}

/**
 * Return a list of chats
 *
 * @example
 * ```javascript
 * // All chats
 * const chats = await wa.chat.list();
 *
 * // Some chats
 * const chats = wa.chat.list({count: 20});
 *
 * // 20 chats before specific chat
 * const chats = wa.chat.list({count: 20, direction: 'before', id: '[number]@c.us'});
 *
 * // Only users chats
 * const chats = await wa.chat.list({onlyUsers: true});
 *
 * // Only groups chats
 * const chats = await wa.chat.list({onlyGroups: true});
 *
 * // Only communities chats
 * const chats = await wa.chat.list({onlyCommunities: true});
 *
 * // Only Newsletter
 * const chats = await wa.chat.list({onlyNewsletter: true});
 *
 * // Only with label Text
 * const chats = await wa.chat.list({withLabels: ['Test']});
 *
 * // Only with label id
 * const chats = await wa.chat.list({withLabels: ['1']});
 *
 * // Only with label with one of text or id
 * const chats = await wa.chat.list({withLabels: ['Alfa','5']});
 * ```
 *
 */
export const list = async (options: ChatListOptions = {}): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.LIST,
    body: options,
  })
}

/**
 * Mark a chat to composing state
 * and keep sending "is writting a message"
 *
 * @example
 * ```javascript
 * // Mark is composing
 * wa.chat.markIsComposing('[number]@c.us');
 *
 * // Mark is composing for 5 seconds
 * wa.chat.markIsComposing('[number]@c.us', 5000);
 * ```
 */
export const markIsComposing = async (
  chatId: string | Wid,
  duration?: number,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.MARK_IS_COMPOSING,
    body: { chatId, duration },
  })
}

/**
 * Mark a chat is paused state
 *
 * @example
 * ```javascript
 * // Mark as recording
 * wa.chat.markIsPaused('[number]@c.us');
 * ```
 */
export const markIsPaused = async (chatId: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.MARK_IS_PAUSED,
    body: chatId,
  })
}

/**
 * Mark a chat as read and send SEEN event
 *
 * @example
 * ```javascript
 * // Some messages
 * wa.chat.markIsRead('[number]@c.us');
 * ```
 */
export const markIsRead = async (
  chatId: string,
): Promise<{
  wid: Wid
  unreadCount: number
}> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.MARK_IS_READ,
    body: chatId,
  })
}

/**
 * Mark a chat to recording state
 * and keep sending "is recording"
 *
 * @example
 * ```javascript
 * // Mark is recording
 * wa.chat.markIsRecording('[number]@c.us');
 *
 * // Mark is recording for 5 seconds
 * wa.chat.markIsRecording('[number]@c.us', 5000);
 * ```
 */
export const markIsRecording = async (chatId: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.MARK_IS_RECORDING,
    body: chatId,
  })
}

/**
 * Mark a chat as unread
 *
 * @example
 * ```javascript
 * // Some messages
 * wa.chat.markIsUnread('[number]@c.us');
 * ```
 */
export const markIsUnread = async (
  chatId: string | Wid,
): Promise<{
  wid: Wid
}> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.MARK_IS_UNREAD,
    body: chatId,
  })
}

/**
 * Mark message as played
 *
 * @example
 * ```javascript
 * wa.chat.markPlayed('[message_id]');
 * ```
 */
export const markPlayed = async (
  messageId: string | MsgKey | MsgModel | Stringable,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.MARK_PLAYED,
    body: messageId,
  })
}

/**
 * Mute a chat, you can use duration or expiration
 * For expiration, use unix timestamp (seconds only)
 * For duration, use seconds
 *
 * @example
 * ```javascript
 * // Mute for 60 seconds
 * wa.chat.mute('[number]@c.us', {duration: 60});
 *
 * // Mute util 2021-01-01
 * wa.chat.mute('[number]@c.us', {expiration: 1641006000});
 *
 * // or using date
 * const expiration = new Date('2022-01-01 00:00:00');
 * wa.chat.mute('[number]@c.us', {expiration: expiration});
 * ```
 *
 */
export const mute = async (
  chatId: string | Wid,
  time: { expiration: number | Date } | { duration: number },
): Promise<{
  wid: Wid
  expiration: number
  isMuted: boolean
}> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.MUTE,
    body: { chatId, time },
  })
}

/**
 * Open the chat in the WhatsApp interface in a specific message
 *
 * @example
 * ```javascript
 * await wa.chat.openChatAt('[number]@c.us', <message_id>);
 * ```
 *
 */
export const openChatAt = async (
  chatId: string | Wid,
  messageId: string,
): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.OPEN_CHAT_AT,
    body: { chatId, messageId },
  })
}

/**
 * Open the chat in the WhatsApp interface in bottom position
 *
 * @example
 * ```javascript
 * await wa.chat.openChatBottom('[number]@c.us');
 * ```
 *
 */
export const openChatBottom = async (
  chatId: string,
): Promise<Response<any>> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.OPEN_CHAT_BOTTOM,
    body: chatId,
  })
}

/**
 * Open the chat in the WhatsApp interface from first unread message
 *
 * @example
 * ```javascript
 * await wa.chat.openChatFromUnread('[number]@c.us');
 * ```
 *
 */
export const openChatFromUnread = async (
  chatId: string | Wid,
): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.OPEN_CHAT_FROM_UNREAD,
    body: chatId,
  })
}

/**
 * Pin a message in chat
 *
 * @example
 * ```javascript
 * // Pin a message in chat
 * wa.chat.pinMsg('true_[number]@c.us_ABCDEF');
 *
 * // Pin a message in chat for 30 days
 * wa.chat.pinMsg('true_[number]@c.us_ABCDEF', 2592000);
 *
 * // Unpin a message
 * wa.chat.pinMsg('true_[number]@c.us_ABCDEF', false);
 * ```
 */
export const pinMsg = async (
  msgId: string | MsgKey,
  pin = true,
  seconds = 604800, // default 7 days
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.PIN_MSG,
    body: { msgId, pin, seconds },
  })
}

/**
 * Set custom Chat list in panel of whatsapp
 * * @example
 * ```javascript
 * // Your custom list
 * wa.chat.setChatList('custom', ['number@c.us', 'number2@c.us']);
 *
 * // List only with unread chats
 * wa.chat.setChatList('unread');
 *
 * // List only with favorites chats
 * wa.chat.setChatList('favorites');
 *
 * // List only with groups chats
 * wa.chat.setChatList('group');
 *
 * // List only labels chat
 * wa.chat.setChatList('labels', '454545_labelId');
 * ```
 */
export const setChatList = async (type: string, ids?: string | string[]) => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.SET_CHAT_LIST,
    body: { type, ids },
  })
}

export const setInputText = async (text: string, chatId?: string | Wid) => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.SET_INPUT_TEXT,
    body: { text, chatId },
  })
}

/**
 * Set notes for a contact
 * Only when are connected with business device
 * @example
 * ```javascript
 * wa.chat.setNotes('[number]@c.us', 'Text for your notes');
 * ```
 */
export const setNotes = async (
  chatId: string | Wid,
  content: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Chat.SET_NOTES,
    body: { chatId, content },
  })
}
