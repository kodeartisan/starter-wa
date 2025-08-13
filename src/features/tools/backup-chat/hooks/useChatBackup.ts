// src/features/tools/backup-chat/hooks/useChatBackup.ts
import wa from '@/libs/wa'
import toast from '@/utils/toast'
import { getContactName } from '@/utils/util'
import { useForm } from '@mantine/form'
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
import { useEffect, useRef, useState } from 'react'
import {
  exportToHtml,
  exportToJson,
  exportToMarkdown,
  exportToPdf,
  exportToTxt,
} from '../helpers/exportUtils'

// Supported message types for export options.
const SUPPORTED_MESSAGE_TYPES = ['chat', 'image', 'video', 'document', 'ptt']

// Interface for the backup preview data.
interface BackupPreview {
  messageCount: number
  estimatedMediaSize: number // in bytes
}

export const useChatBackup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
  const [progress, setProgress] = useState({
    value: 0,
    label: 'Initializing...',
  })
  const [backupPreview, setBackupPreview] = useState<BackupPreview | null>(null)
  const [filteredMessages, setFilteredMessages] = useState<any[]>([])
  const [estimatedTime, setEstimatedTime] = useState('')
  const validationRef = useRef(true)

  const form = useForm({
    initialValues: {
      chatId: '',
      exportFormat: 'html',
      messageTypes: SUPPORTED_MESSAGE_TYPES,
      keywords: [] as string[],
      // MODIFIED: Added a preset field for the new dropdown.
      datePreset: 'all',
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      chatId: (value) => (value ? null : 'A chat must be selected.'),
      // MODIFIED: Validate custom date range only when 'custom' is selected.
      dateRange: (value, values) => {
        if (values.datePreset === 'custom' && (!value[0] || !value[1])) {
          return 'A start and end date are required for a custom range.'
        }
        return null
      },
    },
  })

  // This effect calculates the backup preview whenever filter criteria change.
  useEffect(() => {
    const calculatePreview = async () => {
      // MODIFIED: Destructure 'datePreset' from form values.
      const { chatId, dateRange, keywords, messageTypes, datePreset } =
        form.values
      if (!chatId) {
        setBackupPreview(null)
        setFilteredMessages([])
        setEstimatedTime('')
        return
      }
      setIsPreparing(true)
      // MODIFIED: Derive the effective date range from the selected preset.
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
          case 'yesterday':
            const yesterday = subDays(now, 1)
            start = startOfDay(yesterday)
            end = endOfDay(yesterday)
            break
          case 'last7':
            start = startOfDay(subDays(now, 6))
            end = endOfDay(now)
            break
          case 'last30':
            start = startOfDay(subDays(now, 29))
            end = endOfDay(now)
            break
          case 'thisMonth':
            start = startOfMonth(now)
            end = endOfMonth(now)
            break
          case 'lastMonth':
            const lastMonthDate = subMonths(now, 1)
            start = startOfMonth(lastMonthDate)
            end = endOfMonth(lastMonthDate)
            break
        }
        effectiveDateRange = [start, end]
      }
      try {
        const allMessages = await wa.chat.getMessages(chatId, { count: -1 })
        // MODIFIED: Use the derived date range for filtering.
        const [startDate, endDate] = effectiveDateRange
        const lowercasedKeywords = keywords
          .map((k) => k.toLowerCase().trim())
          .filter(Boolean)

        const messages = allMessages.filter((msg) => {
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

        const estimatedMediaSize = messages
          .filter((msg) => messageTypes.includes(msg.type) && msg.size)
          .reduce((acc, msg) => acc + msg.size, 0)

        setFilteredMessages(messages)
        setBackupPreview({ messageCount: messages.length, estimatedMediaSize })

        if (messages.length > 0) {
          const timeForMessages = messages.length * 0.05
          const mediaToDownload = messages.filter(
            (msg) => messageTypes.includes(msg.type) && msg.size,
          ).length
          const timeForMedia = mediaToDownload * 1.5
          const totalSeconds = timeForMessages + timeForMedia
          if (totalSeconds < 60) {
            setEstimatedTime('Less than a minute.')
          } else {
            const minutes = Math.floor(totalSeconds / 60)
            const seconds = Math.round(totalSeconds % 60)
            let timeString = `About ${minutes} minute${minutes > 1 ? 's' : ''}`
            if (seconds > 0) {
              timeString += ` and ${seconds} second${seconds > 1 ? 's' : ''}`
            }
            setEstimatedTime(`${timeString}.`)
          }
        } else {
          setEstimatedTime('')
        }
      } catch (error) {
        console.error('Failed to calculate backup preview:', error)
        toast.error('Could not fetch messages to prepare the backup.')
        setBackupPreview(null)
        setFilteredMessages([])
      } finally {
        setIsPreparing(false)
      }
    }
    const handler = setTimeout(() => {
      calculatePreview()
    }, 500) // Debounce for 500ms
    return () => {
      clearTimeout(handler)
    }
  }, [
    form.values.chatId,
    form.values.dateRange,
    form.values.keywords,
    form.values.messageTypes,
    form.values.datePreset, // MODIFIED: Added preset to dependency array.
  ])

  const cancelBackup = () => {
    validationRef.current = false
  }

  const startBackup = async () => {
    if (form.validate().hasErrors) return
    if (filteredMessages.length === 0) {
      toast.info('No messages found matching your criteria to export.')
      return
    }
    setIsBackingUp(true)
    validationRef.current = true
    setProgress({ value: 0, label: 'Initializing backup...' })
    try {
      const chat = await wa.chat.find(form.values.chatId)
      // @ts-ignore
      const filename = `backup_chat_${_.snakeCase(
        getContactName(chat.data.contact),
      )}_${new Date().toISOString().slice(0, 10)}`

      const exporterParams = {
        messages: filteredMessages,
        chat,
        filename,
        // Only include media for HTML format; other formats are text-based.
        includeMediaTypes:
          form.values.exportFormat === 'html' ? form.values.messageTypes : [],
        setProgress,
        validationRef,
      }

      // ++ MODIFIED: Use a switch statement to call the appropriate exporter.
      switch (form.values.exportFormat) {
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

      if (validationRef.current) {
        toast.success('Backup completed successfully!')
      } else {
        toast.info('Backup cancelled by user.')
      }
    } catch (error: any) {
      console.error('Backup failed:', error)
      toast.error(error.message || 'An unknown error occurred during backup.')
    } finally {
      setIsBackingUp(false)
    }
  }

  return {
    form,
    isBackingUp,
    isPreparing,
    progress,
    startBackup,
    cancelBackup,
    backupPreview,
    SUPPORTED_MESSAGE_TYPES,
    estimatedTime,
  }
}
