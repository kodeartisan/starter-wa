// src/features/tools/chat-backup/hooks/useChatBackup.ts
import wa from '@/libs/wa'
import toast from '@/utils/toast'
import { getContactName } from '@/utils/util'
import { useForm } from '@mantine/form'
import { isWithinInterval } from 'date-fns'
import _ from 'lodash'
import { useRef, useState } from 'react'
import { exportToHtml } from '../helpers/exportUtils'

export const useChatBackup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [progress, setProgress] = useState({
    value: 0,
    label: 'Initializing...',
  })
  const validationRef = useRef(true)

  const form = useForm({
    initialValues: {
      chatId: '',
      includeMedia: false,
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      chatId: (value) => (value ? null : 'Contact must be selected.'),
    },
  })

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

      const [startDate, endDate] = form.values.dateRange
      const filteredMessages =
        startDate && endDate
          ? allMessages.filter((msg) =>
              isWithinInterval(new Date(msg.timestamp), {
                start: startDate,
                end: endDate,
              }),
            )
          : allMessages

      if (filteredMessages.length === 0) {
        toast.info('No messages found in the selected chat or date range.')
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
        includeMedia: form.values.includeMedia,
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
  }
}
