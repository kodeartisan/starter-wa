// src/features/group-member-exporter/useGroupMemberExporter.ts
import { SaveAs } from '@/constants'
import useLicense from '@/hooks/useLicense'
import { useAppStore } from '@/stores/app'
import toast from '@/utils/toast'
import { getContactName } from '@/utils/util'
import FileSaver from 'file-saver'
import jsPDF from 'jspdf'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'

// Define types for clarity
export interface Member {
  id: string
  phoneNumber: string
  savedName: string
  isMyContact: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  avatar: string | null | undefined
  groupSource: string
  groupName: string
}

export type FilterStatus = 'ALL' | 'ADMIN' | 'NON_ADMIN'
export type ContactFilterStatus = 'ALL' | 'SAVED' | 'UNSAVED'

// All available columns for export customization
export const ALL_COLUMNS = [
  { value: 'phoneNumber', label: 'Phone Number' },
  { value: 'savedName', label: 'Name' },
  { value: 'isAdmin', label: 'Is Admin' },
  { value: 'isMyContact', label: 'Is My Contact' },
  { value: 'groupName', label: 'Group Name' },
]

// ADDED: Define a constant for the number of records to show per page
export const RECORDS_PER_PAGE = 50

export const useGroupMemberExporter = () => {
  const { groups } = useAppStore()
  const license = useLicense() // License hook for feature checks
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [adminFilter, setAdminFilter] = useState<FilterStatus>('ALL')
  const [contactFilter, setContactFilter] = useState<ContactFilterStatus>('ALL')
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.value),
  )
  const [searchQuery, setSearchQuery] = useState('')
  // ADDED: State to manage the current page
  const [page, setPage] = useState(1)

  const serializeData = async (data: any[]) => {
    let filteredData = [...data]
    if (license.isFree() && filteredData.length > 10) {
      filteredData = filteredData.map((item, index) =>
        index >= 10 ? _.mapValues(item, () => '********') : item,
      )
    }
    return filteredData
  }

  const defaultFilename = () => {
    return `export_${new Date().toISOString().slice(0, 10)}`
  }

  // --- START: File Saving Logic ---
  const saveAsCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return
    const worksheet = XLSX.utils.json_to_sheet(data)
    const csvString = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    FileSaver.saveAs(blob, `${filename}.csv`)
  }

  const saveAsExcel = (data: any[], filename: string) => {
    if (!data || data.length === 0) return
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  const saveAsJson = (data: any[], filename: string) => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    FileSaver.saveAs(blob, `${filename}.json`)
  }

  const saveAsVCard = (data: any[]) => {
    const vcardContent = data
      .map((contact) => {
        const name = contact.savedName || 'Unknown'
        const phone = contact.phoneNumber ? `+${contact.phoneNumber}` : ''
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL:${phone}\nEND:VCARD`
      })
      .join('\n')
    const blob = new Blob([vcardContent], { type: 'text/vcard' })
    FileSaver.saveAs(blob, `${defaultFilename()}.vcf`)
  }

  const saveAsTXT = (data: any[], filename: string) => {
    if (!data || data.length === 0) return
    const headers = Object.keys(data[0])
    let txtContent = headers.join('\t\t') + '\n'
    txtContent += '-'.repeat(headers.length * 15) + '\n'
    data.forEach((row) => {
      const rowValues = headers.map((header) => row[header])
      txtContent += rowValues.join('\t\t') + '\n'
    })
    const blob = new Blob([txtContent], {
      type: 'text/plain;charset=utf-8;',
    })
    FileSaver.saveAs(blob, `${filename}.txt`)
  }

  const saveAsPDF = async (data: any[], filename: string) => {
    if (!data || data.length === 0) return
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      })
      const selectedColumnDetails = ALL_COLUMNS.filter((col) =>
        selectedColumns.includes(col.value),
      )
      const headers = selectedColumnDetails.map((col) => col.label)
      const body = data.map((row) =>
        selectedColumnDetails.map((col) =>
          typeof row[col.value] === 'boolean'
            ? row[col.value]
              ? 'Yes'
              : 'No'
            : String(row[col.value] ?? '-'),
        ),
      )
      const pageHeight = doc.internal.pageSize.getHeight()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 30
      const rowHeight = 25
      const fontSize = 10
      const cellPadding = 5
      let y = margin + 30
      doc.setFontSize(18)
      doc.text('WhatsApp Group Members Export', pageWidth / 2, margin, {
        align: 'center',
      })
      doc.setFontSize(fontSize)
      const drawHeaders = () => {
        const colWidth = (pageWidth - margin * 2) / headers.length
        doc.setFont('helvetica', 'bold')
        headers.forEach((header, i) => {
          doc.setFillColor(240, 240, 240)
          doc.rect(margin + i * colWidth, y, colWidth, rowHeight, 'F')
          doc.setDrawColor(150, 150, 150)
          doc.rect(margin + i * colWidth, y, colWidth, rowHeight)
          doc.text(
            header,
            margin + i * colWidth + cellPadding,
            y + rowHeight / 2 + 4,
          )
        })
        y += rowHeight
      }
      drawHeaders()
      const colWidth = (pageWidth - margin * 2) / headers.length
      doc.setFont('helvetica', 'normal')
      body.forEach((row) => {
        if (y + rowHeight > pageHeight - margin) {
          doc.addPage()
          y = margin
          drawHeaders()
        }
        row.forEach((cell, cellIndex) => {
          doc.setDrawColor(150, 150, 150)
          doc.rect(margin + cellIndex * colWidth, y, colWidth, rowHeight)
          const textLines = doc.splitTextToSize(
            cell,
            colWidth - cellPadding * 2,
          )
          doc.text(
            textLines,
            margin + cellIndex * colWidth + cellPadding,
            y + rowHeight / 2 + 4,
          )
        })
        y += rowHeight
      })
      doc.save(`${filename}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('An unexpected error occurred while generating the PDF.')
    }
  }

  const saveAs = async (fileType: string, data: any[], filename?: string) => {
    const processedData = await serializeData(data)
    const finalFilename = filename || defaultFilename()
    switch (fileType) {
      case SaveAs.CSV:
        saveAsCSV(processedData, finalFilename)
        break
      case SaveAs.EXCEL:
        saveAsExcel(processedData, finalFilename)
        break
      case SaveAs.PDF:
        await saveAsPDF(processedData, finalFilename)
        break
      case SaveAs.JSON:
        saveAsJson(processedData, finalFilename)
        break
      case SaveAs.TXT:
        saveAsTXT(processedData, finalFilename)
        break
      case SaveAs.VCARD:
        saveAsVCard(processedData)
        break
      default:
        console.error(`Unsupported file type: ${fileType}`)
        break
    }
  }
  // --- END: File Saving Logic ---

  useEffect(() => {
    setIsLoading(true)
    const filteredGroups = _.filter(groups, (group) =>
      _.includes(selectedGroupIds, group.id),
    )
    const results = filteredGroups.map((group) => {
      return group.participants.map((participant: any) => ({
        groupName: group?.name || 'Unknown Group',
        id: participant.contact.id,
        phoneNumber: participant.contact.phoneNumber,
        savedName: getContactName(participant.contact),
        avatar: participant.contact.avatar,
        isMyContact: participant.contact.isMyContact,
        isAdmin: participant.isAdmin,
        isSuperAdmin: participant.isSuperAdmin,
        groupSource: group.id,
      }))
    })
    const allMembers = _.chain(results).flatten().uniqBy('id').value()
    setMembers(allMembers)
    setIsLoading(false)
  }, [selectedGroupIds, groups])

  // ADDED: A new `useEffect` to reset the page number to 1 whenever filters are changed.
  // This prevents viewing a non-existent page after filtering reduces the total number of records.
  useEffect(() => {
    setPage(1)
  }, [adminFilter, contactFilter, searchQuery, selectedGroupIds])

  // This memo now handles all filtering logic and returns the complete filtered list.
  const filteredData = useMemo(() => {
    let filtered = [...members]
    // Apply filters
    if (adminFilter !== 'ALL') {
      filtered = filtered.filter((m) =>
        adminFilter === 'ADMIN' ? m.isAdmin : !m.isAdmin,
      )
    }
    if (contactFilter !== 'ALL') {
      filtered = filtered.filter((m) =>
        contactFilter === 'SAVED' ? m.isMyContact : !m.isMyContact,
      )
    }
    // Apply search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.savedName?.toLowerCase().includes(lowercasedQuery) ||
          m.phoneNumber?.includes(lowercasedQuery),
      )
    }
    return filtered
  }, [members, adminFilter, contactFilter, searchQuery])

  // `processedData` is now responsible only for slicing the filtered data for pagination.
  const processedData = useMemo(() => {
    const from = (page - 1) * RECORDS_PER_PAGE
    const to = from + RECORDS_PER_PAGE
    return filteredData.slice(from, to)
  }, [filteredData, page])

  // MODIFIED: getSelectedNumbers should operate on the full filtered list, not just the visible page.
  const getSelectedNumbers = useMemo(() => {
    return filteredData.map((m) => m.phoneNumber).join('\n')
  }, [filteredData])

  // MODIFIED: handleExport should also use the full filtered list.
  const handleExport = (format: string) => {
    if (filteredData.length === 0) return
    const dataToExport = filteredData.map((member) =>
      _.pick(member, selectedColumns),
    )
    if (format === SaveAs.VCARD) {
      const vCardData = filteredData.map(({ savedName, phoneNumber }) => ({
        savedName,
        phoneNumber,
      }))
      saveAs(format, vCardData, 'whatsapp_group_contacts')
      return
    }
    saveAs(format, dataToExport, 'whatsapp_group_members')
  }

  return {
    isLoading,
    members,
    processedData, // This is now the paginated data for the table
    totalRecords: filteredData.length, // The total number of records after filtering
    page,
    setPage,
    adminFilter,
    setAdminFilter,
    contactFilter,
    setContactFilter,
    selectedGroupIds,
    setSelectedGroupIds,
    selectedColumns,
    setSelectedColumns,
    getSelectedNumbers,
    handleExport,
    searchQuery,
    setSearchQuery,
  }
}
