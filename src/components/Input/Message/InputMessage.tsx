import { Media, Message } from '@/constants'
import ModalManageTemplate from '@/features/broadcast/components/Modal/ModalManageTemplate'
import useLicense from '@/hooks/useLicense'
import db, { type BroadcastTemplate } from '@/libs/db'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
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
import { useLiveQuery } from 'dexie-react-hooks'
import React, { useMemo } from 'react'
import { When } from 'react-if'
import FormDocument from './FormFile'
import FormImage from './FormImage'
import FormLocation from './FormLocation'
import FormPoll from './FormPoll'
import FormText from './FormText'
import FormVCard from './FormVCard' // Import new VCard form
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
        return <FormText form={form} />
      case Message.IMAGE:
        return <FormImage form={form} />
      case Message.VIDEO:
        return <FormVideo form={form} />
      case Message.FILE:
        return <FormDocument form={form} />
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
      <SimpleGrid cols={7}>
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
        <ProFeatureButton
          form={form}
          label="Poll"
          icon="tabler:list-details"
          messageType={Message.POLL}
        />
        {/* ++ ADDED: The new button for sending a contact VCard */}
        <ProFeatureButton
          form={form}
          label="Contact (VCard)"
          icon="tabler:user-square"
          messageType={Message.VCARD}
        />
      </SimpleGrid>
    )
  }
  return (
    <>
      <Stack>
        <Group justify="space-between">
          <Text fw={500}>Message</Text>
          <When condition={!disabledTemplateButton}>
            <Popover width={300} position="top-end" withArrow shadow="md">
              <Popover.Target>
                <Tooltip label="Get template" position="top">
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
      {renderMenuMessage()}
      {renderInputMessage()}
      <ModalManageTemplate
        opened={showModalManageTemplate}
        onClose={modalManageTemplate.close}
      />
    </>
  )
}
export default InputMessage
