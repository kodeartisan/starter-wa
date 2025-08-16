// src/features/tools/backup-chat/helpers/backupProcessor.ts
import wa from '@/libs/wa'
import { getContactName } from '@/utils/util'
import {
  endOfDay,
  endOfMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'
import _ from 'lodash'
import {
  exportToHtml,
  exportToJson,
  exportToMarkdown,
  exportToPdf,
  exportToTxt,
} from './exportUtils'

// Interface for backup parameters.
interface BackupParams {
  chatId: string
  exportFormat: string
  messageTypes: string[]
  keywords: string[]
  datePreset: string
  dateRange: [Date | null, Date | null]
  enableEncryption: boolean
  password?: string
  setProgress: (progress: { value: number; label: string }) => void
  validationRef?: React.MutableRefObject<boolean>
}

/**
 * @description The core logic for running a chat backup.
 * It's a standalone function that can be called from UI hooks or background listeners.
 * @param params The backup configuration.
 * @returns A promise that resolves to true on success/cancellation, and false on failure.
 */
export const runBackupProcess = async (params: Partial<BackupParams>) => {
  const {
    chatId,
    exportFormat = 'html',
    messageTypes = [],
    keywords = [],
    datePreset = 'all',
    dateRange = [null, null],
    enableEncryption = false,
    password,
    setProgress = () => {},
    validationRef = { current: true },
  } = params

  if (!chatId) {
    throw new Error('Chat ID is required to start a backup.')
  }

  setProgress({ value: 5, label: 'Fetching messages...' })

  // Date range filtering logic.
  let effectiveDateRange: [Date | null, Date | null] = [null, null]
  if (datePreset === 'custom') {
    effectiveDateRange = dateRange
  } else if (datePreset !== 'all') {
    const now = new Date()
    let start: Date | null = null
    let end: Date | null = null
    switch (datePreset) {
      case 'today':
        start = startOfDay(now)
        end = endOfDay(now)
        break
      // ... other date presets
    }
    effectiveDateRange = [start, end]
  }

  const allMessages = await wa.chat.getMessages(chatId, { count: -1 })
  const [startDate, endDate] = effectiveDateRange
  const lowercasedKeywords = keywords
    .map((k) => k.toLowerCase().trim())
    .filter(Boolean)

  const filteredMessages = allMessages.filter((msg) => {
    const dateMatch =
      !startDate ||
      !endDate ||
      isWithinInterval(new Date(msg.timestamp), {
        start: startDate,
        end: endDate,
      })
    const keywordMatch =
      lowercasedKeywords.length === 0 ||
      lowercasedKeywords.some(
        (k) =>
          (msg.body && msg.body.toLowerCase().includes(k)) ||
          (msg.caption && msg.caption.toLowerCase().includes(k)),
      )
    const typeMatch = messageTypes.includes(msg.type)
    return dateMatch && keywordMatch && typeMatch
  })

  if (filteredMessages.length === 0) {
    throw new Error('No messages found matching your criteria to export.')
  }

  const chat = await wa.chat.find(chatId)
  const filename = `backup_chat_${_.snakeCase(
    getContactName(chat.data.contact),
  )}_${new Date().toISOString().slice(0, 10)}`

  const exporterParams = {
    messages: filteredMessages,
    chat,
    filename,
    includeMediaTypes: messageTypes,
    setProgress,
    validationRef,
    password: enableEncryption ? password : undefined,
  }

  switch (exportFormat) {
    case 'pdf':
      await exportToPdf(exporterParams)
      break
    case 'txt':
      await exportToTxt(exporterParams)
      break
    case 'json':
      await exportToJson(exporterParams)
      break
    case 'md':
      await exportToMarkdown(exporterParams)
      break
    case 'html':
    default:
      await exportToHtml(exporterParams)
      break
  }

  return validationRef.current
}
