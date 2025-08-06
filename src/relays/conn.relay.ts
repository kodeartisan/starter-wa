import { Account, Action } from '@/constants'
import country from '@/utils/country'
import { delay } from '@/utils/util'
import { relay } from '@plasmohq/messaging/relay'
import _ from 'lodash'

const genLinkDeviceCodeForPhoneNumber = () => {
  relay(
    {
      name: Action.Conn.GEN_LINK_DEVICE_CODE_FOR_PHONE_NUMBER,
    },
    async ({ body }) => {
      const { phone, sendPushNotification } = body
      return await WPP.conn.genLinkDeviceCodeForPhoneNumber(
        phone,
        sendPushNotification,
      )
    },
  )
}

const getAuthCode = () => {
  relay(
    {
      name: Action.Conn.GET_AUTH_CODE,
    },
    async ({ body }) => {
      return await WPP.conn.getAuthCode()
    },
  )
}

const getMyUserId = () => {
  relay(
    {
      name: Action.Conn.GET_MY_USER_ID,
    },
    async (req) => {
      return WPP.conn.getMyUserId()
    },
  )
}

const getProfile = () => {
  relay(
    {
      name: Action.Conn.GET_PROFILE,
    },
    async (req) => {
      await delay(1000)
      const { user: number } = WPP.conn.getMyUserId()
      const contact = await WPP.contact.get(`${number}@c.us`)
      const countryCode =
        await WPP.whatsapp.functions.getCountryShortcodeByPhone(contact.id.user)
      const selectedCountry = country.getCountryByCode(countryCode)
      return {
        name:
          contact.pushname ||
          contact.formattedName ||
          contact.name ||
          contact.verifiedName,
        number,
        type: contact.isBusiness ? Account.BUSINESS : Account.PERSONAL,
        country: selectedCountry.label,
      }
    },
  )
}

const initConnRelays = () => {
  genLinkDeviceCodeForPhoneNumber()
  getAuthCode()
  getMyUserId()
  getProfile()
}

export default initConnRelays
