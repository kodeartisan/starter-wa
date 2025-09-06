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
    <Modal opened={opened} onClose={onClose} w={1200} withCloseButton={false}>
      <Stack py={'xl'}>
        <Stack align="center" ta="center">
          <Title order={1}>Simple, transparent pricing</Title>
          <Text size={'xl'} c="dimmed">
            Choose the perfect plan for your needs.
          </Text>
        </Stack>
        <Group justify="center" align="stretch" mt="sm" gap="lg">
          {plans.map((plan, index) => (
            <Paper
              key={index}
              withBorder
              radius={'lg'}
              px={50}
              py={36}
              style={{
                border:
                  plan.name === 'Per Day'
                    ? '2px solid var(--mantine-color-teal-6)'
                    : undefined,
                boxShadow:
                  plan.name === 'Per Day'
                    ? 'var(--mantine-shadow-lg)'
                    : 'var(--mantine-shadow-sm)',
                position: 'relative',
              }}
            >
              {plan.name === 'Per Day' && (
                <Badge
                  variant="gradient"
                  gradient={{ from: 'yellow', to: 'orange' }}
                  size="lg"
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  Most Popular
                </Badge>
              )}
              <Stack justify="space-between" style={{ height: '100%' }}>
                <Box ta="center">
                  <Title order={2}>{plan.name}</Title>
                  <Text mt={4} size="sm">
                    {' '}
                    {plan.description}{' '}
                  </Text>
                </Box>
                <Group gap={8} align={'baseline'} justify="center">
                  <Title order={1} fz={52}>
                    {' '}
                    {plan.price}{' '}
                  </Title>
                  {plan.priceSuffix && (
                    <Text component="span" c="dimmed" fz="xl" fw={500}>
                      {plan.priceSuffix}
                    </Text>
                  )}
                </Group>

                <Stack gap="sm">
                  {plan.features.map((feature, idx) => (
                    <Group key={idx} gap="sm" align="flex-start">
                      <ThemeIcon
                        variant="transparent"
                        color={plan.isFree ? 'gray' : 'teal'}
                        size="sm"
                        radius="xl"
                      >
                        {plan.isFree ? (
                          <Icon icon="tabler:circle-check" fontSize={16} />
                        ) : (
                          <Icon
                            icon="tabler:star-filled"
                            fontSize={16}
                            color="orange"
                          />
                        )}
                      </ThemeIcon>
                      <Text size="sm" fw={500}>
                        {feature}
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
                        leftSection={<Icon icon="tabler:crown" fontSize={20} />}
                        variant="gradient"
                        gradient={{ from: 'teal', to: 'lime' }}
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
