// src/features/broadcast/components/Preview/MessagePreview.tsx
import { Message } from '@/constants'
import parse from '@/utils/parse'
import { Icon } from '@iconify/react'
import { Group, Paper, Stack, Text, Title } from '@mantine/core'
import React from 'react'

interface Props {
  type: string
  message: any
}

// A sample contact to use for populating variables like {name} and {number}.
const sampleContact = {
  id: '1234567890@c.us',
  number: '1234567890@c.us',
  name: 'John Doe',
  status: 'PENDING',
  broadcastId: 0,
}

/**
 * @component MessagePreview
 * @description Renders a real-time preview of a broadcast message,
 * simulating how it would look in a WhatsApp chat.
 */
const MessagePreview: React.FC<Props> = ({ type, message }) => {
  const renderContent = () => {
    let content: string | null = null

    switch (type) {
      case Message.TEXT:
        content = message
        break
      case Message.IMAGE:
      case Message.VIDEO:
      case Message.FILE:
        content = message?.caption || ''
        break
      default:
        content = null
    }

    if (content === null) {
      return (
        <Text c="dimmed" fs="italic" size="sm">
          Live preview is not available for this message type.
        </Text>
      )
    }

    // Parse for variables and Spintax
    //@ts-ignore
    const parsedContent = parse.text(content, sampleContact)

    // Simple formatter for WhatsApp styling (*bold*, _italic_, ~strike~)
    const formattedContent = parsedContent
      .replace(/\*(.*?)\*/g, '<b>$1</b>')
      .replace(/_(.*?)_/g, '<i>$1</i>')
      .replace(/~(.*?)~/g, '<s>$1</s>')
      .replace(/\n/g, '<br />')

    return (
      <Text size="sm" dangerouslySetInnerHTML={{ __html: formattedContent }} />
    )
  }

  const renderMediaPlaceholder = () => {
    const placeholders = {
      [Message.IMAGE]: { icon: 'tabler:photo', label: 'Image' },
      [Message.VIDEO]: { icon: 'tabler:video', label: 'Video' },
      [Message.FILE]: { icon: 'tabler:file-text', label: 'File' },
    }

    const placeholder = placeholders[type]

    if (!placeholder) return null

    return (
      <Paper withBorder p="sm" radius="sm" bg="gray.1">
        <Group>
          <Icon icon={placeholder.icon} fontSize={24} color="gray" />
          <Text c="dimmed" size="sm">
            {placeholder.label} Preview
          </Text>
        </Group>
      </Paper>
    )
  }

  return (
    <Paper p="md" withBorder shadow="none" radius="md" h="100%">
      <Stack>
        <Group>
          <Icon icon="tabler:eye" />
          <Title order={5}>Live Preview</Title>
        </Group>
        <Paper
          shadow="xs"
          p="sm"
          radius="md"
          style={{
            backgroundColor: '#e6ffda', // WhatsApp outgoing bubble color
            alignSelf: 'flex-start',
          }}
        >
          <Stack gap={4}>
            {renderMediaPlaceholder()}
            {renderContent()}
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  )
}

export default MessagePreview
