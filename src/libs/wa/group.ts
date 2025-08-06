import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type { ChatListOptions } from '@wppconnect/wa-js/dist/chat'
import type { GroupProperty } from '@wppconnect/wa-js/dist/group'
import type { Wid } from '@wppconnect/wa-js/dist/whatsapp'

/**
 * Add one or more participants to a group
 *
 * The method return a object with the result of each participant as the key
 *
 * @example
 * ```javascript
 * const result = await wa.group.addParticipants('[group@g.us]', [number@c.us]);
 *
 * // Get participant result:
 * console.log(result['123@c.us'].code);
 * console.log(result['123@c.us'].invite_code);
 * console.log(result['123@c.us'].invite_code_exp);
 * console.log(result['123@c.us'].message);
 * console.log(result['123@c.us'].wid);
 *
 * const memberResult = result['123@c.us']; // To a variable
 * // or
 * const memberResult = Object.values(result)[0]; // Always the first member result
 *
 * // How to send a custom invite link
 * const link = 'https://chat.whatsapp.com/' + result['123@c.us'].invite_code;
 * console.log(link);
 * ```
 */
export const addParticipants = async (
  groupId: string | Wid,
  participantsIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.ADD_PARTICIPANTS,
    body: { groupId, participantsIds },
  })
}

/**
 * Approve a membership request to group
 *
 * @example
 * ```javascript
 * await wa.group.approve(12345645@g.us, 5554999999999@c.us);
 * ```
 *
 */
export const approve = async (
  groupId: string | Wid,
  membershipIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.APPROVE,
    body: { groupId, membershipIds },
  })
}

/**
 * Check if your account is allowed to add new participants
 *
 * @example
 * ```javascript
 * const result = await wa.group.canAdd('group@g.us');
 * console.log(result);
 * ```
 */
export const canAdd = async (groupId: string | Wid): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.CAN_ADD,
    body: groupId,
  })
}

/**
 * Check if your account is allowed to demote participants
 *
 * @example
 * ```javascript
 * await wa.group.canDemote('group@g.us');
 * console.log(result);
 * ```
 */
export const canDemote = async (
  groupId: string | Wid,
  participantsIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.CAN_DEMOTE,
    body: { groupId, participantsIds },
  })
}

/**
 * Check if your account is allowed to promote participants
 *
 * @example
 * ```javascript
 * await WPP.group.canPromote('group@g.us');
 * console.log(result);
 * ```
 *
 */
export const canPromote = async (
  groupId: string | Wid,
  participantsIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.CAN_PROMOTE,
    body: { groupId, participantsIds },
  })
}

/**
 * Check if your account is allowed to remove participants
 *
 * @example
 * ```javascript
 * const result = await wa.group.canRemove('group@g.us');
 * console.log(result);
 * ```
 */
export const canRemove = async (
  groupId: string | Wid,
  participantsIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.CAN_REMOVE,
    body: { groupId, participantsIds },
  })
}

/**
 * Create a new group
 *
 * The method return a object with the result of each participant as the key
 *
 * @example
 * ```javascript
 * const result = await wa.group.create('Test Group', ['number@c.us']);
 *
 * console.log(result.gid.toString()); // Get the group ID
 *
 * // Get participant result:
 * console.log(result['number@c.us'].code);
 * console.log(result['number@c.us'].invite_code);
 * console.log(result['number@c.us'].invite_code_exp);
 * console.log(result['number@c.us'].message);
 * console.log(result['number@c.us'].wid);
 *
 * const memberResult = result['number@c.us']; // To a variable
 * // or
 * const memberResult = Object.values(result)[0]; // Always the first member result
 *
 * // How to send a custom invite link
 * const link = 'https://chat.whatsapp.com/' + result['number@c.us'].invite_code;
 * console.log(link);
 *
 * // Create a Subgroup for a community
 * const result = await wa.group.create('Test Group', ['number@c.us'], 'communit@g.us');
 * ```
 */
export const create = async (
  groupName: string,
  participantsIds: (string | Wid) | (string | Wid)[],
  parentGroup: string | Wid,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.CREATE,
    body: { groupName, participantsIds, parentGroup },
  })
}

/**
 * @example
 * ```javascript
 * // One member
 * await wa.group.demoteParticipants('123456@g.us', '123456@c.us');
 *
 * // More than one member
 * await wa.group.demoteParticipants('123456@g.us', ['123456@c.us','123456@c.us']);
 * ```
 */
export const demoteParticipants = async (
  groupId: string | Wid,
  participantsIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.DEMOTE_PARTICIPANTS,
    body: { groupId, participantsIds },
  })
}

/**
 * Get group info from an inviteCode
 *
 * @example
 * ```javascript
 * await wa.group.getGroupInfoFromInviteCode('<inviteCode>');
 * ```
 */
export const getGroupInfoFromInviteCode = async (
  inviteCode: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.GET_GROUP_INFO_FROM_INVITE_CODE,
    body: inviteCode,
  })
}

/**
 * Get the max number of participants for a group
 *
 * @example
 * ```javascript
 * const limit = await wa.group.getGroupSizeLimit();
 * console.log(limit);
 * ```
 */
export const getGroupSizeLimit = async (): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.GET_GROUP_SIZE_LIMIT,
    body: {},
  })
}

export const list = async (options: ChatListOptions = {}): Promise<[]> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.LIST,
  })
}

/**
 * @description Sends a request to the background script to get a group's invite link.
 * @param groupId The ID of the group (e.g., '1234567890@g.us').
 * @returns A promise that resolves with the invite link string.
 */
export const getInviteLink = async (groupId: string): Promise<string> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.GET_INVITE_LINK,
    body: { groupId },
  })
}

/**
 * Retrieve a lista of a membership approval requests
 *
 * @example
 * ```javascript
 * await wa.group.getMembershipRequests(12345645@g.us);
 * ```
 */
export const getMembershipRequests = async (
  groupId: string | Wid,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.GET_MEMBERSHIP_REQUESTS,
    body: groupId,
  })
}

/**
 * Get an array of participants of a group
 *
 * @example
 * ```javascript
 * wa.group.getParticipants('[group-id]@g.us');
 * ```
 */
export const getParticipants = async (groupId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.GET_PARTICIPANTS,
    body: groupId,
  })
}

export const iAmAdmin = async (groupId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.IAM_ADMIN,
    body: groupId,
  })
}

export const iAmMember = async (groupId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.IAM_MEMBER,
    body: groupId,
  })
}

export const iAmRestrictedMember = async (
  groupId: string | Wid,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.IAM_RESTRICTED_MEMBER,
    body: groupId,
  })
}

export const iAmSuperAdmin = async (groupId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.IAM_SUPER_ADMIN,
    body: groupId,
  })
}

/**
 * Join in a group from an invite code.
 *
 * @example
 * ```javascript
 * await wa.group.join('abcde....');
 * ```
 */
export const join = async (inviteCode: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.JOIN,
    body: inviteCode,
  })
}

/**
 * Leave from a group.
 *
 * @example
 * ```javascript
 * await wa.group.leave('[number]@g.us');
 * ```
 */
export const leave = async (groupId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.LEAVE,
    body: groupId,
  })
}

/**
 * Promote group member to admin
 *
 * @example
 * ```javascript
 * // One member
 * await wa.group.promoteParticipants('123456@g.us', '123456@c.us');
 *
 * // More than one member
 * await wa.group.promoteParticipants('123456@g.us', ['123456@c.us','123456@c.us']);
 * ```
 *
 * @category Group
 */
export const promoteParticipants = async (
  groupId: string | Wid,
  participantsIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.PROMOTE_PARTICIPANTS,
    body: { groupId, participantsIds },
  })
}

/**
 * Reject a membership request to group
 *
 * @example
 * ```javascript
 * await wa.group.reject(12345645@g.us, 5554999999999@c.us);
 * ```
 */
export const reject = async (
  groupId: string | Wid,
  membershipIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.REJECT,
    body: { groupId, membershipIds },
  })
}

/**
 * Remove the group icon (group profile picture)
 *
 * @example
 * ```javascript
 * await wa.group.removeIcon('[group@g.us]');
 * ```
 */
export const removeIcon = async (groupId: string | Wid): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.REMOVE_ICON,
    body: groupId,
  })
}

/**
 * Remove participants of a group
 *
 * @example
 * ```javascript
 * // One member
 * await wa.group.removeParticipants('123456@g.us', '123456@c.us');
 *
 * // More than one member
 * await wa.group.removeParticipants('123456@g.us', ['123456@c.us','123456@c.us']);
 * ```
 */
export const removeParticipants = async (
  groupId: string | Wid,
  participantsIds: (string | Wid) | (string | Wid)[],
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.REMOVE_PARTICIPANTS,
    body: { groupId, participantsIds },
  })
}

/**
 * Revoke the current invite code and generate new one.
 *
 * @example
 * ```javascript
 * const code = WPP.group.revokeInviteCode('[group-id]@g.us');
 * const link = 'https://chat.whatsapp.com/' + code;
 * ```
 */
export const revokeInviteCode = async (groupId: string | Wid): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.REVOKE_INVITE_CODE,
    body: groupId,
  })
}

/**
 * Define the group description
 *
 * @example
 * ```javascript
 * await wa.group.setDescription('[group-id]@g.us', 'new group description');
 * ```
 */
export const setDescription = async (
  groupId: string | Wid,
  description: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.SET_DESCRIPTION,
    body: { groupId, description },
  })
}

/**
 * Set the group icon (group profile picture)
 *
 * @example
 * ```javascript
 * await wa.group.setIcon('[group@g.us]', 'data:image/jpeg;base64,.....');
 * ```
 */
export const setIcon = async (
  groupId: string | Wid,
  content: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.SET_ICON,
    body: { groupId, content },
  })
}

/**
 * Set the group property
 *
 * @example
 * ```javascript
 * // Only admins can send message
 * await wa.group.setProperty('[group-id]@g.us', 'announcement', true);
 *
 * // All can send message
 * await wa.group.setProperty('[group-id]@g.us', 'announcement', false);
 *
 * // Disatble temporary messages
 * await wa.group.setProperty('[group-id]@g.us', 'ephemeral', 0);
 *
 * // Enable temporary messages for 24 hours
 * await wa.group.setProperty('[group-id]@g.us', 'ephemeral', 86400);
 *
 * // Enable temporary messages for 7 days
 * await wa.group.setProperty('[group-id]@g.us', 'ephemeral', 604800);
 *
 * // Enable temporary messages for 90 days
 * await wa.group.setProperty('[group-id]@g.us', 'ephemeral', 7776000);
 *
 * // Only admins can edit group properties
 * await wa.group.setProperty('[group-id]@g.us', 'restrict', true);
 *
 * // All can edit group properties
 * await wa.group.setProperty('[group-id]@g.us', 'restrict', false);
 * ```
 */
export const setProperty = async (
  groupId: string | Wid,
  property: GroupProperty,
  value: 0 | 1 | 86400 | 604800 | 7776000 | boolean,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.SET_PROPERTY,
    body: { groupId, property, value },
  })
}

/**
 * Define the group subject
 *
 * @example
 * ```javascript
 * await wa.group.setSubject('[group-id]@g.us', 'new group subject');
 * ```
 */
export const setSubject = async (
  groupId: string | Wid,
  subject: string,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Group.SET_SUBJECT,
    body: { groupId, subject },
  })
}
