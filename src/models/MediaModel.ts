// src/models/MediaModel.ts
import db from '@/libs/db'

/**
 * Finds the first media record matching a parent ID and a specific media type.
 * @param {number} parentId The ID of the parent record (e.g., broadcastId, quickReplyId).
 * @param {string} mediaType The type of media to find (e.g., Media.BROADCAST, Media.QUICK_REPLY).
 * @returns The first matching media record or undefined.
 */
const findFirstByParent = async (parentId: number, mediaType: string) => {
  return await db.media.where({ parentId: parentId, type: mediaType }).first()
}

export default {
  findFirstByParent,
}
