// src/features/label/components/ContactsUploader.tsx
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import { Button, Group, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'

interface Props {
  onConfirm: (numbers: string[]) => void
  onClose: () => void
}

/**
 * A component to handle uploading and parsing contact numbers from CSV/Excel files.
 */
const ContactsUploader: React.FC<Props> = ({ onConfirm, onClose }) => {
  const [parsedData, setParsedData] = useState<any[]>([])
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDrop = (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)

        if (json.length === 0) {
          toast.error('The uploaded file is empty or in the wrong format.')
          return
        }

        setParsedData(json)
        setFileName(file.name)
      } catch (error) {
        console.error('Failed to parse file:', error)
        toast.error(
          'Failed to parse the file. Please ensure it is a valid CSV or Excel file.',
        )
        handleReject()
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const handleReject = (rejections?: any[]) => {
    setParsedData([])
    setFileName(null)
    if (rejections && rejections.length > 0) {
      toast.error('File rejected. Please upload a valid CSV or Excel file.')
    }
  }

  const handleConfirm = () => {
    if (parsedData.length === 0) {
      toast.error('No data to import.')
      return
    }
    const firstRow = parsedData[0]
    const key = Object.keys(firstRow).find(
      (k) => k.toLowerCase() === 'number' || k.toLowerCase() === 'phone',
    )

    const numbers = parsedData
      .map((row) => {
        const value = key ? row[key] : row[Object.keys(row)[0]]
        return String(value).replace(/\D/g, '') // Remove all non-digit characters
      })
      .filter((number) => number.length > 5) // Basic validation for phone number length

    if (numbers.length === 0) {
      toast.error(
        "Could not find valid numbers. Ensure a column is named 'number' or contains phone numbers.",
      )
      return
    }

    onConfirm(numbers)
    handleReject() // Clear state after confirming
  }

  if (parsedData.length > 0) {
    return (
      <Stack>
        <Text>
          File{' '}
          <Text span fw={700}>
            {fileName}
          </Text>{' '}
          is ready. We found{' '}
          <Text span fw={700}>
            {parsedData.length}
          </Text>{' '}
          rows.
        </Text>
        <Text c="dimmed" size="sm">
          We will add the imported numbers to the label. Duplicate numbers will
          be ignored.
        </Text>
        <Group justify="end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Import</Button>
        </Group>
      </Stack>
    )
  }

  return (
    <Stack>
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        maxSize={5 * 1024 ** 2} // 5MB
        accept={[MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx]}
        multiple={false}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Idle>
            <Icon icon={'tabler:file-text'} fontSize={50} />
          </Dropzone.Idle>
          <div>
            <Text size="xl" inline>
              Drag file here or click to select
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach a single CSV or Excel file.
            </Text>
          </div>
        </Group>
      </Dropzone>
      <List size="sm" c="dimmed" mt="md" spacing="xs" withPadding>
        <List.Item>
          The file must have a header row (e.g., "Name", "Number").
        </List.Item>
        <List.Item>
          We recommend a column named{' '}
          <Text span fw={500}>
            number
          </Text>{' '}
          or{' '}
          <Text span fw={500}>
            phone
          </Text>
          . Otherwise, we will use the first column.
        </List.Item>
      </List>
    </Stack>
  )
}

export default ContactsUploader
