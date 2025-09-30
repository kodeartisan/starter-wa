// src/features/broadcast/components/Modal/ModalConfirmLoad.tsx
import Modal from '@/components/Modal/Modal'
import { Icon } from '@iconify/react'
import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onConfirm: (mode: 'merge' | 'replace') => void
  listName: string
  recipientCount: number
}

/**
 * @component ModalConfirmLoad
 * @description A modal asking the user whether to merge or replace the current recipient list
 * with a newly loaded one.
 */
const ModalConfirmLoad: React.FC<Props> = ({
  opened,
  onClose,
  onConfirm,
  listName,
  recipientCount,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} withCloseButton w={500}>
      <Stack p="md">
        <Center>
          <Stack align="center" gap="xs">
            <ThemeIcon color="blue" size={50} radius="xl">
              <Icon icon="tabler:database-import" fontSize={28} />
            </ThemeIcon>
            <Title order={4}>Load Recipient List</Title>
            <Text c="dimmed" size="sm" ta="center">
              You are about to load <b>{recipientCount} recipients</b> from the
              list "<b>{listName}</b>".
            </Text>
            <Text size="sm" ta="center" mt="sm">
              How would you like to add them?
            </Text>
          </Stack>
        </Center>
        <Group justify="center" mt="lg" grow>
          <Button
            variant="outline"
            leftSection={<Icon icon="tabler:plus" />}
            onClick={() => onConfirm('merge')}
          >
            Merge
          </Button>
          <Button
            color="orange"
            leftSection={<Icon icon="tabler:replace" />}
            onClick={() => onConfirm('replace')}
          >
            Replace
          </Button>
        </Group>
        <Group justify="center" mt="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalConfirmLoad
