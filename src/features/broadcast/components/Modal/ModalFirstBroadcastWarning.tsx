import Modal from '@/components/Modal/Modal'
import { Icon } from '@iconify/react'
import {
  Button,
  Checkbox,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import React, { useState } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}

const ModalFirstBroadcastWarning: React.FC<Props> = ({
  opened,
  onClose,
  onConfirm,
}) => {
  const [acknowledged, setAcknowledged] = useState(false)

  const handleConfirm = () => {
    if (acknowledged) {
      onConfirm()
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} w={600} withCloseButton>
      <Stack p="md">
        <Title order={3} ta="center">
          Important: Please Read Before Broadcasting
        </Title>
        <Text c="dimmed" ta="center" size="sm" mb="md">
          Broadcasting on WhatsApp carries a risk of account blocking if not
          done carefully. To protect your account, please follow these best
          practices.
        </Text>

        <Stack gap="lg">
          <div>
            <Text fw={500}>Best Practices (Do's)</Text>
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="teal" size={20} radius="xl">
                  <Icon icon="tabler:check" fontSize={14} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Warm-Up Your Account:</b> Start by sending to a small number
                of contacts if your account is new or rarely used.
              </List.Item>
              <List.Item>
                <b>Use Personalization:</b> Utilize Spintax {'{Hi|Hello}'} and
                variables like {'{name}'} to make each message unique.
              </List.Item>
              <List.Item>
                <b>Prioritize Known Contacts:</b> Sending to contacts who have
                saved your number is significantly safer.
              </List.Item>
              <List.Item>
                <b>Provide an Opt-Out:</b> Include a message like "Reply STOP to
                unsubscribe" to reduce spam reports.
              </List.Item>
            </List>
          </div>

          <div>
            <Text fw={500}>Things to Avoid (Don'ts)</Text>
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="red" size={20} radius="xl">
                  <Icon icon="tabler:x" fontSize={14} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Don't Bulk-Send to Strangers:</b> This is the fastest way to
                get your account banned.
              </List.Item>
              <List.Item>
                <b>Don't Send Identical Messages:</b> Always use message
                variation.
              </List.Item>
            </List>
          </div>
        </Stack>

        <Checkbox
          mt="xl"
          checked={acknowledged}
          onChange={(event) => setAcknowledged(event.currentTarget.checked)}
          label="I understand the risks and will use this feature responsibly."
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!acknowledged}>
            Continue
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalFirstBroadcastWarning
