// src/features/tools/backup-chat/components/BackupResult.tsx
import { showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import React from 'react'
import { When } from 'react-if'

interface Props {
  result: {
    messagesExported: number
    messagesOmitted: number
    mediaOmitted: number
    isLimitApplied: boolean
  }
  onDone: () => void
}

const BackupResult: React.FC<Props> = ({ result, onDone }) => {
  const { messagesExported, messagesOmitted, mediaOmitted, isLimitApplied } =
    result

  return (
    <Center>
      <Stack align="center" gap="lg">
        <ThemeIcon color="teal" size={80} radius="xl">
          <Icon icon="tabler:circle-check" fontSize={48} />
        </ThemeIcon>
        <Title order={3}>Backup Complete!</Title>
        <Text c="dimmed" size="sm" ta="center" maw={400}>
          Successfully exported {messagesExported} messages. You can find the
          file in your downloads folder.
        </Text>

        <When condition={isLimitApplied}>
          <Card
            withBorder
            p="lg"
            shadow="none"
            radius="md"
            mt="md"
            style={{ width: '100%' }}
          >
            <Stack align="center" gap="sm">
              <Group gap="xs">
                <Icon icon="tabler:lock" color="orange" fontSize={24} />
                <Title order={5}>Pro Features Locked</Title>
              </Group>
              <Text ta="center" size="sm" c="dimmed">
                Your backup is limited.{' '}
                <b>{messagesOmitted.toLocaleString()} messages</b> and{' '}
                <b>{mediaOmitted.toLocaleString()} media files</b> were not
                included.
              </Text>
              <Button
                mt="sm"
                color="teal"
                onClick={showModalUpgrade}
                leftSection={<Icon icon="tabler:crown" fontSize={18} />}
              >
                Upgrade to Pro to Get Everything
              </Button>
            </Stack>
          </Card>
        </When>

        <Button variant="outline" mt="xl" onClick={onDone}>
          Start Another Backup
        </Button>
      </Stack>
    </Center>
  )
}

export default BackupResult
