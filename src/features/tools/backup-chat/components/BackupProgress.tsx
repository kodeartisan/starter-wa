// src/features/tools/chat-backup/components/BackupProgress.tsx
import { Button, Center, Group, Progress, Stack, Text } from '@mantine/core'
import React from 'react'

interface Props {
  progress: {
    value: number
    label: string
  }
  onCancel: () => void
}

const BackupProgress: React.FC<Props> = ({ progress, onCancel }) => {
  return (
    <Center h={250}>
      <Stack w="100%" align="center">
        <Text size="lg" fw={500}>
          Backup in Progress...
        </Text>
        <Progress value={progress.value} animated size="lg" w="100%" />
        <Text c="dimmed" size="sm">
          {progress.label}
        </Text>
        <Button mt="lg" variant="outline" color="red" onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </Center>
  )
}

export default BackupProgress
