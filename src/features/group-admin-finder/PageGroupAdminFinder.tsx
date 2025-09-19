// src/features/group-admin-finder/PageGroupAdminFinder.tsx
import InputSelectGroup from '@/components/Input/InputSelectGroup'
import LayoutPage from '@/components/Layout/LayoutPage'
import { Action, SaveAs } from '@/constants'
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import { postMessage } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Checkbox,
  CopyButton,
  Group,
  Menu,
  Popover,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import { PDFDownloadLink } from '@react-pdf/renderer'
import _ from 'lodash'
import { DataTable } from 'mantine-datatable'
import React, { useMemo } from 'react'
import PdfDocument from './PdfDocument'
import {
  ALL_COLUMNS,
  RECORDS_PER_PAGE,
  useGroupAdminFinder,
} from './useGroupAdminFinder'

/**
 * @component PageGroupAdminFinder
 * @description A page component to find and display administrators from selected WhatsApp groups.
 */
const PageGroupAdminFinder: React.FC = () => {
  const {
    isLoading,
    processedData,
    filteredData,
    totalRecords,
    page,
    setPage,
    selectedGroupIds,
    setSelectedGroupIds,
    selectedColumns,
    setSelectedColumns,
    getSelectedNumbers,
    handleExport,
  } = useGroupAdminFinder()
  const license = useLicense()
  const wa = useWa()

  const pdfExportData = useMemo(() => {
    const columns = ALL_COLUMNS.filter((col) =>
      selectedColumns.includes(col.value),
    )
    const data = filteredData.map((member) => _.pick(member, selectedColumns))
    return { data, columns }
  }, [filteredData, selectedColumns])

  // ++ ADDED: A handler to open the chat and then close the main modal.
  const handleSendMessage = (chatId: string) => {
    wa.chat.openChatBottom(chatId)
    postMessage(Action.Window.CLOSE_PAGE)
  }

  return (
    <LayoutPage>
      <InputSelectGroup
        value={selectedGroupIds}
        onChange={setSelectedGroupIds}
        disabled={isLoading}
      />
      <Stack>
        <Group justify="space-between">
          <Text fw={500}>{totalRecords} admins found</Text>
          <Group>
            <Popover width={250} position="bottom-end" withArrow shadow="md">
              <Popover.Target>
                <Button
                  variant="outline"
                  size="xs"
                  leftSection={<Icon icon="tabler:columns" />}
                  disabled={isLoading || totalRecords === 0}
                >
                  Customize Columns
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Checkbox.Group
                  label="Select columns to export"
                  value={selectedColumns}
                  onChange={setSelectedColumns}
                >
                  <Stack mt="xs" gap="xs">
                    {ALL_COLUMNS.map((col) => (
                      <Checkbox
                        key={col.value}
                        value={col.value}
                        label={col.label}
                      />
                    ))}
                  </Stack>
                </Checkbox.Group>
              </Popover.Dropdown>
            </Popover>
            <Menu
              shadow="md"
              width={200}
              disabled={isLoading || totalRecords === 0}
            >
              <Menu.Target>
                <Button size="xs" leftSection={<Icon icon="tabler:download" />}>
                  Export Data
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Export Formats</Menu.Label>
                <Menu.Item
                  leftSection={<Icon icon="tabler:file-type-csv" />}
                  onClick={() => handleExport(SaveAs.CSV)}
                >
                  Export as CSV
                </Menu.Item>
                <Menu.Item
                  leftSection={<Icon icon="tabler:file-type-xls" />}
                  onClick={() => handleExport(SaveAs.EXCEL)}
                  rightSection={
                    license.isFree() ? (
                      <Badge variant="light" color="teal" size="xs">
                        PRO
                      </Badge>
                    ) : null
                  }
                >
                  Export as Excel
                </Menu.Item>
                {license.isFree() ? (
                  <Menu.Item
                    leftSection={<Icon icon="tabler:file-type-pdf" />}
                    onClick={() => handleExport(SaveAs.PDF)}
                    rightSection={
                      <Badge variant="light" color="teal" size="xs">
                        PRO
                      </Badge>
                    }
                  >
                    Export as PDF
                  </Menu.Item>
                ) : (
                  <PDFDownloadLink
                    document={
                      <PdfDocument
                        data={pdfExportData.data}
                        columns={pdfExportData.columns}
                      />
                    }
                    fileName="whatsapp_group_admins.pdf"
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading }) => (
                      <Menu.Item
                        leftSection={<Icon icon="tabler:file-type-pdf" />}
                        disabled={loading}
                      >
                        {loading ? 'Generating PDF...' : 'Export as PDF'}
                      </Menu.Item>
                    )}
                  </PDFDownloadLink>
                )}
                <Menu.Item
                  leftSection={<Icon icon="tabler:json" />}
                  onClick={() => handleExport(SaveAs.JSON)}
                  rightSection={
                    license.isFree() ? (
                      <Badge variant="light" color="teal" size="xs">
                        PRO
                      </Badge>
                    ) : null
                  }
                >
                  Export as JSON
                </Menu.Item>
                <Menu.Item
                  leftSection={<Icon icon="tabler:file-type-txt" />}
                  onClick={() => handleExport(SaveAs.TXT)}
                  rightSection={
                    license.isFree() ? (
                      <Badge variant="light" color="teal" size="xs">
                        PRO
                      </Badge>
                    ) : null
                  }
                >
                  Export as TXT
                </Menu.Item>
                <Menu.Item
                  leftSection={<Icon icon="tabler:id" />}
                  onClick={() => handleExport(SaveAs.VCARD)}
                  rightSection={
                    license.isFree() ? (
                      <Badge variant="light" color="teal" size="xs">
                        PRO
                      </Badge>
                    ) : null
                  }
                >
                  Export as vCard (.vcf)
                </Menu.Item>
                <Menu.Divider />
                <CopyButton value={getSelectedNumbers}>
                  {({ copied, copy }) => (
                    <Menu.Item
                      leftSection={<Icon icon="tabler:clipboard" />}
                      onClick={copy}
                    >
                      {copied ? 'Copied Numbers!' : 'Copy Phone Numbers'}
                    </Menu.Item>
                  )}
                </CopyButton>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        <DataTable
          height={400}
          withTableBorder
          borderRadius="sm"
          striped
          highlightOnHover
          records={processedData}
          fetching={isLoading}
          noRecordsText="No admins to display. Select a group to get started."
          columns={[
            {
              accessor: 'savedName',
              title: 'Name',
              render: ({ savedName, avatar }) => (
                <Group gap="sm">
                  <Avatar src={avatar} size={30} radius="xl" />
                  <Text fz="sm" fw={500}>
                    {savedName}
                  </Text>
                </Group>
              ),
            },
            { accessor: 'phoneNumber', title: 'Phone Number' },
            {
              accessor: 'isAdmin',
              title: 'Role',
              textAlign: 'center',
              render: ({ isSuperAdmin }) => (
                <Badge color={isSuperAdmin ? 'red' : 'teal'}>
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </Badge>
              ),
            },
            {
              accessor: 'isMyContact',
              title: 'Contact Status',
              textAlign: 'center',
              render: ({ isMyContact }) => (
                <Badge variant="light" color={isMyContact ? 'blue' : 'gray'}>
                  {isMyContact ? 'Saved' : 'Unsaved'}
                </Badge>
              ),
            },
            { accessor: 'groupName', title: 'Group' },
            {
              accessor: 'actions',
              title: 'Actions',
              textAlign: 'right',
              render: (admin) => (
                <Group gap="xs" justify="right" wrap="nowrap">
                  <Tooltip label="Send Message">
                    <ActionIcon
                      variant="subtle"
                      // ++ MODIFIED: Use the new handler function.
                      onClick={() => handleSendMessage(admin.id)}
                    >
                      <Icon icon="tabler:send" fontSize={16} />
                    </ActionIcon>
                  </Tooltip>
                  <CopyButton value={admin.phoneNumber}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied!' : 'Copy Number'}>
                        <ActionIcon
                          variant="subtle"
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          <Icon
                            icon={copied ? 'tabler:check' : 'tabler:copy'}
                            fontSize={16}
                          />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
              ),
            },
          ]}
          totalRecords={totalRecords}
          recordsPerPage={RECORDS_PER_PAGE}
          page={page}
          onPageChange={setPage}
        />
      </Stack>
    </LayoutPage>
  )
}

export default PageGroupAdminFinder
