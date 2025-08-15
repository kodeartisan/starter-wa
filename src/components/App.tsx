import { Action, Page, Setting } from '@/constants'
import PageChatBackup from '@/features/tools/backup-chat/PageChatBackup'
import useLicense from '@/hooks/useLicense'
import useRuntimeMessage from '@/hooks/useRuntimeMessage'
import useWa from '@/hooks/useWa'
import useWindowMessage from '@/hooks/useWindowMessage'
import { useAppStore } from '@/stores/app'
import { useDisclosure } from '@mantine/hooks'
import { useStorage } from '@plasmohq/storage/hook'
import React, { useEffect, useState } from 'react'
import Modal from './Modal/Modal'
import ModalActivation from './Modal/ModalActivation'
import ModalFaq from './Modal/ModalFaq'
import ModalProfile from './Modal/ModalProfile'
import ModalUpgrade from './Modal/ModalUpgrade'

const App: React.FC = () => {
  const { setIsReady } = useAppStore()
  const license = useLicense()
  const [showModalMain, modalMain] = useDisclosure(true)
  const [showModalUpgrade, modalUpgrade] = useDisclosure(false)
  const [showModalActivation, modalActivation] = useDisclosure(false)
  const [showModalProfile, modalProfile] = useDisclosure(false)
  const [showModalFaq, modalFaq] = useDisclosure(false)
  const [needToOpen, setNeedToOpen] = useStorage(Setting.NEED_TO_OPEN, false)

  useWindowMessage(async (event: MessageEvent) => {
    const {
      data: { action, body },
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
      case Action.Window.SHOW_MODAL_PROFILE:
        modalProfile.toggle()
        break
      case Action.Window.SHOW_MODAL_FAQ:
        modalFaq.toggle()
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

  return (
    <>
      <Modal opened={showModalMain} onClose={modalMain.close} p={0}>
        <PageChatBackup />
      </Modal>
      <ModalUpgrade opened={showModalUpgrade} onClose={modalUpgrade.close} />
      <ModalActivation
        opened={showModalActivation}
        onClose={modalActivation.close}
      />
      <ModalProfile opened={showModalProfile} onClose={modalProfile.close} />
      <ModalFaq opened={showModalFaq} onClose={modalFaq.close} />
    </>
  )
}

export default App
