// src/models/BroadcastContactModel.ts
import { Status } from '@/constants'
import db from '@/libs/db'

const success = async (id: number) => {
  return await db.broadcastContacts.update(id, {
    status: Status.SUCCESS,
    sendAt: new Date(),
  })
}

const running = async (id: number) => {
  return await db.broadcastContacts.update(id, { status: Status.RUNNING })
}

const pending = async (id: number) => {
  return await db.broadcastContacts.update(id, { status: Status.PENDING })
}

const failed = async (id: number, message: string | null = null) => {
  return await db.broadcastContacts.update(id, {
    status: Status.FAILED,
    error: message,
  })
}

// This reduces the number of database queries in the main processing loop.
const getStatusPendingBatch = async (limit: number = 20) => {
  return await db.broadcastContacts
    .where('status')
    .equals(Status.PENDING)
    .limit(limit)
    .toArray()
}

const resetRunningStatuses = async () => {
  const updatedContacts = await db.broadcastContacts
    .where('status')
    .equals(Status.RUNNING)
    .modify({ status: Status.PENDING })

  if (updatedContacts > 0) {
    await db.broadcasts
      .where('status')
      .equals(Status.RUNNING)
      .modify({ status: Status.PENDING })
    console.log(
      `Reset ${updatedContacts} contacts and potentially their broadcasts.`,
    )
  } else {
    console.log('No stuck RUNNING statuses found.')
  }
}

export default {
  getStatusPendingBatch,
  success,
  failed,
  running,
  pending,
  resetRunningStatuses,
}
