import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import ModalSelectContacts from './ModalSelectContacts'

interface Props {
  form: UseFormReturnType<any>
}

/**
 * @component FormVCard
 * @description Renders the UI for selecting one or more contacts to send as a VCard.
 */
const FormVCard: React.FC<Props> = ({ form }) => {
  const [showModal, modalHandlers] = useDisclosure(false)
  const selectedContacts = form.values.inputVCard.contacts

  // Handler to add contacts from the modal to the form state
  const handleSelectContacts = (newContacts: any[]) => {
    // Store the full contact objects; the sender function will extract the ID.
    form.setFieldValue('inputVCard.contacts', newContacts)
    modalHandlers.close()
  }

  // Handler to remove a contact from the list
  const handleRemoveContact = (contactId: string) => {
    form.setFieldValue(
      'inputVCard.contacts',
      selectedContacts.filter((c: any) => c.id !== contactId),
    )
  }

  return (
    <>
      <Stack>
        <Group justify="space-between">
          <Text fw={500}>Selected Contacts ({selectedContacts.length})</Text>
          <Button
            size="xs"
            variant="outline"
            leftSection={<Icon icon="tabler:address-book" fontSize={16} />}
            onClick={modalHandlers.open}
          >
            Select Contact(s)
          </Button>
        </Group>

        {/* Display selected contacts */}
        <ScrollArea
          h={150}
          style={{ border: '1px solid #dee2e6', borderRadius: '4px' }}
        >
          <Stack gap="xs" p="xs">
            {selectedContacts.length > 0 ? (
              selectedContacts.map((contact: any) => (
                <Card withBorder p="xs" radius="sm" key={contact.id}>
                  <Group justify="space-between">
                    <Text size="sm">
                      {/* -- MODIFIED: Updated to use the correct properties for displaying the contact's name or number. */}
                      {contact.savedName ||
                        contact.publicName ||
                        contact.phoneNumber}
                    </Text>
                    <Tooltip label="Remove">
                      {/* -- MODIFIED: Pass `contact.id` to the remove handler. */}
                      <ActionIcon
                        color="red"
                        variant="transparent"
                        onClick={() => handleRemoveContact(contact.id)}
                      >
                        <Icon icon="tabler:trash" fontSize={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Card>
              ))
            ) : (
              <Text c="dimmed" ta="center" pt="xl">
                No contacts selected.
              </Text>
            )}
          </Stack>
        </ScrollArea>

        {form.errors['inputVCard.contacts'] && (
          <Text c="red" size="xs">
            {form.errors['inputVCard.contacts']}
          </Text>
        )}
      </Stack>

      <ModalSelectContacts
        opened={showModal}
        onClose={modalHandlers.close}
        onSubmit={handleSelectContacts}
      />
    </>
  )
}

export default FormVCard
