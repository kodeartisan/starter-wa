// src/hooks/useFile.ts
import toast from '@/utils/toast'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

/**
 * @hook useFile
 * @description A hook to provide utility functions for exporting data to files (CSV, XLSX).
 */
const useFile = () => {
  /**
   * @description Converts an array of objects to a specified file format and triggers a download.
   * @param format The desired file format ('csv' or 'xlsx').
   * @param data The array of data to export.
   * @param filename The base name for the downloaded file (without extension).
   */
  const saveAs = async (
    format: 'csv' | 'xlsx' | string,
    data: any[],
    filename: string,
  ) => {
    if (!data || data.length === 0) {
      toast.info('No data available to export.')
      return
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

      let fileBuffer: any
      let mimeType: string
      let fileExtension: string

      switch (format) {
        case 'xlsx':
          fileExtension = 'xlsx'
          mimeType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
          fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
          break
        case 'csv':
        default:
          fileExtension = 'csv'
          mimeType = 'text/csv;charset=utf-8;'
          fileBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'array' })
          break
      }

      const blob = new Blob([fileBuffer], { type: mimeType })
      FileSaver.saveAs(blob, `${filename}.${fileExtension}`)
      toast.success('File exported successfully.')
    } catch (error) {
      console.error('File export error:', error)
      toast.error('An error occurred during the file export.')
    }
  }

  return {
    saveAs,
  }
}

export default useFile
