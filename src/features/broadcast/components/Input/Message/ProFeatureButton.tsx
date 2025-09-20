import { Message } from '@/constants'
import useLicense from '@/hooks/useLicense'
import { showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import { Badge, Button, Tooltip } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import { When } from 'react-if'

const PRO_MESSAGE_TYPES = [
  Message.IMAGE,
  Message.VIDEO,
  Message.FILE,
  Message.LOCATION,
  Message.POLL,
]

interface ProFeatureInfo {
  name: string
  benefit: string
}

const featureNameMap: Record<string, ProFeatureInfo> = {
  [Message.IMAGE]: {
    name: 'Sending Images',
    benefit: 'Share photos and screenshots directly in your messages.',
  },
  [Message.VIDEO]: {
    name: 'Sending Videos',
    benefit: 'Send video files to your contacts.',
  },
  [Message.FILE]: {
    name: 'Sending Files',
    benefit: 'Attach documents, archives, and other files to your messages.',
  },
  [Message.LOCATION]: {
    name: 'Sending Locations',
    benefit: 'Share a map with a specific location.',
  },
  [Message.POLL]: {
    name: 'Creating Polls',
    benefit: 'Create polls to easily gather opinions from a contact.',
  },
  [Message.VCARD]: {
    name: 'Sending Contacts (VCard)',
    benefit: 'Share contact information quickly and easily.',
  },
}

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
          const featureInfo = featureNameMap[messageType]

          if (featureInfo && license.isFree()) {
            showModalUpgrade(featureInfo.name, featureInfo.benefit)
            return
          }
          form.setFieldValue('type', messageType)
        }}
      >
        <Icon icon={icon} fontSize={24} />
      </Button>
    </Tooltip>
  )
}

export default ProFeatureButton
