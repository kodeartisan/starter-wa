// src/components/Modal/ModalUpgrade.tsx
import Modal from '@/components/Modal/Modal'
import plans from '@/config/plans'
import { showModalActivation } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Anchor,
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
            <Title order={2}>Your Memories Are Priceless</Title>
            <Text fw={500} size="md">
              Choose the right plan to protect your chat history forever.
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
                    `${String(timeLeft.hours).padStart(2, '0')}:${String(
                      timeLeft.minutes,
                    ).padStart(2, '0')}:${String(timeLeft.seconds).padStart(
                      2,
                      '0',
                    )}`}
                </Text>
              </Group>
            )}
            {/* MODIFIED: Enhanced social proof with a more prominent counter and a testimonial. */}
            <Paper withBorder p="xs" shadow="none" radius="md" mt="md" w="100%">
              <Stack align="center" gap={4}>
                <Text c="dimmed" size="sm">
                  Join <b>1,000+ users</b> who have secured their chat history.
                </Text>
                <Text c="dimmed" size="xs">
                  "'The backup feature saved my chat history!' - Pro User"
                </Text>
              </Stack>
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
