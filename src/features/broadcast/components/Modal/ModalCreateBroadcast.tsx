// src/features/broadcast/components/Modal/ModalCreateBroadcast.tsx
import Modal from '@/components/Modal/Modal'
import { Message } from '@/constants'
import type { Broadcast } from '@/libs/db'
import { useBroadcastForm } from '@/models/useBroadcastForm'
import toast from '@/utils/toast'
import {
  Box,
  Grid,
  Group,
  ScrollArea,
  Stack,
  TagsInput,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import AntiBlockingSettings from '../Form/AntiBlockingSettings' // Import the new component
import BroadcastActions from '../Form/BroadcastActions'
import BroadcastScheduler from '../Form/BroadcastScheduler'
import RecipientManager from '../Form/RecipientManager'
import SmartPauseSettings from '../Form/SmartPauseSettings'
import InputMessage from '../Input/Message/InputMessage'
import MessagePreview from '../Preview/MessagePreview'
import ModalDuplicateWarning from './ModalDuplicateWarning'
import ModalFirstBroadcastWarning from './ModalFirstBroadcastWarning'
import ModalLoadRecipientList from './ModalLoadRecipientList'
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
  const [showDuplicateWarning, duplicateWarningHandlers] = useDisclosure(false)
  const [showLoadListModal, loadListModalHandlers] = useDisclosure(false)

  const {
    form,
    inputMessageForm,
    handleClose,
    handleSendBroadcast,
    handleWarningAccepted,
    forceSendBroadcast,
  } = useBroadcastForm({ cloneData, onSuccess, onClose })

  const handleUpdateRecipients = (newNumbers: any[]) => {
    form.setFieldValue('numbers', newNumbers)
    sourcesModalHandlers.close()
  }

  const handleLoadRecipients = (loadedRecipients: any[]) => {
    form.setFieldValue('numbers', loadedRecipients)
    loadListModalHandlers.close()
    toast.success(`Loaded ${loadedRecipients.length} recipients successfully.`)
  }

  const onSendClick = async () => {
    const result = await handleSendBroadcast()

    if (result === 'NEEDS_WARNING') {
      warningModalHandlers.open()
    } else if (result === 'DUPLICATE') {
      duplicateWarningHandlers.open()
    }
  }

  // Prepare the message object for the live preview component
  const { type, inputText, inputImage, inputVideo, inputFile } =
    inputMessageForm.values
  let messageForPreview: any

  switch (type) {
    case Message.TEXT:
      messageForPreview = inputText
      break
    case Message.IMAGE:
      messageForPreview = { caption: inputImage.caption }
      break
    case Message.VIDEO:
      messageForPreview = { caption: inputVideo.caption }
      break
    case Message.FILE:
      messageForPreview = { caption: inputFile.caption }
      break
    default:
      messageForPreview = null
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} w={920} withCloseButton>
        <ScrollArea h={650}>
          <Stack px={'md'}>
            <Group grow>
              <TextInput
                label="Name (Optional)"
                placeholder="e.g., Weekly Newsletter"
                {...form.getInputProps('name')}
              />
              <TagsInput
                label="Tags (Optional)"
                placeholder="Add tags and press Enter"
                {...form.getInputProps('tags')}
                clearable
              />
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <Stack>
                  <RecipientManager
                    recipientCount={form.values.numbers.length}
                    error={form.errors.numbers}
                    onClear={() => form.setFieldValue('numbers', [])}
                    onManage={sourcesModalHandlers.open}
                    onLoad={loadListModalHandlers.open}
                  />
                  <InputMessage form={inputMessageForm} />
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <MessagePreview type={type} message={messageForPreview} />
              </Grid.Col>
            </Grid>
            <AntiBlockingSettings form={form} />
            <Grid>
              <Grid.Col span={6}>
                <SmartPauseSettings form={form} />
              </Grid.Col>
              <Grid.Col span={6}>
                <BroadcastScheduler form={form} />
              </Grid.Col>
            </Grid>

            <BroadcastActions
              onSend={onSendClick}
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
      <ModalLoadRecipientList
        opened={showLoadListModal}
        onClose={loadListModalHandlers.close}
        onLoad={handleLoadRecipients}
      />
      <ModalFirstBroadcastWarning
        opened={showWarningModal}
        onClose={warningModalHandlers.close}
        onConfirm={async () => {
          warningModalHandlers.close()
          await handleWarningAccepted()
        }}
      />
      <ModalDuplicateWarning
        opened={showDuplicateWarning}
        onClose={duplicateWarningHandlers.close}
        onConfirm={async () => {
          duplicateWarningHandlers.close()
          await forceSendBroadcast()
        }}
      />
    </>
  )
}

export default ModalCreateBroadcast
