import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  FileInput,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import FileSaver from 'file-saver'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'

interface Props {
  onConfirm: (data: any[]) => void
  onClose: () => void
}

/**
 * @component ExcelUploader
 * @description A generic component for uploading, parsing, previewing, and confirming Excel data.
 * It encapsulates the core logic previously duplicated in ModalSourceExcel and ExcelUploadPopover.
 */
const ExcelUploader: React.FC<Props> = ({ onConfirm, onClose }) => {
  const [parsedData, setParsedData] = useState<any[]>([])
  const [excelFile, setExcelFile] = useState<File | null>(null)

  const handleDownloadSample = () => {
    const sampleData = [{ number: '6281234567890', name: 'John Doe' }]
    const worksheet = XLSX.utils.json_to_sheet(sampleData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })
    FileSaver.saveAs(data, 'sample_contacts.xlsx')
  }

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setParsedData([])
      setExcelFile(null)
      return
    }
    setExcelFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)
      setParsedData(json)
    }
    reader.readAsArrayBuffer(file)
  }

  // Removes a specific row from the preview data
  const handleDeleteRow = (indexToRemove: number) => {
    setParsedData((currentData) =>
      currentData.filter((_, index) => index !== indexToRemove),
    )
  }

  // Confirms the upload, passes the data to the parent, and calls the parent's close handler
  const handleConfirmUpload = () => {
    onConfirm(parsedData)
    onClose()
  }

  // Resets state and calls the parent's close handler
  const handleClose = () => {
    setParsedData([])
    setExcelFile(null)
    onClose()
  }

  return (
    <>
      <Text size="xs" c="dimmed" mt={-10}>
        File must contain a 'number' column.
      </Text>
      <Group justify="center">
        <Button
          variant="light"
          size="xs"
          onClick={handleDownloadSample}
          leftSection={<Icon icon="tabler:download" />}
        >
          Download Sample
        </Button>
      </Group>

      <FileInput
        placeholder="Choose file"
        onChange={handleFileChange}
        accept=".xlsx, .xls, .csv"
        clearable
        value={excelFile}
      />

      {parsedData.length > 0 && (
        <>
          <Text size="sm">Data Preview:</Text>
          <ScrollArea h={150}>
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              fz="xs"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Number</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {parsedData.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{row.number}</Table.Td>
                    <Table.Td>{row.name}</Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="transparent"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <Icon icon="tabler:trash" fontSize={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </>
      )}

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirmUpload}
          disabled={parsedData.length === 0}
        >
          Add {parsedData.length} Numbers
        </Button>
      </Group>
    </>
  )
}

export default ExcelUploader
