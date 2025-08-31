// src/features/label/components/ModalManageContacts.tsx
import Modal from '@/components/Modal/Modal'
import useWa from '@/hooks/useWa'
import db, { type Label } from '@/libs/db'
import toast from '@/utils/toast'
import { getContactName } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  Checkbox,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
  opened: boolean
  label: Label | null
  onClose: () => void
}

interface ContactItem {
  id: string
  name: string
}

/**
 * A modal for managing which contacts are associated with a specific label.
 * It features a searchable list of all contacts.
 */
const ModalManageContacts: React.FC<Props> = ({ opened, label, onClose }) => {
  const wa = useWa()
  const [loading, setLoading] = useState(true)
  const [allContacts, setAllContacts] = useState<ContactItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(),
  )

  // Effect to fetch contacts and set initial state when the modal opens
  useEffect(() => {
    if (opened && label) {
      const fetchContacts = async () => {
        setLoading(true)
        try {
          const contactsFromWa = await wa.contact.list({ onlyMyContacts: true })
          const formattedContacts = contactsFromWa
            .map((c: any) => ({
              id: c.id,
              name: getContactName(c),
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

          setAllContacts(formattedContacts)
          setSelectedContactIds(new Set(label.numbers || []))
        } catch (error) {
          console.error('Failed to fetch contacts:', error)
          toast.error('Could not load your contacts.')
        } finally {
          setLoading(false)
        }
      }
      fetchContacts()
    } else {
      setAllContacts([])
      setSelectedContactIds(new Set())
      setSearchQuery('')
    }
  }, [opened, label, wa.contact])

  // Toggles the selection of a single contact
  const handleToggleContact = (contactId: string) => {
    setSelectedContactIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(contactId)) {
        newSet.delete(contactId)
      } else {
        newSet.add(contactId)
      }
      return newSet
    })
  }

  // Memoized search results for performance
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return allContacts
    return allContacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [allContacts, searchQuery])

  // Persists the changes to the database
  const handleSave = async () => {
    if (!label?.id) return
    try {
      await db.labels.update(label.id, {
        numbers: Array.from(selectedContactIds),
      })
      toast.success(`Contacts for "${label.label}" updated successfully.`)
      onClose()
    } catch (error) {
      console.error('Failed to update contacts for label:', error)
      toast.error('An error occurred while saving.')
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      w={600}
      withCloseButton
      style={{ zIndex: 9999 }}
    >
      <Stack>
        <Title order={3} ta="center">
          Manage Contacts for "{label?.label}"
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          Select the contacts to associate with this label.
        </Text>
        <TextInput
          placeholder="Search contacts..."
          leftSection={<Icon icon="tabler:search" fontSize={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
        <Card withBorder p={0} style={{ height: 300 }}>
          {loading ? (
            <Group justify="center" align="center" style={{ height: '100%' }}>
              <Loader />
            </Group>
          ) : (
            <ScrollArea style={{ height: 300 }}>
              <Stack gap="xs" p="sm">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <Checkbox
                      key={contact.id}
                      label={contact.name}
                      checked={selectedContactIds.has(contact.id)}
                      onChange={() => handleToggleContact(contact.id)}
                    />
                  ))
                ) : (
                  <Text c="dimmed" ta="center" pt="xl">
                    No contacts found.
                  </Text>
                )}
              </Stack>
            </ScrollArea>
          )}
        </Card>
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>
            {selectedContactIds.size} contact(s) selected
          </Text>
          <Group>
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              Save Changes
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalManageContacts
