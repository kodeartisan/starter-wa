// src/features/tools/chat-backup/hooks/useChatBackup.ts
import wa from '@/libs/wa'
import toast from '@/utils/toast'
import { getContactName } from '@/utils/util'
import { useForm } from '@mantine/form'
import { isWithinInterval } from 'date-fns'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { exportToHtml } from '../helpers/exportUtils'

// ++ MODIFIED: Define all exportable message types, including 'chat' for text messages.
const SUPPORTED_MESSAGE_TYPES = ['chat', 'image', 'video', 'document', 'ptt']

// ++ ADDED: Interface for the backup preview data
interface BackupPreview {
  messageCount: number
  estimatedMediaSize: number // in bytes
}

export const useChatBackup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false) // State for the preview calculation phase
  const [progress, setProgress] = useState({
    value: 0,
    label: 'Initializing...',
  })
  const [backupPreview, setBackupPreview] = useState<BackupPreview | null>(null) // State to hold the preview data
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]) // State to store filtered messages
  const validationRef = useRef(true)

  const form = useForm({
    initialValues: {
      chatId: '',
      // ++ MODIFIED: This now controls which message types are included in the export.
      // All types are selected by default.
      messageTypes: SUPPORTED_MESSAGE_TYPES,
      keyword: '',
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      chatId: (value) => (value ? null : 'A chat must be selected.'),
    },
  })

  // This effect calculates the backup preview (message count, media size)
  // whenever the user changes the filter criteria.
  useEffect(() => {
    const calculatePreview = async () => {
      const { chatId, dateRange, keyword, messageTypes } = form.values
      if (!chatId) {
        setBackupPreview(null)
        setFilteredMessages([])
        return
      }

      setIsPreparing(true)
      try {
        const allMessages = await wa.chat.getMessages(chatId, {
          count: -1, // Fetch all messages to filter them locally
        })

        const [startDate, endDate] = dateRange
        const lowercasedKeyword = keyword.trim().toLowerCase()

        // ++ MODIFIED: Filtering now includes a check for the selected message types.
        const messages = allMessages.filter((msg) => {
          const dateMatch =
            !startDate ||
            !endDate ||
            isWithinInterval(new Date(msg.timestamp), {
              start: startDate,
              end: endDate,
            })
          const keywordMatch =
            !lowercasedKeyword ||
            (msg.body && msg.body.toLowerCase().includes(lowercasedKeyword)) ||
            (msg.caption &&
              msg.caption.toLowerCase().includes(lowercasedKeyword))

          // A message is included only if its type is in the selected list.
          const typeMatch = messageTypes.includes(msg.type)

          return dateMatch && keywordMatch && typeMatch
        })

        // Estimate media size only for the selected and available media types.
        const estimatedMediaSize = messages
          .filter((msg) => messageTypes.includes(msg.type) && msg.size)
          .reduce((acc, msg) => acc + msg.size, 0)

        setFilteredMessages(messages)
        setBackupPreview({
          messageCount: messages.length,
          estimatedMediaSize,
        })
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
    form.values.keyword,
    form.values.messageTypes,
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

      // ++ MODIFIED: Pass `messageTypes` to the exporter. This will be used to determine
      // which media files to download and embed.
      await exportToHtml({
        messages: filteredMessages, // Use the already-filtered messages
        chat,
        filename,
        includeMediaTypes: form.values.messageTypes,
        setProgress,
        validationRef,
      })

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
    SUPPORTED_MESSAGE_TYPES, // ++ MODIFIED: Export the new constant for the UI.
  }
}
