// src/features/broadcast/components/Modal/ModalCreateBroadcast.tsx
import Modal from '@/components/Modal/Modal'
import type { Broadcast } from '@/libs/db'
import { useBroadcastForm } from '@/models/useBroadcastForm'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  Grid,
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
import SmartPauseSettings from '../Form/SmartPauseSettings'
import InputTyping from '../Input/InputTyping'
import InputMessage from '../Input/Message/InputMessage'
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

  return (
    <>
      <Modal opened={opened} onClose={handleClose} w={800} withCloseButton>
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
              onLoad={loadListModalHandlers.open}
            />
            <Grid>
              <Grid.Col span={12}>
                <InputMessage form={inputMessageForm} />
              </Grid.Col>
            </Grid>
            <Group grow>
              <NumberInput
                label={
                  <Group gap={4} wrap="nowrap">
                    <Text size="sm" fw={500}>
                      Min Delay (sec)
                    </Text>
                    <Tooltip
                      label="Pausing between messages mimics human behavior and significantly reduces the risk of your account being flagged as spam by WhatsApp."
                      position="top-start"
                      multiline
                      withArrow
                      w={300}
                    >
                      <Icon
                        icon="tabler:info-circle"
                        style={{ display: 'block' }}
                      />
                    </Tooltip>
                  </Group>
                }
                description="Minimum time between messages."
                size="sm"
                min={3}
                {...form.getInputProps('delayMin')}
              />
              <NumberInput
                label="Max Delay (sec)"
                description="Maximum time between messages."
                min={5}
                size="sm"
                {...form.getInputProps('delayMax')}
              />
            </Group>
            <Group grow>
              <InputTyping form={form} />
              <Switch
                label={
                  <Group gap={4} wrap="nowrap">
                    <Text fw={500}>Only send to valid numbers</Text>
                    <Tooltip
                      label="Before sending, check if each number is a valid WhatsApp account and reduce the risk of being flagged."
                      position="top-start"
                      multiline
                      w={300}
                      withArrow
                    >
                      <Icon
                        icon="tabler:info-circle"
                        style={{ display: 'block' }}
                      />
                    </Tooltip>
                  </Group>
                }
                {...form.getInputProps('validateNumbers', {
                  type: 'checkbox',
                })}
              />
            </Group>
            <Group grow>
              <SmartPauseSettings form={form} />
              <Stack>
                <Switch
                  label={
                    <Group gap={4} wrap="nowrap">
                      <Text fw={500}>Batch sending</Text>
                      <Tooltip
                        label="Splitting a large broadcast into smaller batches with a pause in between simulates human behavior, reducing the risk of being flagged for spam."
                        position="top-start"
                        multiline
                        withArrow
                        w={300}
                      >
                        <Icon
                          icon="tabler:info-circle"
                          style={{ display: 'block' }}
                        />
                      </Tooltip>
                    </Group>
                  }
                  {...form.getInputProps('batch.enabled', {
                    type: 'checkbox',
                  })}
                />
                <When condition={form.values.batch.enabled}>
                  <Group grow align="flex-start">
                    <NumberInput
                      label="Messages per batch"
                      min={1}
                      {...form.getInputProps('batch.size')}
                    />
                    <NumberInput
                      label="Wait time (minutes)"
                      description="Delay between batches."
                      min={1}
                      {...form.getInputProps('batch.delay')}
                    />
                  </Group>
                  {form.errors['batch'] && (
                    <Text c="red" size="xs">
                      {' '}
                      {form.errors['batch']}{' '}
                    </Text>
                  )}
                </When>
              </Stack>
            </Group>
            <Group grow>
              <BroadcastScheduler form={form} />
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
