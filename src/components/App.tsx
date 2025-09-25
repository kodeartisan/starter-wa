import { Action, Page } from '@/constants'
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import useWindowMessage from '@/hooks/useWindowMessage'
import { useAppStore } from '@/stores/app'
import env from '@/utils/env'
import { Icon } from '@iconify/react'
import { Box, Group, Paper, Stack, Tabs, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { When } from 'react-if'
import classes from './App.module.css'

const App: React.FC = () => {
  const wa = useWa()
  const { setIsReady, setGroups, setProfile } = useAppStore()
  const license = useLicense()
  const [showModalUpgrade, modalUpgrade] = useDisclosure(false)
  const [showModalActivation, modalActivation] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)

  useWindowMessage(async (event: MessageEvent) => {
    const {
      data: { action },
    } = event
    switch (action) {
      case Action.Window.READY:
        setIsReady(true)
        break
      case Action.Window.SHOW_MODAL_UPGRADE:
        modalUpgrade.toggle()
        break
      case Action.Window.SHOW_MODAL_ACTIVATION:
        modalActivation.toggle()
        break
      case Action.Window.CLOSE_PAGE:
        setActiveTab(null)
        break
    }
  })

  const handleChangeTab = (value: string) => {
    if (Page.UPGRADE === value) {
      modalUpgrade.toggle()
      return
    }
    if (Page.ACTIVATE === value) {
      modalActivation.toggle()
      return
    }
    setActiveTab(value)
  }

  const renderTabList = (
    <Tabs.List
      style={{
        gap: 10,
        height: '100%',
        flexDirection: 'row',
        background: 'var(--mantine-primary-color-filled)',
      }}
    >
      <Stack justify="space-between">
        <Box>
          <Tabs.Tab value={Page.HOME} className={classes.tab}>
            <Tooltip label="Group Sender">
              <Icon icon="tabler:send" color="white" fontSize={26} />
            </Tooltip>
          </Tabs.Tab>
        </Box>
        <Box>
          <Tabs.Tab value={Page.FAQ} className={classes.tab}>
            <Tooltip label="Faqs">
              <Icon icon="tabler:world-question" color="white" fontSize={26} />
            </Tooltip>
          </Tabs.Tab>
          <Tabs.Tab value={Page.UPGRADE} className={classes.tab}>
            <Tooltip label="Upgrade">
              <Icon icon="tabler:crown" color="white" fontSize={26} />
            </Tooltip>
          </Tabs.Tab>
          <Tabs.Tab value={Page.ACTIVATE} className={classes.tab}>
            <Tooltip label="Activate">
              <Icon icon="tabler:key" color="white" fontSize={26} />
            </Tooltip>
          </Tabs.Tab>
          <Tabs.Tab value={Page.PROFILE} className={classes.tab}>
            <Tooltip label="Profile">
              <Icon
                icon="tabler:user-square-rounded"
                color="white"
                fontSize={26}
              />
            </Tooltip>
          </Tabs.Tab>
        </Box>
      </Stack>
    </Tabs.List>
  )

  const renderTabPanel = (
    <>
      <Tabs.Panel value={Page.HOME}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
        minima quo, sed vel ea sequi architecto nulla officiis autem blanditiis
        nesciunt odio totam a minus in eligendi ipsam repellat repellendus.
      </Tabs.Panel>

      <Tabs.Panel value={Page.FAQ}>Faq</Tabs.Panel>
      <Tabs.Panel value={Page.PROFILE}>Profile</Tabs.Panel>
    </>
  )

  return (
    <>
      <When condition={wa.isReady}>
        <Group>
          <Tabs
            inverted
            orientation="vertical"
            variant="pills"
            radius={0}
            value={activeTab}
            onChange={handleChangeTab}
            style={{
              height: '100vh',
            }}
          >
            {renderTabPanel}
            <Paper shadow="xl">{renderTabList}</Paper>
          </Tabs>
        </Group>
      </When>
    </>
  )
}

export default App
