// src/features/broadcast/components/Input/InputTyping.tsx
import useLicense from '@/hooks/useLicense'
import { Icon } from '@iconify/react'
import { Badge, Group, Switch, Text, Tooltip } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import { When } from 'react-if'

interface Props {
  form: UseFormReturnType<any>
}

const InputTyping: React.FC<Props> = ({ form }: Props) => {
  const license = useLicense()
  return (
    <Switch
      label={
        <Group gap={4} wrap="nowrap">
          <Text fw={500}>Typing effect</Text>
          <Tooltip
            label='Show "Typing..." status to the recipient to mimic human behavior and reduce the risk of being flagged.'
            position="top-start"
            multiline
            w={300}
            withArrow
          >
            <Icon icon="tabler:info-circle" style={{ display: 'block' }} />
          </Tooltip>
        </Group>
      }
      {...form.getInputProps('isTyping', { type: 'checkbox' })}
    />
  )
}

export default InputTyping
