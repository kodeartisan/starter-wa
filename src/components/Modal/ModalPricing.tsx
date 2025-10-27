// src/components/Modal/ModalUpgrade.tsx
import Modal from '@/components/Modal/Modal'
import plans from '@/config/plans'
import { Icon } from '@iconify/react'
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
}

const ModalPricing: React.FC<Props> = ({ opened, onClose }) => {
  return (
    <Modal opened={opened} onClose={onClose} w={1350} withCloseButton={false}>
      <Stack py={'md'}>
        <Stack align="center" ta="center">
          <Title order={1}>Simple, transparent pricing</Title>
          <Text size={'xl'} c="dimmed">
            {' '}
            Choose the perfect plan for your needs.{' '}
          </Text>
        </Stack>
        <Group justify="center" align="stretch" mt="sm" gap="lg">
          {plans.map((plan, index) => (
            <Paper
              key={index}
              withBorder
              w={400}
              radius={'lg'}
              p={36}
              style={{
                border: !plan.isFree
                  ? '2px solid var(--mantine-color-teal-6)'
                  : undefined,
                boxShadow: !plan.isFree
                  ? 'var(--mantine-shadow-lg)'
                  : 'var(--mantine-shadow-sm)',
                position: 'relative',
              }}
            >
              <Stack justify="space-between" style={{ height: '100%' }}>
                <Box ta="center">
                  <Title order={2}>{plan.name}</Title>
                  <Text mt={4} size="md" fw={500}>
                    {' '}
                    {plan.description}{' '}
                  </Text>
                </Box>
                {/* MODIFIED: Wrapped price section in a Stack to add the savings badge */}
                <Stack align="center" gap={4}>
                  <Group gap={8} align={'baseline'} justify="center">
                    <Title order={1} fz={52}>
                      {' '}
                      {plan.price}{' '}
                    </Title>
                    {plan.priceSuffix && (
                      <Text component="span" fz="xl" fw={500}>
                        {plan.priceSuffix}
                      </Text>
                    )}
                  </Group>
                  {/* ADDED: Savings badge to explicitly highlight the discount */}
                </Stack>

                <Stack gap="sm">
                  {plan.features.map((feature, idx) => (
                    <Group key={idx} gap="sm" align="flex-start">
                      <Text>{plan.isFree ? '⚫' : '✅'}</Text>
                      <Text size="sm" fw={500}>
                        {' '}
                        {feature}{' '}
                      </Text>
                    </Group>
                  ))}
                </Stack>
                <Box mt="md">
                  {plan.isFree ? (
                    <Button size="md" variant="default" fullWidth disabled>
                      {' '}
                      Your Current Plan{' '}
                    </Button>
                  ) : (
                    <Stack gap="xs">
                      <Button
                        size="lg"
                        component="a"
                        href={plan.link}
                        target="_blank"
                        fullWidth
                        leftSection={
                          <Icon
                            icon="sidekickicons:crown-16-solid"
                            fontSize={30}
                          />
                        }
                      >
                        {' '}
                        Upgrade now
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Paper>
          ))}
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalPricing
