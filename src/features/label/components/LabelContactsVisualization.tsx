// src/features/label/components/LabelContactsVisualization.tsx
import useWa from '@/hooks/useWa'
import { Avatar, Group, Text, Tooltip } from '@mantine/core'
import React, { useEffect, useState } from 'react'

interface Props {
  contactIds: string[]
}

const MAX_AVATARS = 4

const LabelContactsVisualization: React.FC<Props> = ({ contactIds }) => {
  const wa = useWa()
  const [avatars, setAvatars] = useState<string[]>([])
  const totalContacts = contactIds.length

  useEffect(() => {
    if (!wa.isReady || totalContacts === 0) {
      setAvatars([])
      return
    }

    const fetchAvatars = async () => {
      const idsToFetch = contactIds.slice(0, MAX_AVATARS)
      try {
        const urls = await Promise.all(
          idsToFetch.map((id) => wa.contact.getProfilePictureUrl(id)),
        )
        setAvatars(urls.filter(Boolean))
      } catch (error) {
        console.error('Failed to fetch contact avatars:', error)
        setAvatars([])
      }
    }

    fetchAvatars()
  }, [contactIds, wa.isReady, wa.contact])

  if (totalContacts === 0) {
    return <Text size="sm">0</Text>
  }

  return (
    <Group gap="xs" wrap="nowrap">
      <Tooltip
        label={`${totalContacts} contact${totalContacts > 1 ? 's' : ''}`}
      >
        <Avatar.Group spacing="sm">
          {avatars.map((url, index) => (
            <Avatar key={index} src={url} radius="xl" size="sm" />
          ))}
          {totalContacts > MAX_AVATARS && (
            <Avatar radius="xl" size="sm">
              +{totalContacts - MAX_AVATARS}
            </Avatar>
          )}
        </Avatar.Group>
      </Tooltip>
      <Text size="sm">{totalContacts}</Text>
    </Group>
  )
}

export default React.memo(LabelContactsVisualization)
