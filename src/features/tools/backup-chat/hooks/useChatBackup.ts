// src/features/tools/backup-chat/hooks/useChatBackup.ts
import useLicense from '@/hooks/useLicense'
import wa from '@/libs/wa'
import toast from '@/utils/toast'
import { getContactName, showModalPricing } from '@/utils/util'
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
  exportToCsv,
  exportToHtml,
  exportToJson,
  exportToMarkdown,
  exportToPdf,
  exportToTxt,
  exportToXlsx,
} from '../helpers/exportUtils'

const SUPPORTED_MESSAGE_TYPES = ['chat', 'image', 'video', 'document', 'ptt']
const PRO_EXPORT_FORMATS = ['pdf', 'txt', 'json', 'md', 'csv', 'xlsx']
const MEDIA_MESSAGE_TYPES = ['image', 'video', 'document', 'ptt']
export interface BackupResultStats {
  messagesExported: number
  messagesOmitted: number
  mediaOmitted: number
  isLimitApplied: boolean
}
export const useChatBackup = () => {
  const license = useLicense()
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [progress, setProgress] = useState({
    value: 0,
    label: 'Initializing...',
  })
  const validationRef = useRef(true)
  const [backupResult, setBackupResult] = useState<BackupResultStats | null>(
    null,
  )
  const form = useForm({
    initialValues: {
      chatId: '',
      exportFormat: 'html',
      messageTypes: ['chat'],
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
      // MODIFIED: Added validation for the keyword limit on the free plan.
      keywords: (value) => {
        if (license.isFree() && value.length > 1) {
          return 'Free users can only filter by one keyword. Upgrade to Pro for unlimited keywords.'
        }
        return null
      },
    },
    validateInputOnChange: ['keywords'],
  })
  const cancelBackup = () => {
    validationRef.current = false
  }
  const clearBackupResult = () => {
    setBackupResult(null)
    form.reset()
  }
  const startBackup = async () => {
    if (form.validate().hasErrors) return
    if (
      license.isFree() &&
      PRO_EXPORT_FORMATS.includes(form.values.exportFormat)
    ) {
      toast.error(
        'This export format is a Pro feature. Please upgrade to unlock.',
        'Upgrade Required',
      )
      showModalPricing()
      return
    }
    setIsBackingUp(true)
    validationRef.current = true
    setProgress({ value: 5, label: 'Fetching and filtering messages...' })
    let resultStats: BackupResultStats = {
      messagesExported: 0,
      messagesOmitted: 0,
      mediaOmitted: 0,
      isLimitApplied: false,
    }
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
      const isFreePlan = license.isFree()
      const isLimitApplied = isFreePlan && filteredMessages.length > 10
      let mediaIncludedInFreePreview = false
      let mediaOmittedCount = 0
      const messagesToExport = filteredMessages.map((msg, index) => {
        const isMedia = MEDIA_MESSAGE_TYPES.includes(msg.type)
        if (!isFreePlan) {
          return { ...msg, isRedacted: false }
        }
        if (index >= 10) {
          if (isMedia) mediaOmittedCount++
          return { ...msg, isRedacted: true }
        }
        if (isMedia) {
          if (!mediaIncludedInFreePreview) {
            mediaIncludedInFreePreview = true
            return { ...msg, isRedacted: false }
          } else {
            mediaOmittedCount++
            return { ...msg, isRedacted: true }
          }
        }
        return { ...msg, isRedacted: false }
      })
      const exportedMessageCount = messagesToExport.filter(
        (m) => !m.isRedacted,
      ).length
      const messagesOmittedCount =
        filteredMessages.length - exportedMessageCount
      resultStats = {
        messagesExported: exportedMessageCount,
        messagesOmitted: messagesOmittedCount,
        mediaOmitted: mediaOmittedCount,
        isLimitApplied: isLimitApplied || mediaIncludedInFreePreview,
      }
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
        isLimitApplied,
        isProPreview: mediaIncludedInFreePreview,
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
        case 'csv':
          await exportToCsv(exporterParams)
          break
        case 'xlsx':
          await exportToXlsx(exporterParams)
          break
        case 'html':
        default:
          await exportToHtml(exporterParams)
          break
      }
      if (validationRef.current) {
        if (isLimitApplied || mediaIncludedInFreePreview) {
          toast.warning(
            'Backup Limited',
            'Free plan limits applied. Upgrade to Pro for unlimited backups.',
          )
        } else {
          toast.success('Backup completed successfully!')
        }
        setBackupResult(resultStats)
      } else {
        toast.info('Backup cancelled by user.')
      }
    } catch (error: any) {
      console.error('Backup failed:', error)
      toast.error(error.message || 'An unknown error occurred during backup.')
      setBackupResult(null)
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
    backupResult,
    clearBackupResult,
  }
}
