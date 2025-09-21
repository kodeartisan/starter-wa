// src/libs/db.ts
import Dexie, { type EntityTable } from 'dexie'
import packageJson from '../../package.json'

export interface Media {
  id: number
  parentId: number
  type: string
  name: string
  file: File
  ext: string
}

export interface Broadcast {
  id: number
  name?: string | null
  type: string
  message: any
  isTyping: number
  isScheduler: number
  status: string
  delayMin?: number
  delayMax?: number
  validateNumbers?: number
}

export interface BroadcastContact {
  id: number
  broadcastId: number
  number: string
  name?: string | null
  status: string
  error?: string | null
  scheduledAt?: Date | null
  sendAt?: Date | null
}

export interface BroadcastTemplate {
  id: number
  name: string
  type: string
  message: any
}

export interface BroadcastRecipient {
  id: number
  name: string
  recipients: { name: string; number: string; source: string }[]
  createdAt: Date
}

const db = new Dexie(packageJson.name) as Dexie & {
  media: EntityTable<Media, 'id'>
  broadcasts: EntityTable<Broadcast, 'id'>
  broadcastContacts: EntityTable<BroadcastContact, 'id'>
  broadcastTemplates: EntityTable<BroadcastTemplate, 'id'>
  broadcastRecipients: EntityTable<BroadcastRecipient, 'id'>
}

// NOTE: Dexie cannot index boolean values. Fields intended for use in `where()` clauses
// have been changed from `boolean` to `number` (0 for false, 1 for true).
// ++ MODIFIED: Added a compound index '[broadcastId+status]' to optimize status-based queries per broadcast.
db.version(1).stores({
  media: '++id, parentId, type, name, file, ext',
  broadcasts:
    '++id, name, type, message, isTyping, isScheduler, status, delayMin, delayMax, validateNumbers',
  broadcastContacts:
    '++id, broadcastId, number, name, status, error, scheduledAt, sendAt, [broadcastId+status]',
  broadcastTemplates: '++id, name, type, message',
  broadcastRecipients: '++id, name, createdAt',
})

export default db
