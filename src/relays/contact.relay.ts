import { Action } from '@/constants'
import filterBy from '@/utils/filterBy'
import serialize from '@/utils/serialize'
import { relay } from '@plasmohq/messaging/relay'

const get = () => {
  relay(
    {
      name: Action.Contact.GET,
    },
    async ({ body }) => {
      return await WPP.contact.get(body)
    },
  )
}

const getBusinessProfile = () => {
  relay(
    {
      name: Action.Contact.GET_BUSINESS_PROFILE,
    },
    async ({ body }) => {
      return await WPP.contact.get(body)
    },
  )
}

const getCommonGroups = () => {
  relay(
    {
      name: Action.Contact.GET_COMMON_GROUPS,
    },
    async ({ body }) => {
      return await WPP.contact.get(body)
    },
  )
}

const getProfilePictureUrl = () => {
  relay(
    {
      name: Action.Contact.GET_PROFILE_PICTURE_URL,
    },
    async ({ body }) => {
      const { contactId, full } = body
      return await WPP.contact.getProfilePictureUrl(contactId, full)
    },
  )
}

const getStatus = () => {
  relay(
    {
      name: Action.Contact.GET_STATUS,
    },
    async ({ body }) => {
      return await WPP.contact.getStatus(body)
    },
  )
}

const list = () => {
  relay(
    {
      name: Action.Contact.LIST,
    },
    async (req) => {
      const options = req.body
      const contacts = ((await WPP.contact.list(options)) ?? [])
        .filter(filterBy.dontIncludeLid)
        .map(serialize.contact)

      return contacts
    },
  )
}

const isExist = () => {
  relay(
    {
      name: Action.Contact.IS_EXIST,
    },
    async (req) => {
      try {
        const contactId = req.body
        const result = await WPP.contact.queryExists(contactId)
        return !!result
      } catch (error) {
        return false
      }
    },
  )
}

const initContactRelay = () => {
  get()
  getBusinessProfile()
  getCommonGroups()
  getProfilePictureUrl()
  getStatus()
  isExist()
  list()
}

export default initContactRelay
