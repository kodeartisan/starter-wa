// src/features/broadcast/components/Modal/ModalDuplicateWarning.tsx
import Modal from '@/components/Modal/Modal'
import { Icon } from '@iconify/react'
import {
  Button,
  Group,
  rem,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}

/**
 * @component ModalDuplicateWarning
 * @description A modal that warns users when they attempt to send a broadcast
 * with content identical to the previous one, encouraging message variation.
 */
const ModalDuplicateWarning: React.FC<Props> = ({
  opened,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} w={500} p="xl" withCloseButton>
      <Stack gap="lg" align="center">
        <ThemeIcon variant="light" color="orange" size={rem(60)} radius="xl">
          <Icon icon="tabler:alert-triangle" fontSize={rem(32)} />
        </ThemeIcon>

        <Title order={3} ta="center">
          Potential Duplicate Content
        </Title>

        <Text size="sm" ta="center">
          This message appears to be identical to your last broadcast. We
          strongly recommend using Spintax or varying the content to avoid being
          blocked.
        </Text>

        <Group justify="center" mt="md" w="100%">
          <Button variant="outline" onClick={onClose}>
            Edit Message
          </Button>
          <Button onClick={onConfirm} color="orange">
            Send Anyway
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalDuplicateWarning
