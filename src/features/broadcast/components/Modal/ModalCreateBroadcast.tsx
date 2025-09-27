// src/features/broadcast/components/Modal/ModalCreateBroadcast.tsx
import Modal from '@/components/Modal/Modal'
import type { Broadcast } from '@/libs/db'
import { useBroadcastForm } from '@/models/useBroadcastForm'
import {
  Group,
  NumberInput,
  ScrollArea,
  Stack,
  Switch,
  TagsInput,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import { When } from 'react-if'
import BroadcastActions from '../Form/BroadcastActions'
import BroadcastScheduler from '../Form/BroadcastScheduler'
import RecipientManager from '../Form/RecipientManager'
import SignatureSettings from '../Form/SignatureSettings'
import SmartPauseSettings from '../Form/SmartPauseSettings'
import InputTyping from '../Input/InputTyping'
import InputMessage from '../Input/Message/InputMessage'
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
    handleClose,
    handleSendBroadcast,
    handleWarningAccepted,
  } = useBroadcastForm({ cloneData, onSuccess, onClose })

  const handleUpdateRecipients = (newNumbers: any[]) => {
    form.setFieldValue('numbers', newNumbers)
    sourcesModalHandlers.close()
  }

  const onSendClick = async () => {
    const result = await handleSendBroadcast()
    if (result === false) {
      warningModalHandlers.open()
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} w={850} withCloseButton>
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

            <RecipientManager
              recipientCount={form.values.numbers.length}
              error={form.errors.numbers}
              onClear={() => form.setFieldValue('numbers', [])}
              onManage={sourcesModalHandlers.open}
            />
            <InputMessage form={inputMessageForm} />

            <Group grow>
              <Tooltip
                label="The shortest time to wait before sending the next message. Helps simulate human behavior."
                position="top-start"
                multiline
                withArrow
              >
                <NumberInput
                  label="Min Delay (sec)"
                  description="Minimum time between messages."
                  size="sm"
                  min={3}
                  {...form.getInputProps('delayMin')}
                />
              </Tooltip>
              <Tooltip
                label="The longest time to wait before sending the next message. A random delay between Min and Max will be chosen for each message."
                position="top-start"
                multiline
                withArrow
              >
                <NumberInput
                  label="Max Delay (sec)"
                  description="Maximum time between messages."
                  min={5}
                  size="sm"
                  {...form.getInputProps('delayMax')}
                />
              </Tooltip>
            </Group>
            <Group grow>
              <InputTyping form={form} />
              <SignatureSettings />
            </Group>
            <Group grow>
              <Tooltip
                label="Before sending, check if each number is a valid WhatsApp account and reduce the risk of being flagged."
                position="top-start"
                multiline
                w={300}
                withArrow
                refProp="rootRef"
              >
                <Switch
                  label={<Text fw={500}>Only send to valid numbers</Text>}
                  {...form.getInputProps('validateNumbers', {
                    type: 'checkbox',
                  })}
                />
              </Tooltip>
              <BroadcastScheduler form={form} />
            </Group>
            <Group grow>
              <SmartPauseSettings form={form} />
              <Stack>
                <Tooltip
                  label="Split a large broadcast into smaller batches to simulate human behavior and reduce the risk of being flagged."
                  position="top-start"
                  multiline
                  w={300}
                  withArrow
                  refProp="rootRef"
                >
                  <Switch
                    label={<Text fw={500}>Batch sending</Text>}
                    {...form.getInputProps('batch.enabled', {
                      type: 'checkbox',
                    })}
                  />
                </Tooltip>
                <When condition={form.values.batch.enabled}>
                  <Group grow align="flex-start">
                    <Tooltip
                      label="The number of messages to send in each batch before pausing."
                      position="top-start"
                      withArrow
                    >
                      <NumberInput
                        label="Messages per batch"
                        min={1}
                        {...form.getInputProps('batch.size')}
                      />
                    </Tooltip>
                    <Tooltip
                      label="The amount of time to wait before starting the next batch."
                      position="top-start"
                      withArrow
                    >
                      <NumberInput
                        label="Wait time (minutes)"
                        description="Delay between batches."
                        min={1}
                        {...form.getInputProps('batch.delay')}
                      />
                    </Tooltip>
                  </Group>
                  {form.errors['batch'] && (
                    <Text c="red" size="xs">
                      {form.errors['batch']}
                    </Text>
                  )}
                </When>
              </Stack>
            </Group>

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
