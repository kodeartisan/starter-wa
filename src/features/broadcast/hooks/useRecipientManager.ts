// src/features/broadcast/hooks/useRecipientManager.ts
import useFile from '@/hooks/useFile'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import _ from 'lodash'
import type { DataTableSortStatus } from 'mantine-datatable'
import { useEffect, useMemo, useState } from 'react'

interface Recipient {
  number: string
  name: string
  source?: string
}

interface useRecipientManagerProps {
  initialRecipients: Recipient[]
}

const PAGE_SIZE = 10

/**
 * @hook useRecipientManager
 * @description Manages all state and logic for the recipient management modal.
 */
export const useRecipientManager = ({
  initialRecipients,
}: useRecipientManagerProps) => {
  // State for data and UI
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [selectedRecords, setSelectedRecords] = useState<Recipient[]>([])
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(
    null,
  )
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'name',
    direction: 'asc',
  })
  const [editingCell, setEditingCell] = useState<{
    recordId: string
    columnId: string
  } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [listToLoad, setListToLoad] = useState<{
    name: string
    recipients: Recipient[]
  } | null>(null)

  // Modal handlers
  const [showManualModal, manualModalHandlers] = useDisclosure(false)
  const [showExcelModal, excelModalHandlers] = useDisclosure(false)
  const [showGroupsModal, groupsModalHandlers] = useDisclosure(false)
  const [showEditModal, editModalHandlers] = useDisclosure(false)
  const [showMyContactsModal, myContactsModalHandlers] = useDisclosure(false)
  const [showSaveListModal, saveListModalHandlers] = useDisclosure(false)
  const [showLoadListModal, loadListModalHandlers] = useDisclosure(false)
  const [showConfirmLoadModal, confirmLoadModalHandlers] = useDisclosure(false)

  const fileExporter = useFile()

  // Effect to initialize or reset state when the modal opens
  useEffect(() => {
    setRecipients(_.cloneDeep(initialRecipients))
    setSelectedRecords([])
    setPage(1)
    setSearchQuery('')
    setSortStatus({ columnAccessor: 'name', direction: 'asc' })
  }, [initialRecipients])

  // Memoized filtering and sorting
  const filteredAndSortedRecipients = useMemo(() => {
    let data = [...recipients]
    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase()
      data = data.filter(
        (r) =>
          r.name?.toLowerCase().includes(lowerCaseQuery) ||
          r.number?.toLowerCase().includes(lowerCaseQuery),
      )
    }
    const { columnAccessor, direction } = sortStatus
    if (columnAccessor) {
      data = _.orderBy(data, [columnAccessor], [direction])
    }
    return data
  }, [recipients, debouncedSearchQuery, sortStatus])

  // Memoized pagination
  const paginatedRecipients = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE
    return filteredAndSortedRecipients.slice(from, to)
  }, [filteredAndSortedRecipients, page])

  // Effect to reset page number on search or sort change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery, sortStatus])

  // Handlers
  const handleAddRecipients = (newRecipients: any[]) => {
    const formatted = newRecipients.map((rec) => {
      if (typeof rec === 'string') {
        return { number: rec, name: 'N/A', source: 'Manual' }
      }
      return {
        number: rec.number || rec.phoneNumber,
        name: rec.name || rec.savedName || rec.publicName || 'N/A',
      }
    })

    const combined = [...recipients, ...formatted]
    const unique = _.uniqBy(combined, 'number')
    setRecipients(unique)

    const addedCount = unique.length - recipients.length
    toast.success(`${addedCount} recipient(s) added successfully.`)
  }

  const handleDeleteRecipient = (numberToDelete: string) => {
    setRecipients((current) =>
      current.filter((r) => r.number !== numberToDelete),
    )
  }

  const handleBulkDelete = () => {
    const numbersToDelete = new Set(selectedRecords.map((r) => r.number))
    setRecipients((current) =>
      current.filter((r) => !numbersToDelete.has(r.number)),
    )
    setSelectedRecords([])
    toast.success(`${numbersToDelete.size} recipient(s) deleted.`)
  }

  const handleOpenEditModal = (recipient: Recipient) => {
    setEditingRecipient(recipient)
    editModalHandlers.open()
  }

  const handleUpdateRecipientFromModal = (
    originalNumber: string,
    updatedData: { number: string; name: string },
  ) => {
    const isDuplicate = recipients.some(
      (r) => r.number === updatedData.number && r.number !== originalNumber,
    )
    if (isDuplicate) {
      toast.error(`The number ${updatedData.number} already exists.`)
      return
    }
    setRecipients((current) =>
      current.map((r) =>
        r.number === originalNumber
          ? { ...r, name: updatedData.name, number: updatedData.number }
          : r,
      ),
    )
    editModalHandlers.close()
  }

  const handleSaveCellEdit = () => {
    if (!editingCell) return
    const { recordId, columnId } = editingCell
    const finalValue = editValue.trim()

    if (columnId === 'number') {
      if (finalValue === '') {
        toast.error('Number cannot be empty.')
        return
      }
      const isDuplicate = recipients.some(
        (r) => r.number === finalValue && r.number !== recordId,
      )
      if (isDuplicate) {
        toast.error(`The number ${finalValue} already exists.`)
        return
      }
    }

    setRecipients((current) =>
      current.map((r) =>
        r.number === recordId
          ? { ...r, [columnId]: finalValue || r[columnId] }
          : r,
      ),
    )
    setEditingCell(null)
  }

  const handleSaveList = async (name: string) => {
    if (recipients.length === 0)
      return toast.error('Cannot save an empty list.')
    setIsSaving(true)
    try {
      await db.broadcastRecipients.add({
        name,
        //@ts-ignore
        recipients,
        createdAt: new Date(),
      })
      toast.success(`List "${name}" saved successfully.`)
      saveListModalHandlers.close()
    } catch (error) {
      toast.error('Failed to save the list.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadList = (list: { name: string; recipients: Recipient[] }) => {
    setListToLoad(list)
    confirmLoadModalHandlers.open()
  }

  const confirmLoadList = (mode: 'merge' | 'replace') => {
    if (!listToLoad) return
    if (mode === 'replace') {
      setRecipients(listToLoad.recipients)
      toast.success(`Loaded ${listToLoad.recipients.length} recipients.`)
    } else {
      const combined = [...recipients, ...listToLoad.recipients]
      const unique = _.uniqBy(combined, 'number')
      setRecipients(unique)
      const addedCount = unique.length - recipients.length
      toast.success(`${addedCount} new recipient(s) merged successfully.`)
    }
    confirmLoadModalHandlers.close()
    setListToLoad(null)
  }

  const handleExport = async (format: string) => {
    if (recipients.length === 0) return toast.info('No recipients to export.')
    const data = recipients.map((r) => ({ number: r.number, name: r.name }))
    await fileExporter.saveAs(
      format,
      data,
      `recipients_${new Date().toISOString().slice(0, 10)}`,
    )
  }

  const handleClearAll = () => setRecipients([])

  return {
    // State
    recipients,
    paginatedRecipients,
    filteredAndSortedRecipients,
    selectedRecords,
    editingRecipient,
    editingCell,
    editValue,
    isSaving,
    page,
    searchQuery,
    sortStatus,
    listToLoad,

    // State Setters
    setSelectedRecords,
    setPage,
    setSearchQuery,
    setSortStatus,
    setEditingCell,
    setEditValue,

    // Handlers
    handleAddRecipients,
    handleDeleteRecipient,
    handleBulkDelete,
    handleOpenEditModal,
    handleUpdateRecipientFromModal,
    handleSaveCellEdit,
    handleSaveList,
    handleLoadList,
    confirmLoadList,
    handleExport,
    handleClearAll,

    // Modal States and Handlers
    modals: {
      manual: { opened: showManualModal, ...manualModalHandlers },
      excel: { opened: showExcelModal, ...excelModalHandlers },
      groups: { opened: showGroupsModal, ...groupsModalHandlers },
      edit: { opened: showEditModal, ...editModalHandlers },
      myContacts: { opened: showMyContactsModal, ...myContactsModalHandlers },
      saveList: { opened: showSaveListModal, ...saveListModalHandlers },
      loadList: { opened: showLoadListModal, ...loadListModalHandlers },
      confirmLoad: {
        opened: showConfirmLoadModal,
        ...confirmLoadModalHandlers,
      },
    },
  }
}
