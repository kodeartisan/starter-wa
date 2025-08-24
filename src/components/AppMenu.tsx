// src/components/AppMenu.tsx
import { Action, Page, Setting } from '@/constants'
import PageDirectChat from '@/features/direct-chat/PageDirectChat'
import PageChatBackup from '@/features/tools/backup-chat/PageChatBackup'
import useLicense from '@/hooks/useLicense'
import useRuntimeMessage from '@/hooks/useRuntimeMessage'
import useWindowMessage from '@/hooks/useWindowMessage'
import { useAppStore } from '@/stores/app'
import env from '@/utils/env'
import { goToLandingPage } from '@/utils/util'
import { Icon } from '@iconify/react'
import { Box, Stack, Tabs, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useStorage } from '@plasmohq/storage/hook'
import React, { useEffect, useState } from 'react'
import classes from './AppMenu.module.css'
import Modal from './Modal/Modal'
import ModalActivation from './Modal/ModalActivation'
import ModalFaq from './Modal/ModalFaq'
import ModalProfile from './Modal/ModalProfile'

const AppMenu: React.FC = () => {
  const { setIsReady, setActiveChat } = useAppStore()
  const license = useLicense()
  const [showModalMain, modalMain] = useDisclosure(env.isDevelopment())
  const [showModalActivation, modalActivation] = useDisclosure(false)
  const [showModalFaq, modalFaq] = useDisclosure(false)
  const [showModalProfile, modalProfile] = useDisclosure(false)
  const [needToOpen, setNeedToOpen] = useStorage(Setting.NEED_TO_OPEN, false)
  const [activeTab, setActiveTab] = useState<string | null>(Page.HOME)

  useWindowMessage(async (event: MessageEvent) => {
    const {
      data: { action, body },
    } = event
    switch (action) {
      case Action.Window.READY:
        setIsReady(true)
        break
      case Action.Window.ACTIVE_CHAT:
        setActiveChat(body)
        break
      case Action.Window.GO_TO_PAGE:
        setActiveTab(body)
        break
      case Action.Window.SHOW_MODAL_UPGRADE:
        goToLandingPage()
        break
      case Action.Window.SHOW_MODAL_ACTIVATION:
        modalActivation.toggle()
        break
      case Action.Window.SHOW_MODAL_FAQ:
        modalFaq.toggle()
        break
      case Action.Window.SHOW_MODAL_PROFILE:
        modalProfile.toggle()
        break
      default:
        break
    }
  })

  useRuntimeMessage((message, sender, sendResponse) => {
    switch (message.name) {
      case Action.Window.SHOW_MODAL_MAIN:
        modalMain.toggle()
        sendResponse()
        break
      default:
        break
    }
    // Return true to keep the message channel open for async responses
    return true
  })

  useEffect(() => {
    license.init().then().catch(console.error)
  }, [])

  useEffect(() => {
    if (needToOpen) {
      modalMain.open()
      setNeedToOpen(false).then().catch(console.error)
    }
  }, [needToOpen])

  const handleChangeTab = (value: string | null) => {
    if (Page.UPGRADE === value) {
      goToLandingPage()
      return
    }
    if (Page.ACTIVATE === value) {
      modalActivation.toggle()
      return
    }
    if (Page.FAQ === value) {
      goToLandingPage()
      return
    }
    if (Page.PROFILE === value) {
      modalProfile.toggle()
      return
    }
    setActiveTab(value)
  }

  const renderTabList = () => {
    return (
      <Tabs.List
        style={{
          gap: 10,
          background:
            'linear-gradient(180deg, var(--mantine-color-teal-7) 0%, var(--mantine-color-teal-9) 100%)',
        }}
      >
        <Stack justify="space-between" gap={0} style={{ height: '100%' }}>
          <Box>
            <Tabs.Tab value={Page.HOME} className={classes.tab}>
              <Tooltip label="Direct Chat" position="left">
                <Icon
                  icon="tabler:message-circle-plus"
                  fontSize={26}
                  color="white"
                />
              </Tooltip>
            </Tabs.Tab>
          </Box>
          <Box>
            <Tabs.Tab value={Page.FAQ} className={classes.tab}>
              <Tooltip label="Faqs">
                <Icon
                  icon="tabler:world-question"
                  fontSize={26}
                  color="white"
                />
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
  }

  const renderTabPanel = () => {
    return (
      <>
        <Tabs.Panel value={Page.HOME}>
          <PageDirectChat />
        </Tabs.Panel>
      </>
    )
  }

  return (
    <>
      <Modal opened={showModalMain} onClose={modalMain.close} p={0}>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          variant="pills"
          orientation="vertical"
          radius={0}
          keepMounted={false}
        >
          {renderTabList()}
          {renderTabPanel()}
        </Tabs>
      </Modal>
      <ModalActivation
        opened={showModalActivation}
        onClose={modalActivation.close}
      />
      <ModalFaq opened={showModalFaq} onClose={modalFaq.close} />
      <ModalProfile opened={showModalProfile} onClose={modalProfile.close} />
    </>
  )
}

export default AppMenu
