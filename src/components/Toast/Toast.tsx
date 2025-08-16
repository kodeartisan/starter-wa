import { type Toast } from '@/stores/toast'
import { Icon } from '@iconify/react'
import { ActionIcon, Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core'
import { useEffect } from 'react'
import classes from './Toast.module.css'

interface ToastProps extends Toast {
  onClose: () => void
}

const ToastComponent: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 2000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const toastConfig = {
    success: { icon: 'tabler:check', color: 'teal' },
    error: { icon: 'tabler:x', color: 'red' },
    info: { icon: 'tabler:info-circle', color: 'blue' },
    // ADDED: Configuration for the new 'warning' type.
    warning: { icon: 'tabler:alert-triangle', color: 'orange' },
  }

  const { icon, color } = toastConfig[type]

  return (
    <Paper
      shadow="lg"
      p="sm"
      radius="md"
      withBorder
      className={classes.toast}
      style={{ minWidth: 350, maxWidth: 400 }}
    >
      <Group align="flex-start" wrap="nowrap">
        <ThemeIcon color={color} size={36} radius="xl" mt={4}>
          <Icon icon={icon} fontSize={22} />
        </ThemeIcon>
        <Stack gap={2} style={{ flex: 1 }}>
          <Text fw={600} size="md">
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            {message}
          </Text>
        </Stack>
        <ActionIcon variant="transparent" color="gray" onClick={onClose}>
          <Icon icon="tabler:x" />
        </ActionIcon>
      </Group>
    </Paper>
  )
}

export default ToastComponent
