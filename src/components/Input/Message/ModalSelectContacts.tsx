import Modal from '@/components/Modal/Modal'
import wa from '@/libs/wa'
import { Icon } from '@iconify/react'
import { Button, Group, Stack, TextInput, Title } from '@mantine/core'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (contacts: any[]) => void
}

/**
 * @component ModalSelectContacts
 * @description A modal for fetching, displaying, and selecting from a user's contact list.
 */
const ModalSelectContacts: React.FC<Props> = ({
  opened,
  onClose,
  onSubmit,
}) => {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])

  useEffect(() => {
    if (opened) {
      const fetchContacts = async () => {
        setLoading(true)
        try {
          const contactList = await wa.contact.list({ onlyMyContacts: true })
          setContacts(contactList)
        } catch (error) {
          console.error('Failed to fetch contacts:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchContacts()
    } else {
      // Reset state when modal is closed
      setContacts([])
      setSelectedRecords([])
      setSearch('')
    }
  }, [opened])

  const filteredContacts = useMemo(() => {
    if (!search) return contacts
    return contacts.filter(
      (c) =>
        // -- MODIFIED: Corrected typo from `publictName` to `publicName`.
        c.publicName?.toLowerCase().includes(search.toLowerCase()) ||
        c.savedName?.toLowerCase().includes(search.toLowerCase()) ||
        c.phoneNumber.includes(search),
    )
  }, [contacts, search])

  const handleSubmit = () => {
    onSubmit(selectedRecords)
    onClose()
  }

  const columns: DataTableColumn<any>[] = [
    {
      accessor: 'name',
      title: 'Name',
      // -- MODIFIED: Corrected typo from `pubictName` to `publicName`.
      render: (record) => record.publicName || record.savedName || 'N/A',
    },
    {
      accessor: 'number',
      title: 'Number',
      render: (record) => record.phoneNumber,
    },
  ]

  return (
    <Modal opened={opened} onClose={onClose} w={700} withCloseButton>
      <Stack h={500} p="sm">
        <Title order={4}>Select Contact(s) to Send</Title>
        <TextInput
          placeholder="Search contacts by name or number..."
          leftSection={<Icon icon="tabler:search" fontSize={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          disabled={loading}
        />
        <DataTable
          height="100%"
          withTableBorder
          borderRadius="sm"
          striped
          highlightOnHover
          records={filteredContacts}
          columns={columns}
          fetching={loading}
          minHeight={150}
          noRecordsText="No contacts found"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          selectionCheckboxProps={{ 'aria-label': 'Select row' }}
          // ++ ADDED: Provide the 'id' accessor to the table.
          // This tells the DataTable to use the `id` field of each record object
          // as its unique identifier, which fixes the selection bug.
          idAccessor="id"
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedRecords.length === 0}
          >
            Add {selectedRecords.length} Contact(s)
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalSelectContacts
