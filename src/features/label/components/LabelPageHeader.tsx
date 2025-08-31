// src/features/label/components/LabelPageHeader.tsx
import { useDataQuery } from '@/hooks/useDataQuery'
import type { Label } from '@/libs/db'
import { Icon } from '@iconify/react'
import { Button, Group, TextInput } from '@mantine/core'
import React from 'react'
import LabelFilters from './LabelFilters'

interface Props {
  dataQuery: ReturnType<typeof useDataQuery<Label>>
  onAdd: () => void
  onBackup: () => void
  onRestore: () => void
}

/**
 * A memoized component for the header section of the label management page.
 * It contains search, filtering, and primary actions to prevent re-renders.
 */
const LabelPageHeader: React.FC<Props> = ({
  dataQuery,
  onAdd,
  onBackup,
  onRestore,
}) => {
  return (
    <Group justify="space-between">
      {/* Left side: Search and Filters */}
      <Group>
        <TextInput
          placeholder="Search by label name..."
          value={dataQuery.search}
          size="sm"
          onChange={(e) => dataQuery.setSearch(e.currentTarget.value)}
          leftSection={<Icon icon="tabler:search" fontSize={16} />}
          style={{ flex: 1, minWidth: 250 }}
        />
        <LabelFilters dataQuery={dataQuery} />
      </Group>

      {/* Right side: Action Buttons */}
      <Group>
        <Button
          variant="default"
          leftSection={<Icon icon="tabler:file-import" fontSize={18} />}
          onClick={onRestore}
        >
          Restore
        </Button>
        <Button
          variant="default"
          leftSection={<Icon icon="tabler:file-export" fontSize={18} />}
          onClick={onBackup}
        >
          Backup
        </Button>
        <Button
          leftSection={<Icon icon="tabler:plus" fontSize={18} />}
          onClick={onAdd}
        >
          Add Label
        </Button>
      </Group>
    </Group>
  )
}

export default React.memo(LabelPageHeader)
