// src/features/label/components/ModalImportLabels.tsx
import Modal from '@/components/Modal/Modal'
import type { Label } from '@/libs/db'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import { Button, Center, Group, List, Stack, Text, Title } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone' // No MIME_TYPES import needed for JSON
import React, { useState } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

type ImportedLabel = Omit<Label, 'id'>

/**
 * A modal for importing labels from a JSON backup file.
 * It handles file validation, parsing, and the database upsert logic.
 */
const ModalImportLabels: React.FC<Props> = ({ opened, onClose, onSuccess }) => {
  const [parsedLabels, setParsedLabels] = useState<ImportedLabel[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDrop = (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (!Array.isArray(data)) {
          throw new Error('Invalid file format: expecting an array of labels.')
        }
        setParsedLabels(data)
        setFileName(file.name)
      } catch (error) {
        console.error('Failed to parse file:', error)
        toast.error(
          'Failed to parse file. Please ensure it is a valid JSON backup.',
        )
        handleReject()
      }
    }
    reader.readAsText(file)
  }

  const handleReject = () => {
    setParsedLabels([])
    setFileName(null)
  }

  const handleClose = () => {
    if (loading) return
    handleReject()
    onClose()
  }

  const handleConfirmImport = async () => {
    if (parsedLabels.length === 0) {
      toast.error('No labels to import.')
      return
    }
    setLoading(true)

    try {
      const existingLabels = await db.labels.toArray()
      const existingLabelsMap = new Map(existingLabels.map((l) => [l.label, l]))

      const labelsToUpsert: Label[] = []
      let newCount = 0
      let updatedCount = 0

      for (const importedLabel of parsedLabels) {
        const existingLabel = existingLabelsMap.get(importedLabel.label)
        if (existingLabel) {
          // Merge and update existing label
          const combinedNumbers = [
            ...new Set([
              ...(existingLabel.numbers || []),
              ...(importedLabel.numbers || []),
            ]),
          ]
          labelsToUpsert.push({
            ...existingLabel,
            ...importedLabel,
            numbers: combinedNumbers,
          })
          updatedCount++
        } else {
          // Add as new label
          labelsToUpsert.push({
            ...importedLabel,
            show: 1,
            custom: 1,
          } as Label)
          newCount++
        }
      }

      await db.labels.bulkPut(labelsToUpsert)
      toast.success(
        `${newCount} new label(s) created and ${updatedCount} label(s) updated.`,
      )
      onSuccess()
    } catch (error) {
      console.error('Failed to import labels:', error)
      toast.error('An error occurred during the import process.')
    } finally {
      setLoading(false)
      handleClose()
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton
      w={550}
      style={{ zIndex: 9999 }}
    >
      <Stack>
        <Center>
          <Title order={4}>Import & Restore Labels</Title>
        </Center>
        {parsedLabels.length > 0 ? (
          <ConfirmState
            fileName={fileName!}
            labelCount={parsedLabels.length}
            onCancel={handleClose}
            onConfirm={handleConfirmImport}
            loading={loading}
          />
        ) : (
          <InitialState onDrop={handleDrop} onReject={handleReject} />
        )}
      </Stack>
    </Modal>
  )
}

// Internal component for the initial dropzone view
const InitialState = ({ onDrop, onReject }) => (
  <Stack>
    <Dropzone
      onDrop={onDrop}
      onReject={onReject}
      maxSize={5 * 1024 ** 2} // 5MB
      // MODIFIED: Use the correct MIME type string for JSON
      accept={['application/json']}
      multiple={false}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: 'none' }}
      >
        <Dropzone.Idle>
          <Icon icon={'tabler:upload'} fontSize={50} />
        </Dropzone.Idle>
        <div>
          <Text size="xl" inline>
            Drag your backup file here or click to select
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach a single JSON file exported from this extension.
          </Text>
        </div>
      </Group>
    </Dropzone>
    <List size="sm" c="dimmed" mt="md" spacing="xs" withPadding>
      <List.Item>
        Importing will merge contacts from the backup file into existing labels
        with the same name.
      </List.Item>
      <List.Item>
        Labels from the backup that do not exist will be created.
      </List.Item>
    </List>
  </Stack>
)

// Internal component for the confirmation view after a file is parsed
const ConfirmState = ({
  fileName,
  labelCount,
  onCancel,
  onConfirm,
  loading,
}) => (
  <Stack>
    <Text>
      File{' '}
      <Text span fw={700}>
        {fileName}
      </Text>{' '}
      is ready. It contains{' '}
      <Text span fw={700}>
        {labelCount}
      </Text>{' '}
      labels.
    </Text>
    <Text c="dimmed" size="sm">
      Existing labels with matching names will be updated, and their contact
      lists will be merged.
    </Text>
    <Group justify="end" mt="md">
      <Button variant="default" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button loading={loading} onClick={onConfirm}>
        Confirm Import
      </Button>
    </Group>
  </Stack>
)

export default ModalImportLabels
