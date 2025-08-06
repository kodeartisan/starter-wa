import Modal from '@/components/Modal/Modal'
import db, { type BroadcastRecipient } from '@/libs/db'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onLoad: (recipients: any[]) => void
}

const ModalLoadRecipientList: React.FC<Props> = ({
  opened,
  onClose,
  onLoad,
}) => {
  const recipientLists = useLiveQuery(
    () => db.broadcastRecipients.orderBy('createdAt').reverse().toArray(),
    [],
  )

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this list?')) {
      await db.broadcastRecipients.delete(id)
    }
  }

  const handleLoad = (list: BroadcastRecipient) => {
    onLoad(list.recipients)
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} w={700} withCloseButton>
      <Stack p="sm">
        <Center>
          <Title order={3}>Load Recipient List</Title>
        </Center>

        <ScrollArea h={450} mt="md">
          <Stack>
            {/* ++ ADDED: Show a loader while fetching data. */}
            {recipientLists === undefined && (
              <Center p="xl">
                <Loader />
              </Center>
            )}

            {recipientLists && recipientLists.length === 0 && (
              <Center h={150}>
                <Stack align="center" gap="sm">
                  <Icon icon="tabler:list-off" fontSize={48} color="gray" />
                  <Text c="dimmed">No saved recipient lists found.</Text>
                </Stack>
              </Center>
            )}

            {recipientLists?.map((list) => (
              <Card withBorder shadow="none" key={list.id} p="md" radius="md">
                <Group justify="space-between">
                  <Stack gap={2}>
                    <Text fw={500}>{list.name}</Text>
                    <Text size="sm" c="dimmed">
                      {list.recipients.length} recipients | Saved on{' '}
                      {dayjs(list.createdAt).format('DD MMM YYYY')}
                    </Text>
                  </Stack>
                  <Group gap="xs">
                    <Tooltip label="Delete List">
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => handleDelete(list.id)}
                      >
                        <Icon icon="tabler:trash" />
                      </ActionIcon>
                    </Tooltip>
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => handleLoad(list)}
                    >
                      Load
                    </Button>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Modal>
  )
}

export default ModalLoadRecipientList
