import { Status } from '@/constants'
import db, { type Broadcast } from '@/libs/db'

const running = async (id: number) => {
  await db.broadcasts.update(id, {
    status: Status.RUNNING,
  })
}

const success = async (id: number) => {
  await db.broadcasts.update(id, {
    status: Status.SUCCESS,
  })
}

const cancel = async (id: number) => {
  await db.broadcasts.update(id, {
    status: Status.CANCELLED,
  })
}

const pause = async (id: number) => {
  await db.broadcasts.update(id, {
    status: Status.CANCELLED,
  })
}

const pending = async (id: number) => {
  await db.broadcasts.update(id, {
    status: Status.PENDING,
  })
}

const get = async (id: number): Promise<Broadcast> => {
  return await db.broadcasts.get(id)
}

export default {
  get,
  running,
  success,
  pause,
  cancel,
  pending,
}
