// src/features/broadcast/components/Modal/ModalSourceGroups.tsx
import Modal from '@/components/Modal/Modal'
import { useAppStore } from '@/stores/app'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Button,
  Card,
  Center,
  Checkbox,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
// ++ ADDED: Import useDebouncedValue for search input debouncing
import { useDebouncedValue } from '@mantine/hooks'
import React, { useMemo, useState } from 'react'
import { When } from 'react-if'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (recipients: any[]) => void
}

/**
 * @component ModalSourceGroups
 * @description A modal component to select recipients from the user's WhatsApp groups.
 * It now includes a search functionality and displays group avatars for better identification.
 */
const ModalSourceGroups: React.FC<Props> = ({ opened, onClose, onSubmit }) => {
  const { groups } = useAppStore()
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  // ++ ADDED: Debounce the search query with a 300ms delay to improve performance.
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)

  // -- MODIFIED: This improves performance by re-computing the list only when groups or the debounced search query change.
  const filteredGroups = useMemo(() => {
    if (!groups) return []
    if (!debouncedSearchQuery) return groups
    const lowerCaseQuery = debouncedSearchQuery.toLowerCase()
    return groups.filter((group: any) =>
      group.name.toLowerCase().includes(lowerCaseQuery),
    )
  }, [groups, debouncedSearchQuery])

  // ++ ADDED: Check if all currently filtered groups are selected.
  const allFilteredSelected =
    filteredGroups.length > 0 &&
    filteredGroups.every((group) => selectedGroups.includes(group.id))

  // ++ ADDED: Handler to toggle selection for all filtered groups.
  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      // If all are selected, deselect only the filtered ones
      const filteredGroupIds = new Set(filteredGroups.map((g) => g.id))
      setSelectedGroups((prev) =>
        prev.filter((id) => !filteredGroupIds.has(id)),
      )
    } else {
      // If not all are selected, add all filtered ones to the selection
      const filteredGroupIds = filteredGroups.map((g) => g.id)
      setSelectedGroups((prev) => [...new Set([...prev, ...filteredGroupIds])])
    }
  }

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    )
  }

  const handleSubmit = () => {
    const finalRecipients =
      groups
        ?.filter((group: any) => selectedGroups.includes(group.id))
        .map((group: any) => ({
          number: group.id, // The group's ID (e.g., xxxxx@g.us)
          name: group.name, // The group's name
          source: 'Group', // The source identifier
        })) || []
    onSubmit(finalRecipients)
    handleClose()
  }

  const handleClose = () => {
    setSelectedGroups([])
    setSearchQuery('') // Reset search on close
    onClose()
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} withCloseButton w={500}>
        <Stack>
          <Center>
            <Title order={4}>Add Recipients from Groups</Title>
          </Center>
          <TextInput
            placeholder="Search groups by name..."
            leftSection={<Icon icon="tabler:search" fontSize={16} />}
            value={searchQuery}
            size="sm"
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            disabled={groups.length === 0}
          />

          <When condition={groups.length === 0}>
            <Center h={200}>
              <Loader />
              <Text ml="md">Loading groups...</Text>
            </Center>
          </When>

          <When condition={groups.length > 0}>
            {/* ++ ADDED: "Select All" checkbox appears when there are filterable groups. */}
            {filteredGroups.length > 0 && (
              <Checkbox
                label={allFilteredSelected ? 'Deselect All' : 'Select All'}
                checked={allFilteredSelected}
                onChange={handleToggleSelectAll}
              />
            )}
            <ScrollArea h={300}>
              {filteredGroups.length > 0 ? (
                <Stack>
                  {filteredGroups.map((group: any) => (
                    <Card
                      key={group.id}
                      withBorder
                      p="xs"
                      radius="sm"
                      shadow="none"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleToggleGroup(group.id)}
                    >
                      <Group wrap="nowrap">
                        <Checkbox
                          checked={selectedGroups.includes(group.id)}
                          readOnly
                          aria-label={`Select group ${group.name}`}
                        />
                        <Avatar src={group.avatar} radius="xl" variant="filled">
                          {group.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Text size="sm">{group.name}</Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Center h={100}>
                  <Text c="dimmed">No groups match your search.</Text>
                </Center>
              )}
            </ScrollArea>
          </When>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedGroups.length === 0}
            >
              Add {selectedGroups.length} Group(s)
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}

export default ModalSourceGroups
