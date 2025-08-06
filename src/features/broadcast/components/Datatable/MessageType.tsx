// src/features/broadcast/components/Datatable/MessageType.tsx
import { Message } from '@/constants'
import { Icon } from '@iconify/react'
import { Group, Text } from '@mantine/core'
import _ from 'lodash'
import React from 'react'

interface Props {
  type: string
}

const MessageType: React.FC<Props> = ({ type }: Props) => {
  const icons = {
    [Message.TEXT]: 'tabler:text-size',
    [Message.IMAGE]: 'tabler:photo',
    [Message.VIDEO]: 'tabler:video',
    [Message.FILE]: 'tabler:file-text',
    [Message.MEDIA]: 'tabler:library-photo',
    [Message.BUTTON]: 'tabler:hand-finger',
    [Message.LIST]: 'tabler:list',
    [Message.LOCATION]: 'tabler:map-pin',
    [Message.POLL]: 'tabler:list-details',
    [Message.VCARD]: 'tabler:user-square',
  }
  const icon = icons[type] ?? 'tabler:text-size'
  return (
    <Group gap={4}>
      <Icon icon={icon} fontSize={18} />
    </Group>
  )
}

export default MessageType
