// src/features/number-validator/components/ResultsSection.tsx
import useLicense from '@/hooks/useLicense'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Progress,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'
import { When } from 'react-if'
import type { useNumberValidator } from '../hooks/useNumberValidator'
import ResultTable from './ResultTable'

interface Props {
  validator: ReturnType<typeof useNumberValidator>
  onShowUpgradeModal: (featureName: string, benefit: string) => void
}

const ResultsSection: React.FC<Props> = ({ validator, onShowUpgradeModal }) => {
  const [filter, setFilter] = useState('All')
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: 'number',
    direction: 'asc',
  })
  const clipboard = useClipboard({ timeout: 1000 })
  const license = useLicense()

  const stats = useMemo(() => {
    if (validator.results.length === 0)
      return { total: 0, valid: 0, invalid: 0 }
    return {
      total: validator.results.length,
      valid: validator.results.filter((r) => r.status === 'Valid').length,
      invalid: validator.results.filter((r) => r.status === 'Invalid').length,
    }
  }, [validator.results])

  const displayedResults = useMemo(() => {
    let filtered = validator.results
    if (filter !== 'All') {
      filtered = validator.results.filter((r) => r.status === filter)
    }
    return _.orderBy(
      filtered,
      [sortStatus.columnAccessor],
      //@ts-ignore
      [sortStatus.direction],
    )
  }, [validator.results, filter, sortStatus])

  const handleCopyToClipboard = (copyType: 'all' | 'valid' | 'invalid') => {
    const numbersToCopy =
      copyType === 'all'
        ? displayedResults.map((r) => r.number)
        : displayedResults
            .filter(
              (r) => r.status === (copyType === 'valid' ? 'Valid' : 'Invalid'),
            )
            .map((r) => r.number)

    if (numbersToCopy.length === 0) {
      toast.info(`No ${copyType} numbers to copy.`)
      return
    }
    clipboard.copy(numbersToCopy.join('\n'))
    toast.success(`${numbersToCopy.length} number(s) copied to clipboard!`)
  }

  const handleExportClick = (format: 'csv' | 'xlsx') => {
    if (license.isFree()) {
      onShowUpgradeModal(
        'Export Results',
        'Upgrade to Pro to export validation results to CSV or Excel for your marketing campaigns.',
      )
      return
    }
    validator.handleExport(displayedResults, format)
  }

  return (
    <Card withBorder p="lg" radius="md">
      <Stack>
        <Group justify="space-between">
          <Title order={4}>Results</Title>
          <Group>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  variant="light"
                  leftSection={<Icon icon="tabler:copy" />}
                  disabled={
                    displayedResults.length === 0 || validator.isValidating
                  }
                >
                  Copy Results
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => handleCopyToClipboard('all')}>
                  Copy All
                </Menu.Item>
                <Menu.Item onClick={() => handleCopyToClipboard('valid')}>
                  Copy Valid
                </Menu.Item>
                <Menu.Item onClick={() => handleCopyToClipboard('invalid')}>
                  Copy Invalid
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  variant="light"
                  leftSection={<Icon icon="tabler:download" />}
                  disabled={
                    displayedResults.length === 0 || validator.isValidating
                  }
                  rightSection={
                    <When condition={license.isFree()}>
                      <Badge size="sm" variant="light" color="teal">
                        PRO
                      </Badge>
                    </When>
                  }
                >
                  Export Results
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => handleExportClick('csv')}>
                  Export as CSV
                </Menu.Item>
                <Menu.Item onClick={() => handleExportClick('xlsx')}>
                  Export as Excel
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        {!validator.isValidating && validator.results.length > 0 && (
          <Group justify="space-between">
            <Group>
              <Badge size="lg">Total: {stats.total}</Badge>
              <Badge color="green" size="lg">
                Valid: {stats.valid}
              </Badge>
              <Badge color="red" size="lg">
                Invalid: {stats.invalid}
              </Badge>
            </Group>
            <SegmentedControl
              value={filter}
              onChange={setFilter}
              data={['All', 'Valid', 'Invalid']}
            />
          </Group>
        )}

        {validator.isValidating && (
          <Stack>
            <Text>
              Validating {validator.progress.current} of{' '}
              {validator.progress.total}...
            </Text>
            <Progress
              value={
                (validator.progress.current / validator.progress.total) * 100
              }
              animated
            />
          </Stack>
        )}

        <ScrollArea h={350}>
          <ResultTable
            records={displayedResults}
            //@ts-ignore
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
          />
        </ScrollArea>
      </Stack>
    </Card>
  )
}

export default ResultsSection
