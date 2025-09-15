// src/features/group-member-exporter/PageGroupMemberExporter.tsx
import InputSelectGroup from '@/components/Input/InputSelectGroup'
import LayoutPage from '@/components/Layout/LayoutPage'
import { SaveAs } from '@/constants'
import useLicense from '@/hooks/useLicense'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  CopyButton,
  Group,
  Menu,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React from 'react'
import {
  ALL_COLUMNS,
  RECORDS_PER_PAGE,
  useGroupMemberExporter,
} from './useGroupMemberExporter'

const PageGroupMemberExporter: React.FC = () => {
  const {
    isLoading,
    processedData,
    totalRecords,
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
  } = useGroupMemberExporter()
  const license = useLicense() // ADDED: Instantiate license hook

  // ADDED: Create a dynamic label for the group selector to show PRO badge
  const selectGroupLabel = (
    <Group justify="space-between" w="100%">
      <Text fw={500}>Select Group(s)</Text>
      {license.isFree() && (
        <Tooltip
          multiline
          w={220}
          label="Upgrade to Pro to select and export from multiple groups at once."
        >
          <Badge size="sm" variant="light" color="teal">
            MULTI-GROUP IS A PRO FEATURE
          </Badge>
        </Tooltip>
      )}
    </Group>
  )

  return (
    <LayoutPage>
      {/* MODIFIED: Updated InputSelectGroup with new props for free user limitations */}
      <InputSelectGroup
        value={selectedGroupIds}
        onChange={setSelectedGroupIds}
        disabled={isLoading}
      />
      <Stack>
        <Group justify="space-between">
          <TextInput
            placeholder="Search by name or number..."
            leftSection={<Icon icon="tabler:search" fontSize={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            disabled={isLoading || (totalRecords === 0 && searchQuery === '')}
            style={{ flex: 1 }}
          />
          <Group>
            <SegmentedControl
              disabled={
                isLoading || (totalRecords === 0 && adminFilter === 'ALL')
              }
              value={adminFilter}
              onChange={setAdminFilter as (value: string) => void}
              data={[
                { label: 'All Roles', value: 'ALL' },
                { label: 'Admins', value: 'ADMIN' },
                { label: 'Non-Admins', value: 'NON_ADMIN' },
              ]}
            />
            <SegmentedControl
              disabled={
                isLoading || (totalRecords === 0 && contactFilter === 'ALL')
              }
              value={contactFilter}
              onChange={setContactFilter as (value: string) => void}
              data={[
                { label: 'All Contacts', value: 'ALL' },
                { label: 'Saved', value: 'SAVED' },
                { label: 'Unsaved', value: 'UNSAVED' },
              ]}
            />
          </Group>
        </Group>
        <Group justify="space-between">
          <Text fw={500}>{totalRecords} members found</Text>
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
              {/* MODIFIED: Export menu now checks license and shows PRO badges */}
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
                <Menu.Item
                  leftSection={<Icon icon="tabler:file-type-pdf" />}
                  onClick={() => handleExport(SaveAs.PDF)}
                  rightSection={
                    license.isFree() ? (
                      <Badge variant="light" color="teal" size="xs">
                        PRO
                      </Badge>
                    ) : null
                  }
                >
                  Export as PDF
                </Menu.Item>
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
          height={350}
          withTableBorder
          borderRadius="sm"
          striped
          highlightOnHover
          records={processedData}
          fetching={isLoading}
          noRecordsText="No members to display. Select a group to get started."
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
              render: ({ isAdmin, isSuperAdmin }) => (
                <Badge color={isSuperAdmin ? 'red' : isAdmin ? 'teal' : 'gray'}>
                  {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Member'}
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

export default PageGroupMemberExporter
