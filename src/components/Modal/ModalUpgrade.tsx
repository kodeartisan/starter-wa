import Modal from '@/components/Modal/Modal'
import plans from '@/config/plans'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import _ from 'lodash'
import React from 'react'
import { When } from 'react-if'

interface Props {
  opened: boolean
  onClose: () => void
}

const defaultValues = {
  license: '',
}

const ModalUpgrade: React.FC<Props> = ({ opened, onClose }: Props) => {
  const form = useForm({
    initialValues: defaultValues,
  })

  const handleOnClose = () => {
    form.reset()
    onClose()
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
                    <Title order={2}>{plan.name}</Title>
                    <Text fw={500}>{plan.description}</Text>
                  </Stack>
                </Group>
                <Group gap={0} align={'flex-end'}>
                  <When condition={plan.placeholderPrice}>
                    <Title
                      order={3}
                      c={'dimmed'}
                      style={{
                        textDecorationLine: 'line-through',
                      }}
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
                Free
              </Button>
            ) : (
              <Button
                size="sm"
                component="a"
                href={plan.link}
                target="_blank"
                mt={'lg'}
              >
                Upgrade now
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
      w={1000}
      p={'md'}
      withCloseButton
    >
      <Stack py={'xl'}>
        <Stack justify="center" align="center">
          <Stack justify="center" align="center" gap={4} mb={30}>
            <Title order={2}>Pricing & Plans</Title>
            <Text fw={500} size="md">
              Select the right plan for you business. Upgrade or downgrade at
              any time.
            </Text>
          </Stack>
          {renderPlans()}
        </Stack>
      </Stack>
    </Modal>
  )
}

export default ModalUpgrade
