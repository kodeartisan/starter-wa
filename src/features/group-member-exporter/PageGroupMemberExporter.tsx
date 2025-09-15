// src/features/group-member-exporter/PageGroupMemberExporter.tsx
import InputSelectGroup from '@/components/Input/InputSelectGroup'
import LayoutPage from '@/components/Layout/LayoutPage'
import { SaveAs } from '@/constants'
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
  TextInput, // ADDED: Import TextInput for the search bar
} from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React from 'react'
import { ALL_COLUMNS, useGroupMemberExporter } from './useGroupMemberExporter'

const PageGroupMemberExporter: React.FC = () => {
  const {
    isLoading,
    members,
    processedData,
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
    // ADDED: Get search state and handler from the hook
    searchQuery,
    setSearchQuery,
  } = useGroupMemberExporter()

  return (
    <LayoutPage>
      <InputSelectGroup
        value={selectedGroupIds}
        onChange={setSelectedGroupIds}
        disabled={isLoading}
      />
      <Stack>
        {/* MODIFIED: Added a search input field */}
        <Group justify="space-between">
          <TextInput
            placeholder="Search by name or number..."
            leftSection={<Icon icon="tabler:search" fontSize={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            disabled={isLoading || members.length === 0}
            style={{ flex: 1 }}
          />
          <Group>
            <SegmentedControl
              disabled={isLoading || members.length === 0}
              value={adminFilter}
              onChange={setAdminFilter as (value: string) => void}
              data={[
                { label: 'All Roles', value: 'ALL' },
                { label: 'Admins', value: 'ADMIN' },
                { label: 'Non-Admins', value: 'NON_ADMIN' },
              ]}
            />
            <SegmentedControl
              disabled={isLoading || members.length === 0}
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
          <Text fw={500}>{processedData.length} members found</Text>
          <Group>
            <Popover width={250} position="bottom-end" withArrow shadow="md">
              <Popover.Target>
                <Button
                  variant="outline"
                  size="xs"
                  leftSection={<Icon icon="tabler:columns" />}
                  disabled={isLoading || members.length === 0}
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
              disabled={isLoading || processedData.length === 0}
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
                >
                  Export as Excel
                </Menu.Item>
                <Menu.Item
                  leftSection={<Icon icon="tabler:file-type-pdf" />}
                  onClick={() => handleExport(SaveAs.PDF)}
                >
                  Export as PDF
                </Menu.Item>
                <Menu.Item
                  leftSection={<Icon icon="tabler:json" />}
                  onClick={() => handleExport(SaveAs.JSON)}
                >
                  Export as JSON
                </Menu.Item>
                <Menu.Item
                  leftSection={<Icon icon="tabler:file-type-txt" />}
                  onClick={() => handleExport(SaveAs.TXT)}
                >
                  Export as TXT
                </Menu.Item>
                <Menu.Item
                  leftSection={<Icon icon="tabler:id" />}
                  onClick={() => handleExport(SaveAs.VCARD)}
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
            {
              accessor: 'phoneNumber',
              title: 'Phone Number',
            },
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
            {
              accessor: 'groupName',
              title: 'Group',
            },
          ]}
        />
      </Stack>
    </LayoutPage>
  )
}

export default PageGroupMemberExporter
