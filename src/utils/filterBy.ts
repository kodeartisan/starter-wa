import { AccountType, ContactType, MessageType } from '@/constants'
import type { ContactModel } from '@wppconnect/wa-js/dist/whatsapp'

const dontIncludeLid = (contact: ContactModel) => contact.id.server !== 'lid'

const dontIncludeMe = (contact: any, number: any) =>
  contact.phoneNumber !== number

const accountType = (contact: any, type: string) => {
  switch (type) {
    case AccountType.ALL:
      return true
    case AccountType.PERSONAL:
      return contact.isBusiness === false
    case AccountType.BUSINESS:
      return contact.isBusiness === true
    default:
      return true
  }
}

const contactType = (contact: any, type: string): boolean => {
  switch (type) {
    case ContactType.ALL:
      return true
    case ContactType.SAVED_CONTACTS:
      return contact.isMyContact === true
    case ContactType.UNSAVED_CONTACTS:
      return contact.isMyContact === false
    default:
      return true
  }
}

const includeAdmin = (data: any, isIncludeAdmin: boolean) => {
  if (isIncludeAdmin) {
    if (data.isAdmin) {
      return true
    }
  } else {
    if (data.isAdmin) return false
  }
  return true
}

const onlyMyContact = (data: any, onlyMyContact: boolean) => {
  if (onlyMyContact) {
    return data.isMyContact === true
  } else {
    return data.isMyContact !== true
  }
}

const messageType = (contact: any, type: string): boolean => {
  switch (type) {
    case MessageType.ALL:
      return true
    case MessageType.HAVE_UNREAD_MESSAGES:
      return contact.hasUnread === true
    case MessageType.NO_UNREAD_MESSAGES:
      return contact.hasUnread === false
    default:
      return true
  }
}

const country = (contact: any, country: string) => {
  const countryCode = WPP.whatsapp.functions.getCountryShortcodeByPhone(
    contact.id.user,
  )
  return countryCode === country
}

export default {
  dontIncludeLid,
  dontIncludeMe,
  accountType,
  includeAdmin,
  onlyMyContact,
  contactType,
  messageType,
  country,
}
