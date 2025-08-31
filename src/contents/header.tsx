import { Action, Page } from '@/constants'
import useWa from '@/hooks/useWa'
import db, { type Label } from '@/libs/db'
import theme from '@/libs/theme'
import page from '@/utils/page'
import style from '@/utils/style'
import { postMessage } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Badge,
  Box,
  Checkbox,
  Group,
  MantineProvider,
  Menu,
  ScrollArea,
  Text,
  Tooltip,
} from '@mantine/core'
import { useLiveQuery } from 'dexie-react-hooks'
import $ from 'jquery'
import _ from 'lodash'
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId,
} from 'plasmo'
import React, { useMemo, useState } from 'react'
import { When } from 'react-if'

export const getShadowHostId: PlasmoGetShadowHostId = () => `crm-header`

export const config: PlasmoCSConfig = {
  matches: ['https://web.whatsapp.com/*'],
}

export const getStyle = () => {
  const $style = document.createElement('style')
  $style.textContent = style.generate()
  return $style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: $('div[class="x78zum5 xdt5ytf x5yr21d"]')[0],
  insertPosition: 'afterbegin',
})

const Header = () => {
  const wa = useWa()
  const [activeLabelId, setActiveLabelId] = useState<number | null>(null)
  const allLabels = useLiveQuery(() => db.labels.toArray())

  const { pinnedLabels, unpinnedLabels } = useMemo(() => {
    const pinned =
      allLabels?.filter((label) => label.isPinned === 1 && label.show) || []
    const unpinned =
      allLabels?.filter((label) => !label.isPinned && label.show) || []
    return { pinnedLabels: pinned, unpinnedLabels: unpinned }
  }, [allLabels])

  const handleFilterChat = async (label: Label) => {
    if (label.id === activeLabelId) {
      await wa.chat.setChatList('all')
      setActiveLabelId(null)
      return
    }
    await wa.chat.setChatList('custom', label.numbers)
    setActiveLabelId(label.id)
  }

  const handleClearFilter = async () => {
    await wa.chat.setChatList('all')
    setActiveLabelId(null)
  }

  const handleToggleVisibility = async (label: Label) => {
    await db.labels.update(label.id, { show: label.show ? 0 : 1 })
  }

  const handleTogglePin = async (label: Label) => {
    await db.labels.update(label.id, { isPinned: label.isPinned ? 0 : 1 })
  }

  const handleManageLabels = () => {
    postMessage(Action.Window.SHOW_MODAL_MAIN)
  }

  const renderLabel = (label: Label) => {
    const isActive = activeLabelId === label.id
    return (
      <Badge
        key={label.id}
        size="lg"
        color={label.color || 'gray'}
        radius={'sm'}
        variant={isActive ? 'filled' : 'light'}
        onClick={() => handleFilterChat(label)}
        mr={'sm'}
        style={{ cursor: 'pointer' }}
      >
        {label.label} ({label.numbers?.length || 0})
      </Badge>
    )
  }

  return (
    <MantineProvider
      theme={theme}
      cssVariablesSelector="div.plasmo-csui-container"
      getRootElement={() =>
        document
          .getElementById('crm-header')
          ?.shadowRoot?.querySelector('div.plasmo-csui-container') || undefined
      }
    >
      <Group
        style={{
          backgroundColor: 'var(--mantine-color-body)',
          borderBottom: '1px solid var(--mantine-color-gray-3)',
        }}
        w={'100%'}
        px="lg"
        py={10}
        justify="space-between"
        gap="xs"
        wrap="nowrap"
      >
        <ScrollArea w={1100}>
          <Box style={{ textWrap: 'nowrap' }}>
            {pinnedLabels.map(renderLabel)}
            {unpinnedLabels.map(renderLabel)}
          </Box>
        </ScrollArea>

        <Group mr={60} justify="flex-end" wrap="nowrap">
          <When condition={activeLabelId !== null}>
            <Tooltip label="Clear Filter" position="bottom">
              <ActionIcon
                variant="subtle"
                color="red"
                size="lg"
                onClick={handleClearFilter}
              >
                <Icon fontSize={22} icon={'tabler:x'} />
              </ActionIcon>
            </Tooltip>
          </When>

          <Menu shadow="md" width={280} position="bottom-end">
            <Menu.Target>
              <Tooltip label="Manage Filters & Labels" position="bottom">
                <ActionIcon variant="subtle" size="lg">
                  <Icon fontSize={22} icon={'tabler:adjustments-alt'} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <ScrollArea h={200}>
                {allLabels?.map((label) => (
                  <Menu.Item key={label.id} closeMenuOnClick={false}>
                    <Group justify="space-between" wrap="nowrap">
                      <Checkbox
                        checked={!!label.show}
                        onChange={() => handleToggleVisibility(label)}
                        label={
                          <Text size="sm" truncate>
                            {label.label}
                          </Text>
                        }
                        color={label.color}
                      />
                      <Tooltip
                        label={label.isPinned ? 'Unpin' : 'Pin'}
                        position="left"
                      >
                        <ActionIcon
                          variant="subtle"
                          color={label.isPinned ? 'yellow' : 'gray'}
                          onClick={() => handleTogglePin(label)}
                        >
                          <Icon
                            icon={
                              label.isPinned
                                ? 'tabler:star-filled'
                                : 'tabler:star'
                            }
                            fontSize={16}
                          />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Menu.Item>
                ))}
              </ScrollArea>
              <Menu.Divider />
              <Menu.Item
                leftSection={<Icon icon="tabler:settings" fontSize={16} />}
                onClick={handleManageLabels}
              >
                Manage labels
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </MantineProvider>
  )
}

export default Header
