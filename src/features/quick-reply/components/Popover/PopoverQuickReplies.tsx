// src/features/quick-reply/components/Popover/PopoverQuickReplies.tsx
import { Media, Page } from '@/constants'
import type { QuickReply } from '@/libs/db'
import db from '@/libs/db'
import page from '@/utils/page'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useLiveQuery } from 'dexie-react-hooks'
import React, { useMemo, useState } from 'react'
import ModalCreateUpdateQuickReply from '../Modal/ModalCreateUpdateQuickReply'
import QuickReplyItem from './QuickReplyItem'

/**
 * @component PopoverQuickReplies
 * @description A popover for quickly accessing and sending pre-defined replies.
 */
const PopoverQuickReplies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, createModalHandlers] = useDisclosure(false)

  const quickReplies =
    useLiveQuery(
      async () =>
        // Sort by isPinned (descending) then by createdAt (descending)
        (await db.quickReplies.toArray()).sort((a, b) => {
          const pinA = a.isPinned ? 1 : 0
          const pinB = b.isPinned ? 1 : 0
          if (pinB !== pinA) return pinB - pinA
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        }),
      [],
    ) || []

  const filteredReplies = useMemo(() => {
    if (!searchQuery) return quickReplies
    const lowerCaseQuery = searchQuery.toLowerCase()
    return quickReplies.filter(
      (reply) =>
        reply.name.toLowerCase().includes(lowerCaseQuery) ||
        (reply.type === 'TEXT' &&
          (reply.message as string).toLowerCase().includes(lowerCaseQuery)),
    )
  }, [quickReplies, searchQuery])

  const handleDelete = async (reply: QuickReply) => {
    if (!window.confirm(`Are you sure you want to delete "${reply.name}"?`)) {
      return
    }
    try {
      await db.transaction('rw', db.quickReplies, db.media, async () => {
        await db.quickReplies.delete(reply.id)
        await db.media
          .where({ parentId: reply.id, type: Media.QUICK_REPLY })
          .delete()
      })
      toast.success(`"${reply.name}" was deleted.`)
    } catch (error) {
      console.error('Failed to delete quick reply:', error)
      toast.error('Could not delete the reply.')
    }
  }

  const handleTogglePin = async (reply: QuickReply) => {
    await db.quickReplies.update(reply.id, {
      isPinned: reply.isPinned ? 0 : 1,
    })
  }

  return (
    <>
      <Popover width={350} shadow="md" position="top-start">
        <Popover.Target>
          <Tooltip label="Quick Replies" position="top" withArrow>
            <ActionIcon variant="subtle">
              <Icon fontSize={24} icon={'tabler:replace'} />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <TextInput
              placeholder="Search..."
              leftSection={<Icon icon="tabler:search" fontSize={16} />}
              value={searchQuery}
              size="xs"
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
            <ScrollArea h={300}>
              {filteredReplies.length > 0 ? (
                <Stack>
                  {filteredReplies.map((reply) => (
                    <QuickReplyItem
                      key={reply.id}
                      reply={reply}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </Stack>
              ) : (
                <Center h={100}>
                  <Text c="dimmed" size="sm" ta="center">
                    No replies found.
                    <br />
                    Try a different search or create one!
                  </Text>
                </Center>
              )}
            </ScrollArea>
            <Button
              variant="light"
              size="xs"
              fullWidth
              onClick={() => page.goTo(Page.QUICK_REPLY)}
              leftSection={<Icon icon="tabler:settings" fontSize={16} />}
            >
              Manage Quick Replies
            </Button>
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <ModalCreateUpdateQuickReply
        opened={showCreateModal}
        onClose={createModalHandlers.close}
      />
    </>
  )
}

export default PopoverQuickReplies
