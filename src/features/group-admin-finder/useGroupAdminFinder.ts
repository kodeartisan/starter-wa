// src/features/group-admin-finder/useGroupAdminFinder.ts
import { SaveAs } from '@/constants'
import useLicense from '@/hooks/useLicense'
import { useAppStore } from '@/stores/app'
import toast from '@/utils/toast'
import { getContactName, showModalUpgrade } from '@/utils/util'
import FileSaver from 'file-saver'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'

// Type definition for an Admin
export interface Admin {
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

// All available columns for export customization
export const ALL_COLUMNS = [
  { value: 'phoneNumber', label: 'Phone Number' },
  { value: 'savedName', label: 'Name' },
  { value: 'isAdmin', label: 'Is Admin' },
  { value: 'isMyContact', label: 'Is My Contact' },
  { value: 'groupName', label: 'Group Name' },
]

export const RECORDS_PER_PAGE = 50

export const useGroupAdminFinder = () => {
  const { groups } = useAppStore()
  const license = useLicense()
  const [isLoading, setIsLoading] = useState(false)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.value),
  )
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

  // --- File Saving Logic remains unchanged ---
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
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' })
    FileSaver.saveAs(blob, `${filename}.txt`)
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
        toast.error('PDF export is handled by the UI component.')
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

  useEffect(() => {
    setIsLoading(true)
    const selectedGroups = _.filter(groups, (group) =>
      _.includes(selectedGroupIds, group.id),
    )

    const allAdmins = _.chain(selectedGroups)
      .flatMap((group) =>
        group.participants
          .filter((p: any) => p.isAdmin || p.isSuperAdmin)
          .map((participant: any) => ({
            groupName: group?.name || 'Unknown Group',
            id: participant.contact.id,
            phoneNumber: participant.contact.phoneNumber,
            savedName: getContactName(participant.contact),
            avatar: participant.contact.avatar,
            isMyContact: participant.contact.isMyContact,
            isAdmin: participant.isAdmin,
            isSuperAdmin: participant.isSuperAdmin,
            groupSource: group.id,
          })),
      )
      .uniqBy('id')
      .value()

    setAdmins(allAdmins)
    setIsLoading(false)
  }, [selectedGroupIds, groups])

  // Reset page only when group selection changes.
  useEffect(() => {
    setPage(1)
  }, [selectedGroupIds])

  // The list of admins is now the definitive filtered data.
  const filteredData = admins

  // Memoized data for pagination.
  const processedData = useMemo(() => {
    const from = (page - 1) * RECORDS_PER_PAGE
    const to = from + RECORDS_PER_PAGE
    return filteredData.slice(from, to)
  }, [filteredData, page])

  const getSelectedNumbers = useMemo(() => {
    return filteredData.map((m) => m.phoneNumber).join('\n')
  }, [filteredData])

  const handleExport = (format: string) => {
    const proFormats = [
      SaveAs.EXCEL,
      SaveAs.PDF,
      SaveAs.JSON,
      SaveAs.VCARD,
      SaveAs.TXT,
    ]
    if (license.isFree() && proFormats.includes(format)) {
      showModalUpgrade(
        'Advanced Export Formats',
        'Upgrade to Pro to export to Excel, PDF, JSON, vCard and TXT formats.',
      )
      return
    }
    if (filteredData.length === 0) {
      toast.error('There is no data to export.')
      return
    }
    const dataToExport = filteredData.map((member) =>
      _.pick(member, selectedColumns),
    )
    if (format === SaveAs.VCARD) {
      const vCardData = filteredData.map(({ savedName, phoneNumber }) => ({
        savedName,
        phoneNumber,
      }))
      saveAs(format, vCardData, 'whatsapp_group_admins')
      return
    }
    saveAs(format, dataToExport, 'whatsapp_group_admins')
  }

  return {
    isLoading,
    processedData,
    filteredData,
    totalRecords: filteredData.length,
    page,
    setPage,
    selectedGroupIds,
    setSelectedGroupIds,
    selectedColumns,
    setSelectedColumns,
    getSelectedNumbers,
    handleExport,
  }
}
