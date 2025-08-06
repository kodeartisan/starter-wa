import { Action } from '@/constants'
import { relay } from '@plasmohq/messaging/relay'

const get = () => {
  relay(
    {
      name: Action.Status.GET,
    },
    async ({ body }) => {
      return WPP.status.get(body)
    },
  )
}

const getMyStatus = () => {
  relay(
    {
      name: Action.Status.GET_MY_STATUS,
    },
    async ({ body }) => {
      return await WPP.status.getMyStatus()
    },
  )
}

const remove = () => {
  relay(
    {
      name: Action.Status.REMOVE,
    },
    async ({ body }) => {
      return await WPP.status.remove(body)
    },
  )
}

const sendImageStatus = () => {
  relay(
    {
      name: Action.Status.SEND_IMAGE_STATUS,
    },
    async ({ body }) => {
      const { content, options } = body
      return await WPP.status.sendImageStatus(content, options)
    },
  )
}

const sendReadStatus = () => {
  relay(
    {
      name: Action.Status.SEND_READ_STATUS,
    },
    async ({ body }) => {
      const { chatId, statusId } = body
      return await WPP.status.sendReadStatus(chatId, statusId)
    },
  )
}

const sendTextStatus = () => {
  relay(
    {
      name: Action.Status.SEND_TEXT_STATUS,
    },
    async ({ body }) => {
      const { content, options } = body
      return await WPP.status.sendTextStatus(content, options)
    },
  )
}

const sendVideoStatus = () => {
  relay(
    {
      name: Action.Status.SEND_VIDEO_STATUS,
    },
    async ({ body }) => {
      const { content, options } = body
      return await WPP.status.sendVideoStatus(content, options)
    },
  )
}

const updateParticipants = () => {
  relay(
    {
      name: Action.Status.UPDATE_PARTICIPANTS,
    },
    async ({ body }) => {
      return await WPP.status.updateParticipants(body)
    },
  )
}

const initStatusRelay = () => {
  get()
  getMyStatus()
  remove()
  sendImageStatus()
  sendReadStatus()
  sendTextStatus()
  sendVideoStatus()
  updateParticipants()
}

export default initStatusRelay
