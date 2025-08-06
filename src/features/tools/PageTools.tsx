// src/features/Tools/PageTools.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import { Page } from '@/constants'
import page from '@/utils/page'
import { Icon } from '@iconify/react'
import { SimpleGrid, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core'
import React from 'react'

/**
 * @description Defines a single tool item for the grid display.
 */
interface ToolItem {
  key: string
  title: string
  description: string
  icon: string
}

const PageTools: React.FC = () => {
  const toolList: ToolItem[] = [
    {
      key: Page.DIRECT_CHAT,
      title: 'Direct Chat',
      description: 'Start a chat without saving the number to your contacts.',
      icon: 'tabler:message-circle-plus',
    },

    {
      key: Page.NUMBER_VALIDATOR,
      title: 'Number Validator',
      description: 'Check if WhatsApp numbers are valid.',
      icon: 'tabler:checks',
    },
    {
      key: Page.PRIVACY,
      title: 'Privacy',
      description: 'Blur messages, names, and photos for enhanced privacy.',
      icon: 'tabler:eye-off',
    },
    {
      key: Page.EXPORT,
      title: 'Export Contacts',
      description: 'Export contacts, chats, and group members.',
      icon: 'tabler:download',
    },
    {
      key: Page.WA_ME_GENERATOR,
      title: 'WA.me Generator',
      description: 'Create a WhatsApp click-to-chat link instantly.',
      icon: 'tabler:link',
    },
    {
      key: Page.GROUP_LINK_GENERATOR,
      title: 'Group Link Generator',
      description: 'Get an invite link for any of your groups.',
      icon: 'tabler:ticket',
    },
  ]

  const handleToolClick = (key: ToolItem['key']) => {
    switch (key) {
      case Page.DIRECT_CHAT:
        page.goTo(Page.DIRECT_CHAT)
        break
      case Page.NUMBER_VALIDATOR:
        page.goTo(Page.NUMBER_VALIDATOR)
        break
      case Page.PRIVACY:
        page.goTo(Page.PRIVACY)
        break
      case Page.EXPORT:
        page.goTo(Page.EXPORT)
        break
      case Page.WA_ME_GENERATOR:
        page.goTo(Page.WA_ME_GENERATOR)
        break
      case Page.GROUP_LINK_GENERATOR:
        page.goTo(Page.GROUP_LINK_GENERATOR)
        break
      default:
        break
    }
  }

  const renderGrid = () => (
    <SimpleGrid cols={3} spacing="lg">
      {toolList.map((tool) => (
        <Tooltip
          key={tool.key}
          label={tool.description}
          position="top"
          withArrow
        >
          <UnstyledButton onClick={() => handleToolClick(tool.key)}>
            <Stack align="center" gap="sm">
              <Icon
                icon={tool.icon}
                fontSize={32}
                color="var(--mantine-color-teal-6)"
              />
              <Text fw={500}>{tool.title}</Text>
            </Stack>
          </UnstyledButton>
        </Tooltip>
      ))}
    </SimpleGrid>
  )
  return (
    <LayoutPage title="Tools">
      <Stack p="md">{renderGrid()}</Stack>
    </LayoutPage>
  )
}

export default PageTools
