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
  pauseEnabled?: number
  pauseAfter?: number
  pauseDuration?: number
  pausedUntil?: Date | null
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

export interface Label {
  id: number
  label: string
  value: string
  show: number
  custom: number
  numbers?: any[]
  color?: string
  group?: string
  isPinned?: number
  description?: string // MODIFIED: Added description field
}

export interface DirectChatTemplate {
  id: number
  name: string
  message: string
}

export interface QuickReply {
  id: number
  name: string
  type: string
  message: any
  isPinned?: number
  createdAt?: Date
}

export interface UserStatus {
  id: number
  name?: string
  type: string
  message: any
  createdAt: Date
  status: string
  backgroundColor?: string
  font?: number
  isScheduled?: number
  scheduledAt?: Date | null
  postedAt?: Date | null
}

const db = new Dexie(packageJson.name) as Dexie & {
  media: EntityTable<Media, 'id'>
  broadcasts: EntityTable<Broadcast, 'id'>
  broadcastContacts: EntityTable<BroadcastContact, 'id'>
  broadcastTemplates: EntityTable<BroadcastTemplate, 'id'>
  broadcastRecipients: EntityTable<BroadcastRecipient, 'id'>
  labels: EntityTable<Label, 'id'>
  directChatTemplates: EntityTable<DirectChatTemplate, 'id'>
  quickReplies: EntityTable<QuickReply, 'id'>
  userStatuses: EntityTable<UserStatus, 'id'>
}

// NOTE: Dexie cannot index boolean values. Fields intended for use in `where()` clauses
// have been changed from `boolean` to `number` (0 for false, 1 for true).
db.version(1).stores({
  media: '++id, parentId, type, name, file, ext',
  broadcasts:
    '++id, name, type, message, isTyping, isScheduler, status, delayMin, delayMax, pauseEnabled, pauseAfter, pauseDuration, pausedUntil',
  broadcastContacts:
    '++id, broadcastId, number, name, status, error, scheduledAt, sendAt, [broadcastId+status]',
  broadcastTemplates: '++id, name, type, message',
  broadcastRecipients: '++id, name, createdAt',
  labels: '++id, label, value, show, custom, color, group, isPinned, *numbers', // MODIFIED: `description` is not indexed as it's not for querying
  directChatTemplates: '++id, name',
  quickReplies: '++id, name, type, isPinned, createdAt',
  userStatuses:
    '++id, name, type, createdAt, status, backgroundColor, font, isScheduled, scheduledAt, postedAt',
})

export default db
