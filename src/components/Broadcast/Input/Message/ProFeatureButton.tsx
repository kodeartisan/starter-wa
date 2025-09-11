import useLicense from '@/hooks/useLicense'
import { Icon } from '@iconify/react'
import { Badge, Button, Tooltip } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import { When } from 'react-if'

const ProFeatureButton = ({
  form,
  label,
  icon,
  messageType,
}: {
  form: UseFormReturnType<any>
  label: string
  icon: string
  messageType: string
}) => {
  const license = useLicense()
  return (
    <Tooltip label={label} position="top">
      <Button
        size="sm"
        variant={form.values.type === messageType ? 'filled' : 'default'}
        onClick={() => {
          form.setFieldValue('type', messageType)
        }}
        rightSection={
          <When condition={license.isFree()}>
            <Badge size="xs" variant="light" color="teal" radius="sm">
              PRO
            </Badge>
          </When>
        }
      >
        <Icon icon={icon} fontSize={24} />
      </Button>
    </Tooltip>
  )
}

export default ProFeatureButton
