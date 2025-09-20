import { Media } from '@/constants'
import db from '@/libs/db'

const firstByBroadcastId = async (broadcastId: number) => {
  return await db.media
    .where({
      parentId: broadcastId,
      type: Media.BROADCAST,
    })
    .first()
}

export default {
  firstByBroadcastId,
}
