// src/features/broadcast/components/Modal/ModalSourceMyContacts.tsx
import Modal from '@/components/Modal/Modal'
import wa from '@/libs/wa'
import { getContactName } from '@/utils/util'
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
// ++ ADDED: Import useDebouncedValue hook
import { useDebouncedValue } from '@mantine/hooks'
import React, { useEffect, useMemo, useState } from 'react'
import { When } from 'react-if'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (recipients: any[]) => void
}

/**
 * @component ModalSourceMyContacts
 * @description A modal for fetching, displaying, and selecting from a user's saved contact list.
 * It is optimized to fetch data only when opened and uses memoization for efficient searching.
 */
const ModalSourceMyContacts: React.FC<Props> = ({
  opened,
  onClose,
  onSubmit,
}) => {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  // ++ ADDED: Debounce the search input value to avoid excessive re-renders during typing.
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)

  // Fetch contacts only when the modal is opened to improve performance.
  useEffect(() => {
    if (opened) {
      const fetchContacts = async () => {
        setLoading(true)
        try {
          const contactList = await wa.contact.list({ onlyMyContacts: true })
          // Sort the contact list by name in ascending order.
          const sortedContacts = [...contactList].sort((a, b) =>
            getContactName(a).localeCompare(getContactName(b)),
          )
          setContacts(sortedContacts)
        } catch (error) {
          console.error('Failed to fetch contacts:', error)
          setContacts([]) // Ensure contacts is an array on error
        } finally {
          setLoading(false)
        }
      }
      fetchContacts()
    } else {
      // Reset state when the modal is closed to ensure fresh data next time.
      setContacts([])
      setSelectedContacts([])
      setSearchQuery('')
    }
  }, [opened])

  // -- MODIFIED: Memoize the filtered contacts to prevent re-calculation on every render, using the debounced value.
  const filteredContacts = useMemo(() => {
    if (!debouncedSearchQuery) return contacts
    const lowerCaseQuery = debouncedSearchQuery.toLowerCase()
    return contacts.filter(
      (c) =>
        getContactName(c).toLowerCase().includes(lowerCaseQuery) ||
        c.phoneNumber?.includes(lowerCaseQuery),
    )
  }, [contacts, debouncedSearchQuery])

  // ++ ADDED: Determines if all currently filtered contacts are selected.
  const allFilteredSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((contact) => selectedContacts.includes(contact.id))

  // ++ ADDED: Toggles the selection of all contacts visible in the filtered list.
  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      // If all are selected, deselect only the filtered ones from the state
      const filteredContactIds = new Set(filteredContacts.map((c) => c.id))
      setSelectedContacts((prev) =>
        prev.filter((id) => !filteredContactIds.has(id)),
      )
    } else {
      // Otherwise, add all filtered contacts to the selection, avoiding duplicates
      const filteredContactIds = filteredContacts.map((c) => c.id)
      setSelectedContacts((prev) => [
        ...new Set([...prev, ...filteredContactIds]),
      ])
    }
  }

  // Handles toggling the selection of a single contact.
  const handleToggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId],
    )
  }

  // Resets component state and calls the parent's onClose handler.
  const handleClose = () => {
    onClose()
  }

  // Submits the selected contacts to the parent component.
  const handleSubmit = () => {
    const finalRecipients = contacts
      .filter((c) => selectedContacts.includes(c.id))
      .map((contact) => ({
        number: contact.number,
        name: getContactName(contact),
      }))
    onSubmit(finalRecipients)
    handleClose()
  }

  return (
    <Modal opened={opened} onClose={handleClose} withCloseButton w={500}>
      <Stack>
        <Center>
          <Title order={4}>Add Recipients from My Contacts</Title>
        </Center>
        <TextInput
          placeholder="Search contacts by name or number..."
          leftSection={<Icon icon="tabler:search" fontSize={16} />}
          value={searchQuery}
          size="sm"
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          disabled={loading || contacts.length === 0}
        />

        <When condition={loading}>
          <Center h={300}>
            <Loader />
            <Text ml="md">Loading your contacts...</Text>
          </Center>
        </When>

        <When condition={!loading && contacts.length > 0}>
          {/* ++ ADDED: "Select All" checkbox for contacts */}
          {filteredContacts.length > 0 && (
            <Checkbox
              label={allFilteredSelected ? 'Deselect All' : 'Select All'}
              checked={allFilteredSelected}
              onChange={handleToggleSelectAll}
            />
          )}
          <ScrollArea h={400}>
            {filteredContacts.length > 0 ? (
              <Stack>
                {filteredContacts.map((contact) => (
                  <Card
                    key={contact.id}
                    withBorder
                    p="xs"
                    radius="sm"
                    shadow="none"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleContact(contact.id)}
                  >
                    <Group wrap="nowrap">
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        readOnly
                        aria-label={`Select contact ${getContactName(contact)}`}
                      />
                      <Avatar src={contact.avatar} radius="xl" variant="filled">
                        {getContactName(contact).charAt(0).toUpperCase()}
                      </Avatar>
                      <Stack gap={0}>
                        <Text size="sm">{getContactName(contact)}</Text>
                        <Text size="xs" c="dimmed">
                          {contact.phoneNumber}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Center h={100}>
                <Text c="dimmed">No contacts match your search.</Text>
              </Center>
            )}
          </ScrollArea>
        </When>

        <When condition={!loading && contacts.length === 0}>
          <Center h={300}>
            <Text c="dimmed">No saved contacts found.</Text>
          </Center>
        </When>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedContacts.length === 0}
          >
            Add {selectedContacts.length} Contact(s)
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalSourceMyContacts
