// src/features/broadcast/components/Input/Message/InputMessage.tsx
import { Media, Message, Setting } from '@/constants'
import useLicense from '@/hooks/useLicense'
import db, { type BroadcastTemplate } from '@/libs/db'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useStorage } from '@plasmohq/storage/hook'
import { useLiveQuery } from 'dexie-react-hooks'
import React, { useMemo } from 'react'
import { When } from 'react-if'
// ADDED: Import the modal for creating templates.
import ModalCreateUpdateTemplate from '../../Modal/ModalCreateUpdateTemplate'
import ModalManageTemplate from '../../Modal/ModalManageTemplate'
import FormDocument from './FormFile'
import FormImage from './FormImage'
import FormLocation from './FormLocation'
import FormPoll from './FormPoll'
import FormText from './FormText'
import FormVCard from './FormVCard'
import FormVideo from './FormVideo'
import ProFeatureButton from './ProFeatureButton'

interface Props {
  form: UseFormReturnType<any>
  disabledTemplateButton?: boolean
}

const InputMessage: React.FC<Props> = ({
  form,
  disabledTemplateButton = false,
}: Props) => {
  const license = useLicense()
  const templates = useLiveQuery(
    async () => await db.broadcastTemplates.toArray(),
  )
  const [showModalManageTemplate, modalManageTemplate] = useDisclosure(false)

  // ADDED: State and handlers for the "Save as Template" modal.
  const [showModalSaveTemplate, modalSaveTemplateHandlers] =
    useDisclosure(false)

  const [isSpintaxTipDismissed, setIsSpintaxTipDismissed] = useStorage(
    Setting.SPINTAX_TIP_DISMISSED,
    false,
  )

  const personalizationVariables = [
    {
      label: 'Spintax',
      variable: '{Hi|Hello}',
      tooltip:
        'Use Spintax to create message variations. The system will randomly pick one option. e.g., {Hi|Hello|Hola}',
    },
    { label: 'Name', variable: '{name}' },
    { label: 'Number', variable: '{number}' },
  ]

  const labelValueTemplates = useMemo(() => {
    return templates?.map((template: BroadcastTemplate, index) => ({
      label: template.name,
      value: index.toString(),
    }))
  }, [templates])

  const handleSelectTemplate = async (index: string) => {
    const { id, message, type } = templates![parseInt(index, 10)]
    const dataByMessageTypes: { [key: string]: () => any } = {
      [Message.TEXT]: () => ({ type, inputText: message }),
      [Message.IMAGE]: async () => {
        const broadcastFile = await db.media
          .where({ type: Media.BROADCAST_TEMPLATE, parentId: id })
          .first()
        return {
          type,
          inputImage: { file: broadcastFile?.file, ...(message as object) },
        }
      },
      [Message.VIDEO]: async () => {
        const broadcastFile = await db.media
          .where({ type: Media.BROADCAST_TEMPLATE, parentId: id })
          .first()
        return {
          type,
          inputVideo: { file: broadcastFile?.file, ...(message as object) },
        }
      },
      [Message.FILE]: async () => {
        const broadcastFile = await db.media
          .where({ type: Media.BROADCAST_TEMPLATE, parentId: id })
          .first()
        return {
          type,
          inputFile: { file: broadcastFile?.file, caption: message },
        }
      },
      [Message.LOCATION]: () => ({
        type,
        inputLocation: { ...(message as object) },
      }),
      [Message.POLL]: () => ({ type, inputPoll: { ...(message as object) } }),
    }

    const data = await dataByMessageTypes[type]?.()
    form.setValues(data)
  }

  const renderInputMessage = () => {
    switch (form.values.type) {
      case Message.TEXT:
        return <FormText form={form} variables={personalizationVariables} />
      case Message.IMAGE:
        return <FormImage form={form} variables={personalizationVariables} />
      case Message.VIDEO:
        return <FormVideo form={form} variables={personalizationVariables} />
      case Message.FILE:
        return <FormDocument form={form} variables={personalizationVariables} />
      case Message.LOCATION:
        return <FormLocation form={form} />
      case Message.POLL:
        return <FormPoll form={form} />
      case Message.VCARD:
        return <FormVCard form={form} />
      default:
        return null
    }
  }

  const renderMenuMessage = () => {
    return (
      <SimpleGrid cols={5}>
        <Tooltip label="Text" position="top">
          <Button
            size="sm"
            variant={form.values.type === Message.TEXT ? 'filled' : 'default'}
            onClick={() => form.setFieldValue('type', Message.TEXT)}
          >
            <Icon icon={'tabler:text-size'} fontSize={24} />
          </Button>
        </Tooltip>
        <ProFeatureButton
          form={form}
          label="Image"
          icon="tabler:photo"
          messageType={Message.IMAGE}
        />
        <ProFeatureButton
          form={form}
          label="Video"
          icon="tabler:video"
          messageType={Message.VIDEO}
        />
        <ProFeatureButton
          form={form}
          label="File"
          icon="tabler:file"
          messageType={Message.FILE}
        />
        <ProFeatureButton
          form={form}
          label="Location"
          icon="tabler:map-pin"
          messageType={Message.LOCATION}
        />
      </SimpleGrid>
    )
  }

  // ADDED: Function to check if the current message is empty to disable the save button.
  const isMessageEmpty = () => {
    const {
      type,
      inputText,
      inputImage,
      inputVideo,
      inputFile,
      inputLocation,
      inputPoll,
      inputVCard,
    } = form.values
    switch (type) {
      case Message.TEXT:
        return !inputText
      case Message.IMAGE:
        return !inputImage.file
      case Message.VIDEO:
        return !inputVideo.file
      case Message.FILE:
        return !inputFile.file
      case Message.LOCATION:
        return !inputLocation.lat || !inputLocation.lng
      case Message.POLL:
        return !inputPoll.name
      case Message.VCARD:
        return inputVCard.contacts.length === 0
      default:
        return true
    }
  }

  return (
    <>
      <Stack>
        {/* MODIFIED: Added a "Save as Template" icon next to the Message title */}
        <Group justify="space-between">
          <Group gap="xs" align="center">
            <Text fw={500}>Message</Text>
            <When condition={!disabledTemplateButton}>
              <Tooltip label="Save as Template">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={modalSaveTemplateHandlers.open}
                  disabled={isMessageEmpty()}
                >
                  <Icon icon="tabler:device-floppy" fontSize={18} />
                </ActionIcon>
              </Tooltip>
            </When>
          </Group>
          <When condition={!disabledTemplateButton}>
            <Popover width={300} position="top-end" withArrow shadow="md">
              <Popover.Target>
                <Tooltip label="Load template" position="top">
                  <Button size={'compact-sm'} variant="outline">
                    <Icon icon={'tabler:template'} fontSize={26} />
                  </Button>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack>
                  <Select
                    label={
                      <Group justify="space-between" w={270}>
                        <Text>Use a template</Text>
                        <Tooltip label="Manage Templates">
                          <ActionIcon
                            variant="transparent"
                            onClick={modalManageTemplate.toggle}
                          >
                            <Icon icon={'tabler:settings'} fontSize={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    }
                    searchable
                    placeholder="Select a template to use"
                    data={labelValueTemplates}
                    onChange={(value) => handleSelectTemplate(value!)}
                    comboboxProps={{ withinPortal: false }}
                  />
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </When>
        </Group>
      </Stack>

      {!isSpintaxTipDismissed && (
        <Alert
          icon={<Icon icon="tabler:info-circle" />}
          title="Pro Tip"
          color="teal"
          withCloseButton
          onClose={() => setIsSpintaxTipDismissed(true)}
          mt="xs"
          mb="sm"
          radius="md"
        >
          Use Spintax format like `{'{Hi|Hello|Hola}'}` to create message
          variations. This helps reduce the risk of being blocked.
        </Alert>
      )}
      {renderMenuMessage()}
      {renderInputMessage()}

      <ModalManageTemplate
        opened={showModalManageTemplate}
        onClose={modalManageTemplate.close}
      />

      {/* ADDED: The modal for saving the current message as a new template. */}
      <ModalCreateUpdateTemplate
        opened={showModalSaveTemplate}
        onClose={modalSaveTemplateHandlers.close}
        initialData={form.values}
      />
    </>
  )
}

export default InputMessage
