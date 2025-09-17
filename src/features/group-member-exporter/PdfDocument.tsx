// src/features/group-member-exporter/PdfDocument.tsx
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import _ from 'lodash'
import React from 'react'

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    flex: 1,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    flex: 1,
  },
  headerText: {
    fontFamily: 'Helvetica-Bold',
  },
  cellText: {
    fontFamily: 'Helvetica',
  },
})

interface Column {
  value: string
  label: string
}

interface PdfDocumentProps {
  data: any[]
  columns: Column[]
}

/**
 * @component PdfDocument
 * @description A component that defines the structure of the PDF file to be generated.
 * It receives data and column definitions to dynamically create a table.
 */
const PdfDocument: React.FC<PdfDocumentProps> = ({ data, columns }) => (
  <Document>
    <Page style={styles.page} orientation="landscape">
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader} fixed>
          {columns.map((col) => (
            <View key={col.value} style={styles.tableColHeader}>
              <Text style={styles.headerText}>{col.label}</Text>
            </View>
          ))}
        </View>

        {/* Table Body */}
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {columns.map((col) => {
              const cellValue = _.get(row, col.value)
              // Format boolean values for display
              const textValue =
                typeof cellValue === 'boolean'
                  ? cellValue
                    ? 'Yes'
                    : 'No'
                  : String(cellValue ?? '-')

              return (
                <View key={col.value} style={styles.tableCol}>
                  <Text style={styles.cellText}>{textValue}</Text>
                </View>
              )
            })}
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

export default PdfDocument
