import { Action } from '@/constants'
import serialize from '@/utils/serialize'
import { relay } from '@plasmohq/messaging/relay'
import { contact } from '@wppconnect/wa-js'
import _ from 'lodash'

const addParticipants = () => {
  relay(
    {
      name: Action.Group.ADD_PARTICIPANTS,
    },
    async ({ body }) => {
      const { groupId, participantsIds } = body
      return await WPP.group.addParticipants(groupId, participantsIds)
    },
  )
}

const approve = () => {
  relay(
    {
      name: Action.Group.APPROVE,
    },
    async ({ body }) => {
      const { groupId, membershipIds } = body
      return await WPP.group.approve(groupId, membershipIds)
    },
  )
}

const canAdd = () => {
  relay(
    {
      name: Action.Group.CAN_ADD,
    },
    async ({ body }) => {
      return await WPP.group.canAdd(body)
    },
  )
}

const canDemote = () => {
  relay(
    {
      name: Action.Group.CAN_DEMOTE,
    },
    async ({ body }) => {
      const { groupId, participantsIds } = body
      return await WPP.group.canDemote(groupId, participantsIds)
    },
  )
}

const canPromote = () => {
  relay(
    {
      name: Action.Group.CAN_PROMOTE,
    },
    async ({ body }) => {
      const { groupId, participantsIds } = body
      return await WPP.group.canPromote(groupId, participantsIds)
    },
  )
}

const canRemove = () => {
  relay(
    {
      name: Action.Group.CAN_REMOVE,
    },
    async ({ body }) => {
      const { groupId, participantsIds } = body
      return await WPP.group.canRemove(groupId, participantsIds)
    },
  )
}

const create = () => {
  relay(
    {
      name: Action.Group.CREATE,
    },
    async ({ body }) => {
      const { groupName, participantsIds, parentGroup } = body
      return await WPP.group.create(groupName, participantsIds, parentGroup)
    },
  )
}

const demoteParticipants = () => {
  relay(
    {
      name: Action.Group.DEMOTE_PARTICIPANTS,
    },
    async ({ body }) => {
      const { groupId, participantsIds } = body
      return await WPP.group.demoteParticipants(groupId, participantsIds)
    },
  )
}

const getGroupInfoFromInviteCode = () => {
  relay(
    {
      name: Action.Group.GET_GROUP_INFO_FROM_INVITE_CODE,
    },
    async ({ body }) => {
      return await WPP.group.getGroupInfoFromInviteCode(body)
    },
  )
}

const getGroupSizeLimit = () => {
  relay(
    {
      name: Action.Group.GET_GROUP_SIZE_LIMIT,
    },
    async ({ body }) => {
      return await WPP.group.getGroupSizeLimit()
    },
  )
}

const list = () => {
  relay(
    {
      name: Action.Group.LIST,
    },
    async ({ body }) => {
      try {
        const me = WPP.conn.getMyUserId()
        const groups = (await WPP.chat.list({ onlyGroups: true })).map(
          (group) => {
            const participants = group.groupMetadata.participants
              .getModelsArray()
              .map(serialize.participant)
              .filter(
                (participant) =>
                  participant.contact.phoneNumber?.user !== me.user,
              )
            const id = `${group.id.user}@${group.id.server}`
            return {
              id,
              name: group.name || group.formattedTitle,
              desc: group.groupMetadata?.desc,
              avatar: group.contact?.getProfilePicThumb().__x_eurl,
              size: group.groupMetadata?.size,
              participants,
              isAdmin: group.groupMetadata?.participants?.iAmAdmin(),
              isSuperAdmin: group.groupMetadata?.participants?.iAmSuperAdmin(),
              superAdmin: serialize.contact(
                group.groupMetadata?.participants?.getSuperAdmin()?.contact,
              ),
              admins: group.groupMetadata?.participants
                ?.getAdmins()
                .map((participant) => serialize.contact(participant.contact)),
            }
          },
        )
        return _.sortBy(groups, 'name')
      } catch (error) {
        return []
      }
    },
  )
}

const getInviteLink = () => {
  relay(
    {
      name: Action.Group.GET_INVITE_LINK,
    },
    async (req) => {
      try {
        const { groupId } = req.body
        const link = await WPP.group.getInviteCode(groupId)
        return `https://chat.whatsapp.com/${link}`
      } catch (error) {
        console.error(`getInviteLink relay error: ${error}`)
        return null
      }
    },
  )
}

const getMembershipRequests = () => {
  relay(
    {
      name: Action.Group.GET_MEMBERSHIP_REQUESTS,
    },
    async ({ body }) => {
      return await WPP.group.getMembershipRequests(body)
    },
  )
}

const getParticipants = () => {
  relay(
    {
      name: Action.Group.GET_PARTICIPANTS,
    },
    async ({ body }) => {
      try {
        const participants = await WPP.group.getParticipants(body)
        return participants.map(serialize.participant)
      } catch (error) {
        return []
      }
    },
  )
}

const iAmAdmin = () => {
  relay(
    {
      name: Action.Group.IAM_ADMIN,
    },
    async ({ body }) => {
      return await WPP.group.iAmAdmin(body)
    },
  )
}

const iAmMember = () => {
  relay(
    {
      name: Action.Group.IAM_MEMBER,
    },
    async ({ body }) => {
      return await WPP.group.iAmMember(body)
    },
  )
}

const iAmRestrictedMember = () => {
  relay(
    {
      name: Action.Group.IAM_RESTRICTED_MEMBER,
    },
    async ({ body }) => {
      return await WPP.group.iAmRestrictedMember(body)
    },
  )
}

const iAmSuperAdmin = () => {
  relay(
    {
      name: Action.Group.IAM_SUPER_ADMIN,
    },
    async ({ body }) => {
      return await WPP.group.iAmSuperAdmin(body)
    },
  )
}

const join = () => {
  relay(
    {
      name: Action.Group.JOIN,
    },
    async ({ body }) => {
      return await WPP.group.join(body)
    },
  )
}

const leave = () => {
  relay(
    {
      name: Action.Group.LEAVE,
    },
    async ({ body }) => {
      return await WPP.group.leave(body)
    },
  )
}

const promoteParticipants = () => {
  relay(
    {
      name: Action.Group.PROMOTE_PARTICIPANTS,
    },
    async ({ body }) => {
      const { groupId, participantsIds } = body
      return await WPP.group.promoteParticipants(groupId, participantsIds)
    },
  )
}

const reject = () => {
  relay(
    {
      name: Action.Group.REJECT,
    },
    async ({ body }) => {
      const { groupId, membershipIds } = body
      return await WPP.group.reject(groupId, membershipIds)
    },
  )
}

const removeIcon = () => {
  relay(
    {
      name: Action.Group.REMOVE_ICON,
    },
    async ({ body }) => {
      return await WPP.group.removeIcon(body)
    },
  )
}

const removeParticipants = () => {
  relay(
    {
      name: Action.Group.REMOVE_PARTICIPANTS,
    },
    async ({ body }) => {
      const { groupId, participantsIds } = body
      return await WPP.group.removeParticipants(groupId, participantsIds)
    },
  )
}

const revokeInviteCode = () => {
  relay(
    {
      name: Action.Group.REVOKE_INVITE_CODE,
    },
    async ({ body }) => {
      return await WPP.group.revokeInviteCode(body)
    },
  )
}

const setDescription = () => {
  relay(
    {
      name: Action.Group.SET_DESCRIPTION,
    },
    async ({ body }) => {
      const { groupId, description } = body
      return await WPP.group.setDescription(groupId, description)
    },
  )
}

const setIcon = () => {
  relay(
    {
      name: Action.Group.SET_ICON,
    },
    async ({ body }) => {
      const { groupId, content } = body
      return await WPP.group.setIcon(groupId, content)
    },
  )
}

const setProperty = () => {
  relay(
    {
      name: Action.Group.SET_PROPERTY,
    },
    async ({ body }) => {
      const { groupId, property, value } = body
      return await WPP.group.setProperty(groupId, property, value)
    },
  )
}

const setSubject = () => {
  relay(
    {
      name: Action.Group.SET_SUBJECT,
    },
    async ({ body }) => {
      const { groupId, subject } = body
      return await WPP.group.setSubject(groupId, subject)
    },
  )
}

const initGroupRelay = () => {
  addParticipants()
  approve()
  canAdd()
  canDemote()
  canPromote()
  canRemove()
  create()
  demoteParticipants()
  getInviteLink()
  getGroupInfoFromInviteCode()
  getGroupSizeLimit()
  getMembershipRequests()
  getParticipants()
  list()
  iAmAdmin()
  iAmMember()
  iAmRestrictedMember()
  iAmSuperAdmin()
  join()
  leave()
  promoteParticipants()
  reject()
  removeIcon()
  removeParticipants()
  revokeInviteCode()
  setDescription()
  setIcon()
  setProperty()
  setSubject()
}

export default initGroupRelay
