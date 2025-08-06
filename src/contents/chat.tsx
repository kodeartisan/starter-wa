// src/contents/chat.tsx
import ModalCreateUpdateLabel from '@/features/label/components/ModalCreateUpdateLabel'
import PopoverQuickReplies from '@/features/quick-reply/components/Popover/PopoverQuickReplies'
import useWa from '@/hooks/useWa'
import db, { type Label } from '@/libs/db'
import theme from '@/libs/theme'
import { useAppStore } from '@/stores/app'
import style from '@/utils/style'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  MantineProvider,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useClipboard, useDisclosure } from '@mantine/hooks'
import { useLiveQuery } from 'dexie-react-hooks'
import $ from 'jquery'
import _ from 'lodash'
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId,
} from 'plasmo'
import { useMemo, useState } from 'react'

export const getShadowHostId: PlasmoGetShadowHostId = () => `crm-chat`

export const config: PlasmoCSConfig = {
  matches: ['https://web.whatsapp.com/*'],
}

export const getStyle = () => {
  const $style = document.createElement('style')
  $style.textContent = style.generate()
  return $style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: $(
    'div[class="x78zum5 xdt5ytf x1iyjqo2 xl56j7k xeuugli xtnn1bt x9v5kkp xmw7ebm xrdum7p"]',
  )[0],
})

const Chat = () => {
  const wa = useWa()
  const { activeChat } = useAppStore()
  const { copy, copied } = useClipboard()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateLabelModal, createLabelModalHandlers] = useDisclosure(false)
  const allLabels =
    useLiveQuery(() => db.labels.where({ custom: 1 }).toArray()) || []

  // This memoized value filters and groups the labels for display.
  // It runs only when the labels or search query change, improving performance.
  const groupedLabels = useMemo(() => {
    const filtered = allLabels.filter((label) =>
      label.label.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    const grouped = _.groupBy(filtered, (label) => label.group || 'Ungrouped')
    return Object.entries(grouped)
  }, [allLabels, searchQuery])

  const handleCopy = () => {
    copy(activeChat.number)
  }

  // Adds or removes the active chat's number from a label.
  const handleToggleLabel = async (label: Label) => {
    const { number } = activeChat
    const isIncluded = label.numbers?.includes(number)
    const updatedNumbers = isIncluded
      ? label.numbers?.filter((n) => n !== number)
      : [...(label.numbers || []), number]
    await db.labels.update(label.id, { numbers: updatedNumbers })
    if (isIncluded) {
      toast.info(`Removed from "${label.label}"`)
    } else {
      toast.success(`Added to "${label.label}"`)
    }
  }

  const renderCopyNumber = () => {
    return (
      <Tooltip
        label={copied ? 'Copied!' : 'Copy number'}
        position="top"
        withArrow
      >
        <ActionIcon variant="subtle" onClick={handleCopy}>
          <Icon fontSize={24} icon={copied ? 'tabler:check' : 'tabler:copy'} />
        </ActionIcon>
      </Tooltip>
    )
  }

  const renderLabelItem = (label: Label) => (
    <Group key={`popup-chat-${label.id}`} gap="xs" wrap="nowrap">
      <Checkbox
        size="sm"
        checked={label.numbers?.includes(activeChat.number)}
        onChange={() => handleToggleLabel(label)}
        aria-label={`Toggle label ${label.label}`}
      />
      <Text size="sm" truncate>
        {label.label}
      </Text>
    </Group>
  )

  const renderPopoverManageLabels = () => {
    return (
      <Popover width={300} shadow="md">
        <Popover.Target>
          <Tooltip label="Add to label" position="top">
            <ActionIcon variant="subtle">
              <Icon fontSize={24} icon={'tabler:folder-symlink'} />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <TextInput
              placeholder="Search labels..."
              leftSection={<Icon icon="tabler:search" fontSize={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
            <ScrollArea h={250}>
              {groupedLabels.length > 0 ? (
                <Stack gap="sm">
                  {groupedLabels.map(([groupName, labels]) => (
                    <Stack key={groupName} gap="xs">
                      <Text size="xs" c="dimmed" fw={700}>
                        {groupName}
                      </Text>
                      {labels.map(renderLabelItem)}
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed" ta="center" mt="md">
                  No labels found.
                </Text>
              )}
            </ScrollArea>
            <Button
              variant="light"
              size="xs"
              leftSection={<Icon icon="tabler:plus" fontSize={16} />}
              onClick={createLabelModalHandlers.open}
            >
              Create New Label
            </Button>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    )
  }

  return (
    <>
      <MantineProvider
        theme={theme}
        cssVariablesSelector="div.plasmo-csui-container"
        getRootElement={() =>
          document
            .getElementById('crm-chat')
            ?.shadowRoot?.querySelector('div.plasmo-csui-container') ||
          undefined
        }
      >
        <Group
          style={{ borderRight: '2px solid var(--mantine-color-gray-3)' }}
          pr={'lg'}
        >
          {renderCopyNumber()}
          {/* ++ ADDED: The Quick Reply popover is now rendered here. */}
          <PopoverQuickReplies />
          {renderPopoverManageLabels()}
        </Group>
        <ModalCreateUpdateLabel
          opened={showCreateLabelModal}
          onClose={createLabelModalHandlers.close}
        />
      </MantineProvider>
    </>
  )
}

export default Chat
