import InputMessage from '@/components/Input/Message/InputMessage'
import Modal from '@/components/Modal/Modal'
import type { Broadcast } from '@/libs/db'
import { ScrollArea, Stack, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import { useBroadcastForm } from '../../hooks/useBroadcastForm'
import AntiBlockingSettings from '../Form/AntiBlockingSettings'
import BroadcastActions from '../Form/BroadcastActions'
import BroadcastScheduler from '../Form/BroadcastScheduler'
import RecipientManager from '../Form/RecipientManager'
import ModalFirstBroadcastWarning from './ModalFirstBroadcastWarning'
import ModalManageSources from './ModalManageSources'

interface Props {
  opened: boolean
  onClose: () => void
  onSuccess: () => void
  cloneData?: (Broadcast & { recipients?: any[] }) | null
}

const ModalCreateBroadcast: React.FC<Props> = ({
  opened,
  onClose,
  onSuccess,
  cloneData = null,
}) => {
  const [showWarningModal, warningModalHandlers] = useDisclosure(false)
  const [showSourcesModal, sourcesModalHandlers] = useDisclosure(false)

  const {
    form,
    inputMessageForm,
    isPreviewing,
    estimatedTime,
    handleClose,
    handlePreviewBroadcast,
    handleSendBroadcast,
    handleWarningAccepted,
  } = useBroadcastForm({
    cloneData,
    onSuccess,
    onClose,
  })

  // This handler remains in the component as it deals with another modal's state.
  const handleUpdateRecipients = (newNumbers: any[]) => {
    form.setFieldValue('numbers', newNumbers)
    sourcesModalHandlers.close()
  }

  // This handler orchestrates the send action, opening the warning modal if needed.
  const onSendClick = async () => {
    const result = await handleSendBroadcast()
    if (result === false) {
      warningModalHandlers.open()
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} w={900} withCloseButton>
        <ScrollArea h={650}>
          <Stack>
            <TextInput
              label="Broadcast Name"
              placeholder="e.g., Weekly Newsletter"
              {...form.getInputProps('name')}
            />
            <RecipientManager
              recipientCount={form.values.numbers.length}
              error={form.errors.numbers}
              onClear={() => form.setFieldValue('numbers', [])}
              onManage={sourcesModalHandlers.open}
            />
            <InputMessage form={inputMessageForm} />
            <AntiBlockingSettings form={form} />
            <BroadcastScheduler form={form} estimatedTime={estimatedTime} />
            <BroadcastActions
              onPreview={handlePreviewBroadcast}
              onSend={onSendClick}
              isPreviewing={isPreviewing}
              isScheduled={form.values.scheduler.enabled}
              scheduledAt={form.values.scheduler.scheduledAt}
            />
          </Stack>
        </ScrollArea>
      </Modal>

      <ModalManageSources
        opened={showSourcesModal}
        onClose={sourcesModalHandlers.close}
        onSubmit={handleUpdateRecipients}
        initialRecipients={form.values.numbers}
      />
      <ModalFirstBroadcastWarning
        opened={showWarningModal}
        onClose={warningModalHandlers.close}
        onConfirm={async () => {
          warningModalHandlers.close()
          await handleWarningAccepted()
        }}
      />
    </>
  )
}

export default ModalCreateBroadcast
