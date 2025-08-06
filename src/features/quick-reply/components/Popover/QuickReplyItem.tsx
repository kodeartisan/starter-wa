// src/features/quick-reply/components/Popover/QuickReplyItem.tsx
import { Media, Message } from '@/constants'
import db, { type QuickReply } from '@/libs/db'
import { useAppStore } from '@/stores/app'
import toast from '@/utils/toast'
import { generateVideoThumbnail } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Group,
  HoverCard,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import MessageType from '../../../broadcast/components/Datatable/MessageType'
import { getQuickReplyMessagePreview } from '../../helpers/preview'
import { sendQuickReply } from '../../helpers/sender'

interface Props {
  reply: QuickReply
  onDelete: (reply: QuickReply) => void
  onTogglePin: (reply: QuickReply) => void
}

const QuickReplyItem: React.FC<Props> = ({ reply, onDelete, onTogglePin }) => {
  const [isSending, setIsSending] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { activeChat } = useAppStore()

  useEffect(() => {
    let isMounted = true
    const generatePreview = async () => {
      if (reply.type === Message.IMAGE || reply.type === Message.VIDEO) {
        const media = await db.media
          .where({ parentId: reply.id, type: Media.QUICK_REPLY })
          .first()
        if (media?.file && isMounted) {
          try {
            if (reply.type === Message.IMAGE) {
              const url = URL.createObjectURL(media.file)
              setPreviewUrl(url)
            } else if (reply.type === Message.VIDEO) {
              const thumbnailUrl = await generateVideoThumbnail(media.file)
              setPreviewUrl(thumbnailUrl)
            }
          } catch (error) {
            console.error('Failed to generate preview:', error)
            setPreviewUrl(null) // Fallback to no preview on error
          }
        }
      }
    }
    generatePreview()

    return () => {
      isMounted = false
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [reply])

  const handleSend = async () => {
    if (!activeChat?.number) {
      toast.error('No active chat selected.')
      return
    }
    setIsSending(true)
    try {
      await sendQuickReply(reply, activeChat.number)
      toast.success(`Replied with "${reply.name}"`)
    } catch (error: any) {
      console.error('Failed to send quick reply:', error)
      toast.error(error.message || 'Failed to send reply.')
    } finally {
      setIsSending(false)
    }
  }

  // Get the preview for the item display (truncated)
  const itemPreview = getQuickReplyMessagePreview(reply, 40)

  // Get the full preview for the hover card
  const fullPreview =
    reply.type === Message.TEXT
      ? (reply.message as string)
      : getQuickReplyMessagePreview(reply, 300)

  return (
    <HoverCard shadow="md" position="left-start" withArrow openDelay={500}>
      <HoverCard.Target>
        <Paper withBorder p="xs" radius="sm">
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs" style={{ flex: 1, overflow: 'hidden' }}>
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  w={40}
                  h={40}
                  radius="sm"
                  fit="cover"
                  alt={`${reply.name} preview`}
                />
              ) : (
                <MessageType type={reply.type} />
              )}
              <Stack gap={0} style={{ flex: 1, overflow: 'hidden' }}>
                <Text fw={500} size="sm" truncate>
                  {reply.name}
                </Text>
                <Text c="dimmed" size="xs" truncate>
                  {itemPreview}
                </Text>
              </Stack>
            </Group>
            <Group gap={2} wrap="nowrap">
              {isSending ? (
                <Loader size={20} />
              ) : (
                <Tooltip label="Send" position="top">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={handleSend}
                    loading={isSending}
                  >
                    <Icon icon="tabler:send" />
                  </ActionIcon>
                </Tooltip>
              )}
              <Tooltip
                label={reply.isPinned ? 'Unpin' : 'Pin to Top'}
                position="top"
              >
                <ActionIcon
                  variant="subtle"
                  color={reply.isPinned ? 'yellow' : 'gray'}
                  onClick={() => onTogglePin(reply)}
                  disabled={isSending}
                >
                  <Icon
                    icon={reply.isPinned ? 'tabler:pin-filled' : 'tabler:pin'}
                  />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete" position="top">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onDelete(reply)}
                  disabled={isSending}
                >
                  <Icon icon="tabler:trash" />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Paper>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm" style={{ whiteSpace: 'pre-wrap', maxWidth: 300 }}>
          {fullPreview}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export default QuickReplyItem
