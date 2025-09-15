import type {
  ChatModel,
  ContactModel,
  GroupMetadataModel,
  MediaDataModel,
  MsgModel,
  ParticipantModel,
} from '@wppconnect/wa-js/dist/whatsapp'
import _ from 'lodash'

const button = (buttons: any[]) => {
  return buttons
    .map(({ type, label, value }) => {
      switch (type) {
        case 'text':
          return { text: value }
        case 'url':
          return { text: label, url: value }
        case 'phoneNumber':
          return { text: label, phoneNumber: value }
        default:
          break
      }
    })
    .filter((button) => !!button)
}

const list = (rows: any[]) => {
  return rows.filter((row) => row.title !== '')
}

const contact = (contact: ContactModel) => {
  if (!contact) return {}

  const hasUnread = WPP.chat.get(contact.id._serialized)?.hasUnread ?? false
  return {
    id: contact.id._serialized,
    //@ts-ignore
    phoneNumber: contact?.phoneNumber?.user || contact.id?.user,
    avatar: contact.getProfilePicThumb().__x_eurl,
    name: contact.name,
    pushname: contact.pushname,
    shortname: contact.shortName,
    notifyName: contact.notifyName,
    formattedName: contact.formattedName,
    formattedPhone: contact.formattedPhone,
    formattedShortName: contact.formattedShortName,
    formattedShortNameWithNonBreakingSpaces:
      contact.formattedShortNameWithNonBreakingSpaces,
    formattedUser: contact.formattedUser,
    isBusiness: contact.isBusiness,
    isContactBlocked: contact.isContactBlocked,
    //@ts-ignore
    isFavorite: contact.isFavorite,
    isGroup: contact.isGroup,
    isMe: contact.isMe,
    isMyContact: contact.isMyContact,
    isUser: contact.isUser,
    isWaContact: contact.isWAContact,
    labels: contact.labels,
    hasUnread,
  }
}

const mediaData = (data?: MediaDataModel) => {
  if (!data) return {}
  return {
    mimeType: data?.mimetype,
    size: data?.size,
    base64: data?.preview?.base64,
    height: data?.fullHeight,
    width: data?.fullWidth,
  }
}

const message = (msgModel: MsgModel) => {
  return {
    id: msgModel.id._serialized,
    ack: msgModel.ack,
    body: msgModel.body,
    from: msgModel.from,
    isViewOnce: msgModel.isViewOnce,
    timestamp: msgModel.t * 1000,
    to: msgModel.to,
    type: msgModel.type,
    mimetype: msgModel.mimetype,
    size: msgModel.size,
    filename: msgModel.filename,
    caption: msgModel.caption,
    duration: msgModel.duration,
    height: msgModel.height,
    width: msgModel.width,
    quotedMessage: msgModel.quotedMsg,
    contact: contact(msgModel.senderObj),
  }
}

const groupMetadata = (data: GroupMetadataModel) => {
  return {
    id: data?.id?._serialized,
    description: data?.desc,
    size: data?.size,
    subject: data?.subject,
    creation: data?.creation * 1000,
    participants: data?.participants?.getModelsArray().map(participant),
  }
}

const chat = (chat: ChatModel) => {
  return {
    id: chat.id._serialized,
    name: chat.name,
    messages: chat.msgs.getModelsArray().map(message),
    contact: contact(chat.contact),
    groupMetadata: groupMetadata(chat.groupMetadata),
  }
}

const participant = (participant: ParticipantModel) => {
  return {
    isAdmin: participant.isAdmin,
    isSuperAdmin: participant.isSuperAdmin,
    contact: contact(participant.contact),
  }
}

export default {
  button,
  list,
  contact,
  chat,
  participant,
  message,
}
