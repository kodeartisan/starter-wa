// src/features/label/components/ModalImportContacts.tsx
import Modal from '@/components/Modal/Modal'
import useLicense from '@/hooks/useLicense' // ++ IMPORT
import db, { type Label } from '@/libs/db'
import toast from '@/utils/toast'
import { showModalUpgrade } from '@/utils/util' // ++ IMPORT
import { Center, Stack, Title } from '@mantine/core'
import React from 'react'
import ContactsUploader from './ContactsUploader'

interface Props {
  opened: boolean
  onClose: () => void
  label: Label | null
}

const ModalImportContacts: React.FC<Props> = ({ opened, onClose, label }) => {
  const license = useLicense() // ++ ADD
  if (!label) return null

  const handleConfirmUpload = async (importedNumbers: string[]) => {
    try {
      const existingNumbers = label.numbers || []
      const combinedNumbers = [
        ...new Set([...existingNumbers, ...importedNumbers]),
      ]

      // ++ ADD: License check for contact limit
      if (license.isFree() && combinedNumbers.length > 5) {
        showModalUpgrade(
          'Unlimited Contacts per Label',
          `This import would exceed the 5-contact limit for the Free plan. Please upgrade to Pro for unlimited contacts.`,
        )
        onClose()
        return
      }

      const newCount = combinedNumbers.length - existingNumbers.length
      await db.labels.update(label.id, { numbers: combinedNumbers })
      toast.success(`${newCount} new contact(s) imported to "${label.label}".`)
    } catch (error) {
      console.error('Failed to import contacts:', error)
      toast.error('An error occurred during the import process.')
    } finally {
      onClose()
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton
      w={500}
      style={{ zIndex: 9999 }}
    >
      <Stack>
        <Center>
          <Title order={4}>Import Contacts to "{label.label}"</Title>
        </Center>
        <ContactsUploader onConfirm={handleConfirmUpload} onClose={onClose} />
      </Stack>
    </Modal>
  )
}

export default ModalImportContacts
