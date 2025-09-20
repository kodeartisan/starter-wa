import Modal from '@/components/Modal/Modal'
import ExcelUploadPopover from '@/features/broadcast/components/Excel/ExcelUploadPopover'
import { Center, Stack, Title } from '@mantine/core'
import React from 'react'
import ExcelUploader from '../Excel/ExcelUploader'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (recipients: any[]) => void
}

const ModalSourceExcel: React.FC<Props> = ({ opened, onClose, onSubmit }) => {
  // This handler receives the raw parsed data from the uploader and formats it
  // for the broadcast recipient list before passing it up to the parent.
  const handleConfirmUpload = (parsedData: any[]) => {
    const newRecipients = parsedData
      .map((item) => ({
        number: item.number?.toString(),
        name: item.name?.toString() || 'From Excel',
        source: 'Excel',
      }))
      .filter((item) => item.number)

    if (newRecipients.length > 0) {
      onSubmit(newRecipients)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} withCloseButton w={500}>
      <Stack>
        <Center>
          <Title order={4}>Add Numbers From Excel</Title>
        </Center>
        <ExcelUploader onConfirm={handleConfirmUpload} onClose={onClose} />
      </Stack>
    </Modal>
  )
}

export default ModalSourceExcel
