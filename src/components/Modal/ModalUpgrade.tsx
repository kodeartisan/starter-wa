// src/components/Modal/ModalUpgrade.tsx
import Modal from '@/components/Modal/Modal'
import { goToLandingPage } from '@/utils/util'
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
  featureName: string
  featureBenefit: string
}

/**
 * English: A modal to inform free users about a Pro feature they've tried to access.
 * It provides context about the feature's benefits and offers a clear path to upgrade.
 */
const ModalUpgrade: React.FC<Props> = ({
  opened,
  onClose,
  featureName,
  featureBenefit,
}) => {
  const handleUpgrade = () => {
    goToLandingPage()
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} w={500} p="xl" withCloseButton>
      <Stack gap="lg" align="center">
        <ThemeIcon
          variant="gradient"
          gradient={{ from: 'teal', to: 'lime' }}
          size={rem(60)}
          radius="xl"
        >
          <Icon icon="tabler:rocket" fontSize={rem(32)} />
        </ThemeIcon>
        <Title order={3} ta="center">
          Unlock: {featureName}
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          {featureBenefit}
        </Text>
        <Text size="sm" ta="center" fw={500}>
          Upgrade to Pro to unlock this feature and many more!
        </Text>
        {/* MODIFIED: Wrapped CTA button and added trust signals. */}
        <Stack align="center" gap="xs" mt="md" w="100%">
          <Group justify="center" style={{ width: '100%' }}>
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              leftSection={<Icon icon="tabler:crown" fontSize={20} />}
              variant="gradient"
              gradient={{ from: 'teal', to: 'lime' }}
            >
              Upgrade Now
            </Button>
          </Group>
          {/* English: Add trust signals below the CTA to increase user confidence. */}
          <Group justify="center" gap={6} mt="xs">
            <Icon
              icon="tabler:lock"
              fontSize={14}
              color="var(--mantine-color-gray-6)"
            />
            <Text size="xs" c="dimmed">
              Secure Payment & 30-Day Money-Back Guarantee
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Modal>
  )
}

export default ModalUpgrade
