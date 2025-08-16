// src/components/Modal/ModalUpgrade.tsx
import Modal from '@/components/Modal/Modal'
import plans from '@/config/plans'
import { showModalActivation } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { When } from 'react-if'

interface Props {
  opened: boolean
  onClose: () => void
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

const defaultValues = {
  license: '',
}

const ModalUpgrade: React.FC<Props> = ({ opened, onClose }: Props) => {
  const form = useForm({
    initialValues: defaultValues,
  })

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (!opened) return

    const getOfferEndTime = (): number => {
      const storedEndTime = localStorage.getItem('offerEndTime')
      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10)
        if (endTime > Date.now()) {
          return endTime
        }
      }
      // Set a new 24-hour timer if none exists or the old one has expired.
      const newEndTime = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      localStorage.setItem('offerEndTime', newEndTime.toString())
      return newEndTime
    }

    const offerEndTime = getOfferEndTime()
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = offerEndTime - Date.now()
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
      return null
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft)
      } else {
        clearInterval(timer)
        localStorage.removeItem('offerEndTime')
        setTimeLeft(null)
      }
    }, 1000)

    setTimeLeft(calculateTimeLeft())
    return () => clearInterval(timer)
  }, [opened])

  const handleOnClose = () => {
    form.reset()
    onClose()
  }

  const handleActivateClick = () => {
    showModalActivation()
  }

  const renderPlans = () => {
    return (
      <Group justify="center" align="stretch">
        {plans.map((plan, index) => (
          <Card
            key={index}
            withBorder
            w={370}
            radius={'md'}
            p="lg"
            // MODIFIED: Add a visual highlight to the Pro plan card.
            style={{
              border: !plan.isFree
                ? '2px solid var(--mantine-color-teal-6)'
                : undefined,
            }}
          >
            <Card.Section withBorder px={'lg'} py={'md'}>
              <Stack justify="space-between" gap={2}>
                <Group justify="space-between">
                  <Stack gap={0}>
                    <When condition={!plan.isFree}>
                      <Group gap="xs">
                        <Title order={2}>{plan.name}</Title>
                        {/* MODIFIED: Add a "Most Popular" badge to guide user choice. */}
                        <Badge color="yellow" variant="light">
                          Most Popular
                        </Badge>
                      </Group>
                    </When>
                    <When condition={plan.isFree}>
                      <Title order={2}>{plan.name}</Title>
                    </When>
                    <Text fw={500}>{plan.description}</Text>
                  </Stack>
                </Group>
                <Group gap={4} align={'flex-end'}>
                  {/* MODIFIED: Emphasize the discounted price by making the original price more prominent. */}
                  <When condition={plan.placeholderPrice}>
                    <Title
                      order={3}
                      c={'dimmed'}
                      style={{ textDecorationLine: 'line-through' }}
                      mb={3}
                    >
                      {plan.placeholderPrice}
                    </Title>
                  </When>
                  <Title>{plan.isFree ? 'Free' : plan.price}</Title>
                </Group>
              </Stack>
            </Card.Section>

            {/* MODIFIED: Implement clearer feature comparison using green check and red cross icons. */}
            <Stack gap={10} pt={'md'}>
              {plan.features.map((feature, idx) => {
                const isAvailable = plan.isFree ? !feature.isProFeature : true
                return (
                  <Group key={idx} gap="sm" wrap="nowrap" align="flex-start">
                    <Icon
                      icon={
                        isAvailable ? 'tabler:circle-check' : 'tabler:circle-x'
                      }
                      color={
                        isAvailable
                          ? 'var(--mantine-color-teal-6)'
                          : 'var(--mantine-color-red-6)'
                      }
                      fontSize={20}
                      style={{ marginTop: 2 }}
                    />
                    <Text
                      size="sm"
                      c={isAvailable ? 'default' : 'dimmed'}
                      style={{
                        textDecoration:
                          plan.isFree && feature.isProFeature
                            ? 'line-through'
                            : 'none',
                      }}
                    >
                      {feature.text}
                    </Text>
                  </Group>
                )
              })}
            </Stack>

            {plan.isFree ? (
              <Button
                size="sm"
                mt={'lg'}
                variant="outline"
                onClick={handleOnClose}
              >
                Continue with Basic
              </Button>
            ) : (
              <Stack mt="lg" gap="xs">
                <Button
                  size="sm"
                  component="a"
                  href={plan.link}
                  target="_blank"
                  fullWidth
                >
                  Upgrade now
                </Button>
                {/* ADDED: Trust-building microcopy for the payment button. */}
                <Group justify="center" gap={4}>
                  <Icon
                    icon="tabler:lock"
                    fontSize={14}
                    color="var(--mantine-color-gray-6)"
                  />
                  <Text size="xs" c="dimmed">
                    Secure Transaction via Lemon Squeezy.
                  </Text>
                </Group>
              </Stack>
            )}
          </Card>
        ))}
      </Group>
    )
  }

  return (
    <Modal
      opened={opened}
      onClose={handleOnClose}
      w={900}
      p={'md'}
      withCloseButton
    >
      <Stack>
        <Stack justify="center" align="center">
          <Stack justify="center" align="center" gap={4} mb={30}>
            <Title order={2}>Your Memories Are Priceless</Title>
            <Text fw={500} size="md">
              Choose the right plan to protect your chat history forever.
            </Text>

            {/* MODIFIED: Make the limited time offer more prominent and visually appealing. */}
            {timeLeft && (
              <Group
                gap="xs"
                mt="sm"
                p="xs"
                style={{
                  backgroundColor: 'var(--mantine-color-red-0)',
                  borderRadius: 'var(--mantine-radius-md)',
                  border: '1px solid var(--mantine-color-red-2)',
                }}
              >
                <Icon
                  icon="tabler:clock-hour-4"
                  color="var(--mantine-color-red-7)"
                />
                <Text c="red.7" size="sm" fw={600}>
                  Limited Time Offer! Special price ends in:{' '}
                  {`${String(timeLeft.hours).padStart(2, '0')}:${String(
                    timeLeft.minutes,
                  ).padStart(2, '0')}:${String(timeLeft.seconds).padStart(
                    2,
                    '0',
                  )}`}
                </Text>
              </Group>
            )}

            {/* MODIFIED: Enhanced social proof with a more prominent counter and a redesigned testimonial. */}
            <Paper withBorder p="xs" shadow="none" radius="md" mt="md" w="100%">
              <Group justify="center" align="center" gap="xl">
                <Stack align="center" gap={0}>
                  <Text size="sm">
                    Join <b>1,257+ users</b> who have secured their chats.
                  </Text>
                </Stack>
                <Group gap="xs">
                  <ThemeIcon variant="transparent" size="lg">
                    <Icon icon="tabler:user-circle" fontSize={24} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="xs">
                      "The backup feature saved my chat history!"
                    </Text>
                    <Text size="xs" ta="right">
                      - Pro User
                    </Text>
                  </Stack>
                </Group>
              </Group>
            </Paper>
          </Stack>

          {renderPlans()}

          <Group justify="center" mt="md">
            <Text size="sm">Already have a license key?</Text>
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={handleActivateClick}
            >
              <Text fw={500} size="sm">
                Activate it here
              </Text>
            </Anchor>
          </Group>
        </Stack>
      </Stack>
    </Modal>
  )
}

export default ModalUpgrade
