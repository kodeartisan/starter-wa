// src/features/tools/chat-backup/hooks/useChatBackup.ts
import wa from '@/libs/wa'
import toast from '@/utils/toast'
import { getContactName } from '@/utils/util'
import { useForm } from '@mantine/form'
import { isWithinInterval } from 'date-fns'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { exportToHtml } from '../helpers/exportUtils'

// Define supported media types for the UI
const SUPPORTED_MEDIA_TYPES = ['image', 'video', 'document', 'ptt']

export const useChatBackup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [progress, setProgress] = useState({
    value: 0,
    label: 'Initializing...',
  })
  const [chatDetails, setChatDetails] = useState<{ msgCount?: number } | null>(
    null,
  )
  const validationRef = useRef(true)

  const form = useForm({
    initialValues: {
      chatId: '',
      // Changed from a boolean to an array for selective media backup
      includeMediaTypes: [] as string[],
      // Added new field for keyword filtering
      keyword: '',
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      chatId: (value) => (value ? null : 'A chat must be selected.'),
    },
  })

  // Fetches chat details (like message count) when a chat is selected, used for the time estimate.
  useEffect(() => {
    if (form.values.chatId) {
      wa.chat.find(form.values.chatId).then((chat) => {
        setChatDetails(chat.data)
      })
    } else {
      setChatDetails(null)
    }
  }, [form.values.chatId])

  // Calculates a rough time estimate before the backup starts.
  const estimatedTime = useMemo(() => {
    if (!chatDetails?.msgCount) return ''
    const messageCount = chatDetails.msgCount
    const mediaSelected = form.values.includeMediaTypes.length > 0

    // Rough estimates: 0.1s per message, 2s per media file (highly approximate).
    let totalSeconds = messageCount * 0.1
    if (mediaSelected) {
      // A wild guess that 20% of messages might contain media.
      const estimatedMediaCount = messageCount * 0.2
      totalSeconds += estimatedMediaCount * 2
    }

    if (totalSeconds < 10) return 'Less than 10 seconds.'
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.round(totalSeconds % 60)

    let estimate = 'Approximately '
    if (minutes > 0) {
      estimate += `${minutes} minute${minutes > 1 ? 's' : ''}`
    }
    if (seconds > 0) {
      if (minutes > 0) estimate += ' and '
      estimate += `${seconds} second${seconds > 1 ? 's' : ''}.`
    }

    return estimate
  }, [chatDetails, form.values.includeMediaTypes])

  const cancelBackup = () => {
    validationRef.current = false
  }

  const startBackup = async () => {
    if (form.validate().hasErrors) return
    setIsBackingUp(true)
    validationRef.current = true
    setProgress({ value: 0, label: 'Fetching messages...' })

    try {
      const allMessages = await wa.chat.getMessages(form.values.chatId, {
        count: -1,
      })

      if (!validationRef.current) {
        toast.info('Backup cancelled by user.')
        setIsBackingUp(false)
        return
      }

      // Apply date and keyword filters
      const [startDate, endDate] = form.values.dateRange
      const keyword = form.values.keyword.trim().toLowerCase()

      const filteredMessages = allMessages.filter((msg) => {
        const dateMatch =
          !startDate ||
          !endDate ||
          isWithinInterval(new Date(msg.timestamp), {
            start: startDate,
            end: endDate,
          })

        const keywordMatch =
          !keyword ||
          (msg.body && msg.body.toLowerCase().includes(keyword)) ||
          (msg.caption && msg.caption.toLowerCase().includes(keyword))

        return dateMatch && keywordMatch
      })

      if (filteredMessages.length === 0) {
        toast.info('No messages found matching your criteria.')
        setIsBackingUp(false)
        return
      }

      const chat = await wa.chat.find(form.values.chatId)
      //@ts-ignore
      const filename = `backup_chat_${_.snakeCase(getContactName(chat.data.contact))}_${new Date().toISOString().slice(0, 10)}`

      await exportToHtml({
        messages: filteredMessages,
        chat,
        filename,
        //@ts-ignore
        includeMediaTypes: form.values.includeMediaTypes,
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
    progress,
    startBackup,
    cancelBackup,
    estimatedTime,
    SUPPORTED_MEDIA_TYPES,
  }
}
