// src/features/label/components/LabelFilters.tsx
import type { Filter } from '@/hooks/useDataQuery'
import { useDataQuery } from '@/hooks/useDataQuery'
import db, { type Label } from '@/libs/db'
import { Icon } from '@iconify/react'
import {
  Button,
  ColorSwatch,
  Group,
  Input,
  NumberInput,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { useLiveQuery } from 'dexie-react-hooks'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'

interface Props {
  dataQuery: ReturnType<typeof useDataQuery<Label>>
}

const contactFilterOptions: any = [
  { value: 'any', label: 'Any' },
  { value: 'none', label: 'No Contacts' },
  { value: 'has', label: 'Has Contacts' },
  { value: 'more_than', label: 'More Than...' },
]

const LabelFilters: React.FC<Props> = ({ dataQuery }) => {
  const allLabels = useLiveQuery(() => db.labels.toArray())
  const [popoverOpened, setPopoverOpened] = useState(false)

  const [contactFilterType, setContactFilterType] = useState('any')
  const [contactCount, setContactCount] = useState<string | number>(0)

  // Memoize unique groups and colors to prevent re-calculation on every render
  const { uniqueGroups, uniqueColors } = useMemo(() => {
    const groups = _.uniq(
      allLabels?.map((l) => l.group).filter(Boolean),
    ) as string[]
    const colors = _.uniq(
      allLabels?.map((l) => l.color).filter(Boolean),
    ) as string[]
    return {
      uniqueGroups: groups.map((g) => ({ value: g, label: g })),
      uniqueColors: colors,
    }
  }, [allLabels])

  const activeFiltersCount = dataQuery.filters.length

  const handleFilterChange = (
    field: string,
    operator: Filter['operator'],
    value: any,
  ) => {
    if (value === null || value === '' || value === 'any') {
      dataQuery.removeFilter(field)
    } else {
      dataQuery.updateFilter({ field, operator, value })
    }
  }

  const handleContactFilterChange = (type: string | null) => {
    setContactFilterType(type || 'any')
    switch (type) {
      case 'none':
        handleFilterChange('numbers', 'isEmpty', true)
        break
      case 'has':
        handleFilterChange('numbers', 'isNotEmpty', true)
        break
      case 'more_than':
        handleFilterChange(
          'numbers',
          'countGreaterThan',
          Number(contactCount) || 0,
        )
        break
      default:
        dataQuery.removeFilter('numbers')
        break
    }
  }

  const handleContactCountChange = (value: string | number) => {
    setContactCount(value)
    if (contactFilterType === 'more_than') {
      handleFilterChange('numbers', 'countGreaterThan', Number(value) || 0)
    }
  }

  const handleClearFilters = () => {
    dataQuery.clearFilters()
    setContactFilterType('any')
    setContactCount(0)
    setPopoverOpened(false)
  }

  return (
    <Popover
      width={300}
      trapFocus
      position="bottom-end"
      withArrow
      shadow="md"
      opened={popoverOpened}
      onChange={setPopoverOpened}
    >
      <Popover.Target>
        <Button
          variant="default"
          leftSection={<Icon icon="tabler:filter" fontSize={16} />}
          rightSection={
            activeFiltersCount > 0 ? (
              <Text size="xs" c="blue" fw={700}>
                {activeFiltersCount}
              </Text>
            ) : null
          }
          onClick={() => setPopoverOpened((o) => !o)}
        >
          Filters
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Select
            label="Filter by Group"
            placeholder="Select a group"
            data={uniqueGroups}
            onChange={(value) => handleFilterChange('group', 'equals', value)}
            value={
              dataQuery.filters.find((f) => f.field === 'group')?.value || null
            }
            clearable
          />

          <div>
            <Input.Label>Filter by Color</Input.Label>
            <SimpleGrid cols={5} mt={4} spacing="xs">
              {uniqueColors.map((color) => (
                <ColorSwatch
                  key={color}
                  color={color}
                  onClick={() => handleFilterChange('color', 'equals', color)}
                  style={{
                    cursor: 'pointer',
                    outline:
                      dataQuery.filters.find((f) => f.field === 'color')
                        ?.value === color
                        ? `2px solid var(--mantine-primary-color-filled)`
                        : 'none',
                  }}
                />
              ))}
            </SimpleGrid>
          </div>

          <Select
            label="Filter by Contacts"
            data={contactFilterOptions}
            value={contactFilterType}
            onChange={handleContactFilterChange}
          />

          {contactFilterType === 'more_than' && (
            <NumberInput
              placeholder="Enter number"
              value={contactCount}
              onChange={handleContactCountChange}
              min={0}
            />
          )}

          <Group justify="space-between" mt="md">
            <Button
              variant="transparent"
              size="sm"
              onClick={handleClearFilters}
              disabled={activeFiltersCount === 0}
            >
              Clear All
            </Button>
            <Button size="sm" onClick={() => setPopoverOpened(false)}>
              Done
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default LabelFilters
