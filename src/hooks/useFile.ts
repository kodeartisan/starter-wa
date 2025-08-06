// src/utils/file.ts
import { SaveAs, Setting } from '@/constants'
import { storage } from '@/libs/storage'
import FileSaver from 'file-saver'
import _ from 'lodash'
import * as XLSX from 'xlsx'
import useLicense from './useLicense'

const useFile = () => {
  const license = useLicense()

  const getSelectedColumns = async () => {
    return (
      (await storage.get<Record<string, boolean>>(Setting.EXPORT_COLUMNS)) || {
        phoneNumber: true,
        publicName: true,
        savedName: true,
        isBlocked: true,
        isBusiness: true,
        isMyContact: true,
      }
    )
  }

  const serializeData = async (data: any[]) => {
    const selectedColumns = await getSelectedColumns()
    let filteredData = data.map((item: any) =>
      _.pickBy(item, (_, key) => selectedColumns[key] === true),
    )

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
        const name = contact.savedName || contact.publicName || 'Unknown'
        const phone = contact.phoneNumber ? `+${contact.phoneNumber}` : ''
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL:${phone}\nEND:VCARD`
      })
      .join('\n')
    const blob = new Blob([vcardContent], { type: 'text/vcard' })
    FileSaver.saveAs(blob, `${defaultFilename()}.vcf`)
  }

  /**
   * Main function to save data in various formats.
   * @param fileType The format to save as (e.g., 'csv', 'xlsx').
   * @param data The array of data objects to save.
   * @param filename (Optional) The base name for the file, without extension.
   */
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
      case SaveAs.JSON:
        saveAsJson(processedData, finalFilename)
        break
      case SaveAs.VCARD:
        saveAsVCard(processedData) // VCard has its own filename logic
        break
      // Other formats like Markdown and HTML can be added here.
      default:
        console.error(`Unsupported file type: ${fileType}`)
        break
    }
  }

  return { saveAs }
}

export default useFile
