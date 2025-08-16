// src/features/tools/backup-chat/hooks/useChatBackup.ts
import useLicense from '@/hooks/useLicense'
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
import { useRef, useState } from 'react'
import {
  exportToHtml,
  exportToJson,
  exportToMarkdown,
  exportToPdf,
  exportToTxt,
} from '../helpers/exportUtils'

// Supported message types for export options.
const SUPPORTED_MESSAGE_TYPES = ['chat', 'image', 'video', 'document', 'ptt']

export const useChatBackup = () => {
  const license = useLicense()
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [progress, setProgress] = useState({
    value: 0,
    label: 'Initializing...',
  })
  const validationRef = useRef(true)

  const form = useForm({
    initialValues: {
      chatId: '',
      exportFormat: 'html',
      messageTypes: SUPPORTED_MESSAGE_TYPES,
      keywords: [] as string[],
      datePreset: 'today',
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      chatId: (value) => (value ? null : 'A chat must be selected.'),
      dateRange: (value, values) => {
        if (values.datePreset === 'custom' && (!value[0] || !value[1])) {
          return 'A start and end date are required for a custom range.'
        }
        return null
      },
    },
    validateInputOnChange: ['keywords'],
  })

  const cancelBackup = () => {
    validationRef.current = false
  }

  const startBackup = async () => {
    if (form.validate().hasErrors) return

    setIsBackingUp(true)
    validationRef.current = true
    setProgress({ value: 5, label: 'Fetching and filtering messages...' })

    try {
      const { chatId, dateRange, keywords, messageTypes, datePreset } =
        form.values

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

      const allMessages = await wa.chat.getMessages(chatId, { count: -1 })

      let [startDate, endDate] = effectiveDateRange

      if (license.isFree()) {
        const sevenDaysAgo = startOfDay(subDays(new Date(), 7))
        if (!startDate || startDate < sevenDaysAgo) {
          startDate = sevenDaysAgo
        }
      }

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
        toast.info('No messages found matching your criteria to export.')
        setIsBackingUp(false)
        return
      }

      // -- MODIFIED: Apply redaction logic for free users.
      const isLimitApplied = license.isFree() && filteredMessages.length > 10
      const messagesToExport = isLimitApplied
        ? filteredMessages.map((msg, index) => {
            if (index < 10) return msg
            // For free users, after the 10th message, redact the content
            // and add a flag to prevent media download.
            return {
              ...msg,
              body: '********',
              caption: msg.caption ? '********' : undefined,
              isRedacted: true, // This flag will prevent media download
            }
          })
        : filteredMessages

      const chat = await wa.chat.find(form.values.chatId)
      // @ts-ignore
      const filename = `backup_chat_${_.snakeCase(
        getContactName(chat.data.contact),
      )}_${new Date().toISOString().slice(0, 10)}`

      const exporterParams = {
        messages: messagesToExport,
        chat,
        filename,
        includeMediaTypes: form.values.messageTypes,
        setProgress,
        validationRef,
        isLimitApplied, // Pass the flag to exporters for the notice.
      }

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
    progress,
    startBackup,
    cancelBackup,
    SUPPORTED_MESSAGE_TYPES,
  }
}
