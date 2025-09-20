import Modal from '@/components/Modal/Modal'
import { useAppStore } from '@/stores/app'
import { Icon } from '@iconify/react'
import {
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
 * It now includes a search functionality to filter groups by name.
 */
const ModalSourceGroups: React.FC<Props> = ({ opened, onClose, onSubmit }) => {
  const { groups } = useAppStore()
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  // ++ ADDED: State to hold the search query from the text input.
  const [searchQuery, setSearchQuery] = useState('')

  // ++ MODIFIED: The memoized value now filters groups based on the search query before mapping them.
  // This improves performance by re-computing the list only when groups or the search query change.
  const filteredAndFormattedGroups = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase()
    return (
      groups
        ?.filter((group: any) =>
          group.name.toLowerCase().includes(lowerCaseQuery),
        )
        .map((group: any) => ({
          label: `${group.name} (${group.participants.length} members)`,
          value: group.id,
        })) || []
    )
  }, [groups, searchQuery])

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
          <Text size="sm" c="dimmed" ta="center">
            Select the groups you want to broadcast to.
          </Text>

          {/* ++ ADDED: TextInput for search functionality. */}
          <TextInput
            placeholder="Search groups by name..."
            leftSection={<Icon icon="tabler:search" fontSize={16} />}
            value={searchQuery}
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
            <ScrollArea h={300}>
              {/* ++ MODIFIED: Conditional rendering based on search results. */}
              {filteredAndFormattedGroups.length > 0 ? (
                <Stack>
                  {filteredAndFormattedGroups.map((group) => (
                    <Card
                      key={group.value}
                      withBorder
                      p="xs"
                      radius="sm"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleToggleGroup(group.value)}
                    >
                      <Group>
                        <Checkbox
                          checked={selectedGroups.includes(group.value)}
                          readOnly
                          aria-label={`Select group ${group.label}`}
                        />
                        <Text>{group.label}</Text>
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
