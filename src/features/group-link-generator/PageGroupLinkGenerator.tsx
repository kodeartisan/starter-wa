// src/features/group-link-generator/PageGroupLinkGenerator.tsx
import InputSelectGroup from '@/components/Input/InputSelectGroup'
import LayoutPage from '@/components/Layout/LayoutPage'
import useLicense from '@/hooks/useLicense'
import db, { type GroupLinkHistory } from '@/libs/db'
import wa from '@/libs/wa'
import { useAppStore } from '@/stores/app'
import toast from '@/utils/toast'
import { showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import FileSaver from 'file-saver'
import { DataTable } from 'mantine-datatable'
import React, { useState } from 'react'
import { When } from 'react-if'
import * as XLSX from 'xlsx'

interface GeneratedLink {
  id: string
  name: string
  link: string
}

/**
 * @description A reusable component for copying group links with options.
 */
const CopyActionMenu: React.FC<{
  link: string
  customMessage: string
}> = ({ link, customMessage }) => {
  const formattedMessage = customMessage.replace('{link}', link)

  return (
    <Menu shadow="md" withArrow position="bottom-end">
      <Menu.Target>
        <Tooltip label="Copy Options" position="top">
          <ActionIcon variant="subtle">
            <Icon icon="tabler:copy" fontSize={18} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <CopyButton value={link}>
          {({ copy }) => (
            <Menu.Item leftSection={<Icon icon="tabler:link" />} onClick={copy}>
              Copy Link Only
            </Menu.Item>
          )}
        </CopyButton>
        <CopyButton value={formattedMessage}>
          {({ copy }) => (
            <Menu.Item
              leftSection={<Icon icon="tabler:message-plus" />}
              onClick={copy}
            >
              Copy with Message
            </Menu.Item>
          )}
        </CopyButton>
      </Menu.Dropdown>
    </Menu>
  )
}

/**
 * @description Saves data as a CSV file.
 * @param {any[]} data The array of data to save.
 * @param {string} filename The name of the file.
 */
const saveAsCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return
  const worksheet = XLSX.utils.json_to_sheet(data)
  const csvString = XLSX.utils.sheet_to_csv(worksheet)
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  FileSaver.saveAs(blob, `${filename}.csv`)
}

/**
 * @description Saves data as an Excel (XLSX) file.
 * @param {any[]} data The array of data to save.
 * @param {string} filename The name of the file.
 */
const saveAsExcel = (data: any[], filename: string) => {
  if (!data || data.length === 0) return
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1')
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

/**
 * @component PageGroupLinkGenerator
 * @description A tool to select WhatsApp groups and generate their invite links.
 * Now supports multi-selection for Pro users, export to CSV/Excel, and limits free users to a single selection.
 */
const PageGroupLinkGenerator: React.FC = () => {
  const { groups } = useAppStore()
  const license = useLicense()
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [customMessage, setCustomMessage] = useState<string>(
    'Please join our group: {link}',
  )

  // Fetch link history from the database
  const linkHistory = useLiveQuery(
    () => db.groupLinkHistories.orderBy('createdAt').reverse().toArray(),
    [],
  )

  const handleGroupSelectionChange = (ids: string[]) => {
    // Enforce single group selection for free users
    if (license.isFree() && ids.length > 1) {
      showModalUpgrade(
        'Multiple Group Link Generation',
        'Upgrade to Pro to select and generate invite links for multiple groups at once, saving you valuable time.',
      )
      // Keep only the most recently selected group
      setSelectedGroupIds(ids.slice(-1))
      return
    }
    setSelectedGroupIds(ids)
  }

  const handleGenerateLink = async () => {
    if (selectedGroupIds.length === 0) {
      toast.error('Please select at least one group.')
      return
    }
    setIsLoading(true)
    setGeneratedLinks([])
    try {
      const linkPromises = selectedGroupIds.map((id) =>
        wa.group.getInviteLink(id),
      )
      const resolvedLinks = await Promise.all(linkPromises)

      const linksWithData = selectedGroupIds
        .map((id, index) => {
          const group = groups.find((g) => g.id === id)
          return {
            id: id,
            name: group?.name || 'Unknown Group',
            link: resolvedLinks[index],
          }
        })
        .filter((item) => item.link) // Filter out any groups where link generation failed

      setGeneratedLinks(linksWithData)

      // Save to history
      for (const item of linksWithData) {
        await db.groupLinkHistories.add({
          groupId: item.id,
          groupName: item.name,
          link: item.link,
          createdAt: new Date(),
        })
      }

      if (linksWithData.length > 0) {
        toast.success('Invite links generated successfully!')
      }
      if (linksWithData.length < selectedGroupIds.length) {
        toast.error(
          'Could not generate links for some groups. You may not have admin rights.',
        )
      }
    } catch (error: any) {
      console.error('Failed to generate group links:', error)
      toast.error(error.message || 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  // --- START: MODIFIED ---
  // Added a check to ensure only Pro users can use the export functionality.
  const handleExport = (format: 'CSV' | 'EXCEL') => {
    if (license.isFree()) {
      showModalUpgrade(
        'Export Group Links',
        'Upgrade to Pro to export the generated group invite links to CSV or Excel for easy sharing and record-keeping.',
      )
      return
    }
    const dataToExport =
      generatedLinks.length > 0 ? generatedLinks : linkHistory
    if (!dataToExport || dataToExport.length === 0) {
      toast.error('No links to export.')
      return
    }
    // Format data for a cleaner export file with clear column headers
    //@ts-ignore
    const exportData = dataToExport.map(({ groupName, name, link }) => ({
      groupName: groupName || name,
      inviteLink: link,
    }))
    const filename = `whatsapp_group_links_${new Date().toISOString().slice(0, 10)}`
    if (format === 'CSV') {
      saveAsCSV(exportData, filename)
    } else if (format === 'EXCEL') {
      saveAsExcel(exportData, filename)
    }
    toast.success(`Links successfully exported as ${format}!`)
  }

  const handleRevokeAndDelete = async (item: GroupLinkHistory) => {
    if (
      !confirm(
        `Are you sure you want to revoke the link for "${item.groupName}"? This action is irreversible.`,
      )
    ) {
      return
    }
    try {
      await wa.group.revokeInviteCode(item.groupId)
      if (item.id) {
        await db.groupLinkHistories.delete(item.id)
      }
      toast.success(
        `Link for "${item.groupName}" has been revoked and deleted.`,
      )
    } catch (error: any) {
      console.error('Failed to revoke link:', error)
      toast.error(
        error.message ||
          'Failed to revoke the link. You may no longer have admin rights.',
      )
    }
  }
  // --- END: MODIFIED ---

  const renderGeneratedLinks = () => (
    <Stack>
      {generatedLinks.map((item) => (
        <TextInput
          key={item.id}
          label={item.name}
          readOnly
          value={item.link}
          rightSection={
            <CopyActionMenu link={item.link} customMessage={customMessage} />
          }
        />
      ))}
    </Stack>
  )

  return (
    <LayoutPage>
      <Stack>
        <Stack align="center" gap={4} mb="xl">
          <Icon icon="tabler:ticket" fontSize={48} />
          <Title order={3} ta="center">
            {' '}
            Group Invite Link Generator{' '}
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            {' '}
            Quickly get invite links for any of your WhatsApp groups.{' '}
          </Text>
        </Stack>

        <Paper withBorder p="lg" radius="md" shadow="none">
          <Stack>
            <InputSelectGroup
              value={selectedGroupIds}
              onChange={handleGroupSelectionChange}
              disabled={isLoading}
              filter={(group) => group.isAdmin}
            />
            <Textarea
              label="Custom Message Template"
              description="Use {link} as a placeholder for the generated invite link."
              value={customMessage}
              onChange={(event) => setCustomMessage(event.currentTarget.value)}
              minRows={2}
              autosize
            />
            <Group justify="flex-end" mt="md">
              <Button
                onClick={handleGenerateLink}
                loading={isLoading}
                disabled={selectedGroupIds.length === 0}
                leftSection={<Icon icon="tabler:refresh-dot" fontSize={20} />}
              >
                {' '}
                Generate Link(s){' '}
              </Button>
            </Group>
          </Stack>
        </Paper>

        <When condition={generatedLinks.length > 0}>
          <Card withBorder p="lg" radius="md" mt="lg">
            <Stack>
              <Group justify="space-between">
                <Title order={4}>Your Invite Links are Ready!</Title>
                <Group>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<Icon icon="tabler:file-type-csv" />}
                    onClick={() => handleExport('CSV')}
                  >
                    {' '}
                    Export as CSV{' '}
                  </Button>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<Icon icon="tabler:file-type-xls" />}
                    onClick={() => handleExport('EXCEL')}
                  >
                    {' '}
                    Export as Excel{' '}
                  </Button>
                </Group>
              </Group>
              {renderGeneratedLinks()}
            </Stack>
          </Card>
        </When>

        <When condition={linkHistory && linkHistory.length > 0}>
          <Card withBorder p="lg" radius="md" mt="lg">
            <Stack>
              <Group justify="space-between">
                <Title order={4}>Link History</Title>
              </Group>
              <DataTable
                minHeight={150}
                records={linkHistory}
                columns={[
                  { accessor: 'groupName', title: 'Group Name' },
                  {
                    accessor: 'link',
                    title: 'Invite Link',
                    render: (item) => (
                      <Text size="sm" truncate>
                        {item.link}
                      </Text>
                    ),
                  },
                  {
                    accessor: 'createdAt',
                    title: 'Generated At',
                    render: (item) => (
                      <Text size="sm">
                        {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                      </Text>
                    ),
                  },
                  {
                    accessor: 'actions',
                    title: 'Actions',
                    textAlign: 'right',
                    render: (item) => (
                      <Group gap="xs" justify="right" wrap="nowrap">
                        <CopyActionMenu
                          link={item.link}
                          customMessage={customMessage}
                        />
                        <Tooltip label="Revoke & Delete" position="top">
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => handleRevokeAndDelete(item)}
                          >
                            <Icon icon="tabler:trash" fontSize={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    ),
                  },
                ]}
              />
            </Stack>
          </Card>
        </When>
      </Stack>
    </LayoutPage>
  )
}

export default PageGroupLinkGenerator
