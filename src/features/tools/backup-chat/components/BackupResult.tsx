// src/features/tools/backup-chat/components/BackupResult.tsx
import { goToLandingPage, showModalUpgrade } from '@/utils/util'
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
          {/* MODIFIED: The entire warning card has been updated for better psychological impact. */}
          <Card
            withBorder
            p="lg"
            shadow="none"
            radius="md"
            mt="md"
            style={{
              width: '100%',
              borderColor: 'var(--mantine-color-orange-4)',
              backgroundColor: 'var(--mantine-color-orange-0)',
            }}
          >
            <Stack align="center" gap="sm">
              <Group gap="xs">
                <Icon
                  icon="tabler:alert-triangle"
                  color="var(--mantine-color-orange-7)"
                  fontSize={24}
                />
                {/* MODIFIED: Changed title to be more alarming and personal. */}
                <Title order={5} c="orange.9">
                  Warning: Some Memories Are At Risk!
                </Title>
              </Group>
              {/* MODIFIED: Changed text to emphasize the risk of permanent data loss. */}
              <Text ta="center" size="sm" c="dimmed">
                <b>{messagesOmitted.toLocaleString()} messages</b> and{' '}
                <b>{mediaOmitted.toLocaleString()} media files</b> were NOT
                SAVED and could be lost forever. Upgrade now to protect all your
                data.
              </Text>
              <Button
                mt="sm"
                color="teal"
                onClick={goToLandingPage}
                leftSection={<Icon icon="tabler:crown" fontSize={18} />}
              >
                Upgrade to Protect Everything
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
