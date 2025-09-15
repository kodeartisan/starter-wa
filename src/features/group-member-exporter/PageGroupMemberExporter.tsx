// src/features/group-member-exporter/PageGroupMemberExporter.tsx
import InputSelectGroup from '@/components/Input/InputSelectGroup'
import LayoutPage from '@/components/Layout/LayoutPage'
import { SaveAs } from '@/constants'
import useFile from '@/hooks/useFile'
import useWa from '@/hooks/useWa'
import { useAppStore } from '@/stores/app'
import { getContactName } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  CopyButton,
  Grid,
  Group,
  Menu,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import _ from 'lodash'
import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import React, { useEffect, useMemo, useState } from 'react'

// Define types for clarity
interface Member {
  id: string
  phoneNumber: string
  name: string
  isMyContact: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  avatar: string | null | undefined
  groupSource: string // To know which group they came from
}

type FilterStatus = 'ALL' | 'ADMIN' | 'NON_ADMIN'
type ContactFilterStatus = 'ALL' | 'SAVED' | 'UNSAVED'

// All available columns for export customization
const ALL_COLUMNS = [
  { value: 'phoneNumber', label: 'Phone Number' },
  { value: 'name', label: 'Name' },
  { value: 'isAdmin', label: 'Is Admin' },
  { value: 'isMyContact', label: 'Is My Contact' },
  { value: 'groupName', label: 'Group Name' },
]

const PageGroupMemberExporter: React.FC = () => {
  const wa = useWa()
  const { groups } = useAppStore()
  const { saveAs } = useFile()
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [adminFilter, setAdminFilter] = useState<FilterStatus>('ALL')
  const [contactFilter, setContactFilter] = useState<ContactFilterStatus>('ALL')
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.value),
  )

  useEffect(() => {
    const filteredGroups = _.filter(groups, (group) =>
      _.includes(selectedGroupIds, group.id),
    )
    console.log('ill', filteredGroups)
    const results = filteredGroups.map((group) => {
      return group.participants.map((participant: any) => {
        return {
          groupName: group?.name || 'Unknown Group',
          id: participant.contact.id,
          phoneNumber: participant.contact.phoneNumber,
          name: getContactName(participant.contact),
          avatar: participant.contact.avatar,
          isMyContact: participant.contact.isMyContact,
          isAdmin: participant.isAdmin,
        }
      })
    })
    const allMembers = _.chain(results).flatten().uniqBy('id').value()
    setMembers(allMembers)
  }, [selectedGroupIds, groups])

  const processedData = useMemo(() => {
    let filtered = [...members]

    // Filter by admin status
    if (adminFilter !== 'ALL') {
      filtered = filtered.filter((m) =>
        adminFilter === 'ADMIN' ? m.isAdmin : !m.isAdmin,
      )
    }

    // Filter by contact status
    if (contactFilter !== 'ALL') {
      filtered = filtered.filter((m) =>
        contactFilter === 'SAVED' ? m.isMyContact : !m.isMyContact,
      )
    }
    // Sort data
    return filtered
  }, [members, adminFilter, contactFilter])

  const getSelectedNumbers = useMemo(() => {
    return processedData.map((m) => m.phoneNumber).join('\n')
  }, [processedData])

  const handleExport = (format: string) => {
    if (processedData.length === 0) return

    // Prepare data with only the selected columns
    const dataToExport = processedData.map((member) =>
      _.pick(member, selectedColumns),
    )

    // For vCard, we need a specific format
    if (format === SaveAs.VCARD) {
      const vCardData = processedData.map(({ name, phoneNumber }) => ({
        savedName: name, // useFile expects savedName
        phoneNumber,
      }))
      saveAs(format, vCardData, 'whatsapp_group_contacts')
      return
    }

    saveAs(format, dataToExport, 'whatsapp_group_members')
  }

  return (
    <LayoutPage>
      <InputSelectGroup
        value={selectedGroupIds}
        onChange={setSelectedGroupIds}
        disabled={isLoading}
      />
      <Stack>
        <Group justify="flex-end">
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
                  leftSection={<Icon icon="tabler:file-type-json" />}
                  onClick={() => handleExport(SaveAs.JSON)}
                >
                  Export as JSON
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
              accessor: 'name',
              title: 'Name',
              render: ({ name, avatar }) => (
                <Group gap="sm">
                  <Avatar src={avatar} size={30} radius="xl" />
                  <Text fz="sm" fw={500}>
                    {name}
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
              sortable: true,
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
              sortable: true,
              textAlign: 'center',
              render: ({ isMyContact }) => (
                <Badge variant="light" color={isMyContact ? 'blue' : 'gray'}>
                  {isMyContact ? 'Saved' : 'Unsaved'}
                </Badge>
              ),
            },
            { accessor: 'groupName', title: 'Group' },
          ]}
        />
      </Stack>
    </LayoutPage>
  )
}

export default PageGroupMemberExporter
