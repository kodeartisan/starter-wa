import useLicense from '@/hooks/useLicense'
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
    <Tooltip
      label='Show "Typing..." status on the recipient to mimic messaging process'
      refProp="rootRef"
      position="top-start"
    >
      <Switch
        label={
          <Group gap="xs">
            <Text fw={500}>Typing effect</Text>
          </Group>
        }
        {...form.getInputProps('isTyping', { type: 'checkbox' })}
      />
    </Tooltip>
  )
}

export default InputTyping
