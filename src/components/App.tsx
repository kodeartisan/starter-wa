import { Action, Page, Setting } from '@/constants'
import BroadcastListener from '@/features/broadcast/components/Listeners/BroadcastListener'
import PageBroadcast from '@/features/broadcast/PageBroadcast'
import PageFaq from '@/features/faq/PageFaq'
import PageHome from '@/features/home/PageHome'
import PageLabel from '@/features/label/PageLabel'
import PageProfile from '@/features/profile/PageProfile'
import PageQuickReply from '@/features/quick-reply/PageQuickReply'
import PageDirectChat from '@/features/tools/direct-chat/PageDirectChat'
import PageGroupLinkGenerator from '@/features/tools/group-link-generator/PageGroupLinkGenerator'
import PageNumberValidator from '@/features/tools/number-validator/PageNumberValidator'
import PageTools from '@/features/tools/PageTools'
import PagePrivacy from '@/features/tools/privacy/components/PagePrivacy'
import PrivacyListener from '@/features/tools/privacy/components/PrivacyListener'
import PageWaMeGenerator from '@/features/tools/wa-me/PageWaMeGenerator'
import useLicense from '@/hooks/useLicense'
import useRuntimeMessage from '@/hooks/useRuntimeMessage'
import useWa from '@/hooks/useWa'
import useWindowMessage from '@/hooks/useWindowMessage'
import { useAppStore } from '@/stores/app'
import { Icon } from '@iconify/react'
import { Box, Stack, Tabs, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useStorage } from '@plasmohq/storage/hook'
import React, { useEffect, useState } from 'react'
import classes from './App.module.css'
import Modal from './Modal/Modal'
import ModalActivation from './Modal/ModalActivation'
import ModalUpgrade from './Modal/ModalUpgrade'

const App: React.FC = () => {
  const wa = useWa()
  const { setIsReady, setGroups, setProfile, setActiveChat } = useAppStore()
  const license = useLicense()
  const [showModalMain, modalMain] = useDisclosure(true)
  const [showModalUpgrade, modalUpgrade] = useDisclosure(false)
  const [showModalActivation, modalActivation] = useDisclosure(false)
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
        modalMain.toggle()
        setActiveTab(body)
        break
      case Action.Window.SHOW_MODAL_UPGRADE:
        modalUpgrade.toggle()
        break
      case Action.Window.SHOW_MODAL_ACTIVATION:
        modalActivation.toggle()
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

  useEffect(() => {
    ;(async function () {
      if (!wa.isReady) return
      setTimeout(async () => {
        await getGroups()
      }, 2000)
    })()
  }, [wa.isReady])

  const getGroups = async () => {
    const response = await wa.chat.list({ onlyGroups: true })
    setGroups(response)
  }

  const handleChangeTab = (value: string | null) => {
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

  const renderTabList = () => {
    return (
      <Tabs.List
        style={{
          gap: 10,
          background: 'var(--mantine-primary-color-filled)',
        }}
      >
        <Stack justify="space-between" gap={0} style={{ height: '100%' }}>
          <Box>
            <Tabs.Tab value={Page.HOME} className={classes.tab}>
              <Tooltip label="Home" position="left">
                <Icon icon="tabler:home" fontSize={26} color="white" />
              </Tooltip>
            </Tabs.Tab>
            <Tabs.Tab value={Page.BROADCAST} className={classes.tab}>
              <Tooltip label="Broadcast" position="left">
                <Icon icon="tabler:broadcast" fontSize={26} color="white" />
              </Tooltip>
            </Tabs.Tab>
            <Tabs.Tab value={Page.LABEL} className={classes.tab}>
              <Tooltip label="Labels" position="left">
                <Icon icon="tabler:tags" fontSize={26} color="white" />
              </Tooltip>
            </Tabs.Tab>
            <Tabs.Tab value={Page.QUICK_REPLY} className={classes.tab}>
              <Tooltip label="Quick Reply" position="left">
                <Icon
                  icon="tabler:arrow-back-up-double"
                  fontSize={26}
                  color="white"
                />
              </Tooltip>
            </Tabs.Tab>
            <Tabs.Tab value={Page.TOOLS} className={classes.tab}>
              <Tooltip label="Tools">
                <Icon icon="tabler:tools" color="white" fontSize={26} />
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
          <PageHome />
        </Tabs.Panel>
        <Tabs.Panel value={Page.BROADCAST}>
          <PageBroadcast />
        </Tabs.Panel>
        <Tabs.Panel value={Page.LABEL}>
          <PageLabel />
        </Tabs.Panel>
        <Tabs.Panel value={Page.QUICK_REPLY}>
          <PageQuickReply />
        </Tabs.Panel>
        <Tabs.Panel value={Page.TOOLS}>
          <PageTools />
        </Tabs.Panel>
        <Tabs.Panel value={Page.FAQ}>
          <PageFaq />
        </Tabs.Panel>
        <Tabs.Panel value={Page.PROFILE}>
          <PageProfile />
        </Tabs.Panel>
        <Tabs.Panel value={Page.DIRECT_CHAT}>
          <PageDirectChat />
        </Tabs.Panel>
        <Tabs.Panel value={Page.NUMBER_VALIDATOR}>
          <PageNumberValidator />
        </Tabs.Panel>
        <Tabs.Panel value={Page.PRIVACY}>
          <PagePrivacy />
        </Tabs.Panel>
        <Tabs.Panel value={Page.WA_ME_GENERATOR}>
          <PageWaMeGenerator />
        </Tabs.Panel>
        <Tabs.Panel value={Page.GROUP_LINK_GENERATOR}>
          <PageGroupLinkGenerator />
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
        >
          {renderTabList()}
          {renderTabPanel()}
        </Tabs>
      </Modal>
      <ModalUpgrade opened={showModalUpgrade} onClose={modalUpgrade.close} />
      <ModalActivation
        opened={showModalActivation}
        onClose={modalActivation.close}
      />
      <BroadcastListener />
      <PrivacyListener />
    </>
  )
}

export default App
