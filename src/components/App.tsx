import { Action, Page, PRIMARY_ICON } from '@/constants'
import BroadcastListener from '@/features/broadcast/components/Listeners/BroadcastListener'
import PageBroadcast from '@/features/broadcast/PageBroadcast'
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
import ModalActivation from './Modal/ModalActivation'
import ModalFaq from './Modal/ModalFaq'
import ModalPricing from './Modal/ModalPricing'
import ModalProfile from './Modal/ModalProfile'
import ModalUpgrade from './Modal/ModalUpgrade'

const App: React.FC = () => {
  const wa = useWa()
  const { setIsReady, setGroups, setProfile } = useAppStore()
  const license = useLicense()
  const [showModalActivation, modalActivation] = useDisclosure(false)
  const [showModalFaq, modalFaq] = useDisclosure(false)
  const [showModalProfile, modalProfile] = useDisclosure(false)
  const [showModalPricing, modalPricing] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [showModalUpgrade, modalUpgradeHandlers] = useDisclosure(false)
  const [upgradeInfo, setUpgradeInfo] = useState({
    featureName: '',
    featureBenefit: '',
  })

  useWindowMessage(async (event: MessageEvent) => {
    const {
      data: { action, body },
    } = event
    switch (action) {
      case Action.Window.READY:
        setIsReady(true)
        break
      case Action.Window.GO_TO_PAGE:
        setActiveTab(body)
        break
      case Action.Window.SHOW_MODAL_UPGRADE:
        setUpgradeInfo({
          featureName: body.featureName,
          featureBenefit: body.featureBenefit,
        })
        modalUpgradeHandlers.open()
        break
      case Action.Window.CLOSE_PAGE:
        setActiveTab(null)
        break
      case Action.Window.SHOW_MODAL_PRICING:
        modalPricing.toggle()
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

  useEffect(() => {
    license.init().then().catch(console.error)
  }, [])

  const handleChangeTab = (value: string) => {
    if (Page.UPGRADE === value) {
      modalPricing.toggle()
      return
    }
    if (Page.ACTIVATE === value) {
      modalActivation.toggle()
      return
    }
    if (Page.FAQ === value) {
      modalFaq.toggle()
      return
    }
    if (Page.PROFILE === value) {
      modalProfile.toggle()
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
            <Tooltip label="Broadcast">
              <Icon icon={PRIMARY_ICON} color="white" fontSize={26} />
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
        <PageBroadcast />
      </Tabs.Panel>
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
      <ModalActivation
        opened={showModalActivation}
        onClose={modalActivation.close}
      />
      <ModalFaq opened={showModalFaq} onClose={modalFaq.close} />
      <ModalProfile opened={showModalProfile} onClose={modalProfile.close} />
      <ModalPricing opened={showModalPricing} onClose={modalPricing.close} />
      <ModalUpgrade
        opened={showModalUpgrade}
        onClose={modalUpgradeHandlers.close}
        featureName={upgradeInfo.featureName}
        featureBenefit={upgradeInfo.featureBenefit}
      />
      <BroadcastListener />
    </>
  )
}

export default App
