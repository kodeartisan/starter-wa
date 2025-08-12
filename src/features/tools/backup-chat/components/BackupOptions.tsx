import useWa from '@/hooks/useWa'
import { getContactName } from '@/utils/util'
import { Icon } from '@iconify/react'
import { Button, Checkbox, Group, Select, Stack } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import React, { useEffect, useState } from 'react'

interface Props {
  form: ReturnType<
    typeof useForm<{
      chatId: string
      includeMedia: boolean
      dateRange: [Date | null, Date | null]
    }>
  >
  onStart: () => void
}

const BackupOptions: React.FC<Props> = ({ form, onStart }) => {
  const wa = useWa()
  const [chatOptions, setChatOptions] = useState<any[]>()

  useEffect(() => {
    if (!wa.isReady) return
    wa.chat.list().then((chats) => {
      const labelValueChats = chats.map((chat: any) => ({
        label: getContactName(chat.contact),
        value: chat.contact.id,
      }))
      setChatOptions(labelValueChats)
    })
  }, [wa.isReady])

  return (
    <Stack>
      <Select
        label="Select chat"
        data={chatOptions ?? []}
        searchable
        clearable
        required
        {...form.getInputProps('chatId')}
      />
      <DatePickerInput
        type="range"
        label="Date Range (Optional)"
        placeholder="Leave blank to export all messages"
        {...form.getInputProps('dateRange')}
        clearable
      />

      <Checkbox
        mt="md"
        label="Include media files (images, videos, etc.)"
        description="Warning: This will create a .zip file and can be very slow for large chats."
        {...form.getInputProps('includeMedia', { type: 'checkbox' })}
      />

      <Group justify="flex-end" mt="lg">
        <Button
          leftSection={<Icon icon="tabler:download" />}
          onClick={onStart}
          disabled={!form.values.chatId}
        >
          Start Backup
        </Button>
      </Group>
    </Stack>
  )
}

export default BackupOptions
