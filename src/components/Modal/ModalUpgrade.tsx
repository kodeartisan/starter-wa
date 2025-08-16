// src/components/Modal/ModalUpgrade.tsx
import Modal from '@/components/Modal/Modal'
import plans from '@/config/plans'
import { showModalActivation } from '@/utils/util'
// ADDED: Import hooks for state and side effects.
import { Icon } from '@iconify/react'
import {
  Anchor,
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import _ from 'lodash'
// ADDED: Import useEffect and useState for the timer.
import React, { useEffect, useState } from 'react'
import { When } from 'react-if'

interface Props {
  opened: boolean
  onClose: () => void
}

// ADDED: A type for the time left.
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

  // ADDED: State to manage the countdown timer.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  // ADDED: useEffect to manage the countdown logic.
  useEffect(() => {
    if (!opened) return

    const getOfferEndTime = (): number => {
      const storedEndTime = localStorage.getItem('offerEndTime')
      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10)
        // If the stored time is in the past, create a new one.
        if (endTime > Date.now()) {
          return endTime
        }
      }
      // Set a new 24-hour offer window.
      const newEndTime = Date.now() + 24 * 60 * 60 * 1000
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
        localStorage.removeItem('offerEndTime') // Clear expired timer
        setTimeLeft(null)
      }
    }, 1000)

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Cleanup interval on component unmount or when modal closes.
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
      <Group>
        {plans.map((plan, index) => (
          <Card key={index} withBorder w={370} radius={'md'} p="lg">
            <Card.Section withBorder px={'lg'} py={'md'}>
              <Stack justify="space-between" gap={2}>
                <Group justify="space-between">
                  <Stack gap={0}>
                    <When condition={!plan.isFree}>
                      <Group gap="xs">
                        <Title order={2}>{plan.name}</Title>
                        <ThemeIcon variant="light" color="yellow" radius="sm">
                          <Icon icon="tabler:star" />
                        </ThemeIcon>
                        <Text fw={600} c="yellow.8" size="sm">
                          User's Choice
                        </Text>
                      </Group>
                    </When>
                    <When condition={plan.isFree}>
                      <Title order={2}>{plan.name}</Title>
                    </When>
                    <Text fw={500}>{plan.description}</Text>
                  </Stack>
                </Group>
                <Group gap={0} align={'flex-end'}>
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
            <Stack gap={10} pt={'md'}>
              {plan.features.map((feature, index) => (
                <Text key={`${index}`}>{feature}</Text>
              ))}
            </Stack>
            {plan.isFree ? (
              <Button size="sm" mt={'lg'}>
                {' '}
                Continue with Basic{' '}
              </Button>
            ) : (
              <Button
                size="sm"
                component="a"
                href={plan.link}
                target="_blank"
                mt={'lg'}
              >
                {' '}
                Upgrade now{' '}
              </Button>
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
            <Title order={2}>Pricing & Plans</Title>
            <Text fw={500} size="md">
              {' '}
              Select the right plan for you business. Upgrade or downgrade at
              any time.{' '}
            </Text>

            {timeLeft && (
              <Group
                gap="xs"
                mt="sm"
                p="xs"
                style={{
                  backgroundColor: 'var(--mantine-color-red-0)',
                  borderRadius: 'var(--mantine-radius-md)',
                }}
              >
                <Icon
                  icon="tabler:clock-hour-4"
                  color="var(--mantine-color-red-7)"
                />
                <Text c="red.7" size="sm" fw={600}>
                  Limited Time Offer! Special price ends in:{' '}
                  {timeLeft &&
                    `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
                </Text>
              </Group>
            )}
            <Text c="dimmed" size="sm" mt="xs">
              {' '}
              Join 1,000+ users who have secured their chat history.{' '}
            </Text>
          </Stack>
          {renderPlans()}
          <Group justify="center">
            <Text size="sm">Already have a license key?</Text>
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={handleActivateClick}
            >
              <Text fw={500} size="sm">
                {' '}
                Activate it here{' '}
              </Text>
            </Anchor>
          </Group>
        </Stack>
      </Stack>
    </Modal>
  )
}

export default ModalUpgrade
