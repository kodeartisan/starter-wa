// src/components/Input/InputSelectGroup.tsx
import { useAppStore } from '@/stores/app'
import { Avatar, Group, MultiSelect, Text } from '@mantine/core'
import React, { useMemo } from 'react'

interface Props {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  filter?: (group: any) => boolean
}

const InputSelectGroup: React.FC<Props> = ({
  value,
  onChange,
  disabled,
  filter,
}) => {
  const { groups } = useAppStore()

  const groupOptions = useMemo(() => {
    const filteredGroups = filter ? groups?.filter(filter) : groups
    return (
      filteredGroups?.map((group: any) => ({
        label: `${group.name} (${group.participants.length})`,
        value: group.id,
        avatar: group.avatar,
      })) || []
    )
  }, [groups, filter])

  const renderSelectOption = ({
    option,
  }: {
    option: any & { avatar: string }
  }) => (
    <Group>
      <Avatar src={option.avatar} radius="xl" />
      <Text>{option.label}</Text>
    </Group>
  )

  return (
    <MultiSelect
      label="Select Group(s)"
      placeholder="Choose one or more groups from the list"
      data={groupOptions}
      value={value}
      onChange={onChange}
      disabled={disabled || (groups && groups.length === 0)}
      searchable
      nothingFoundMessage="No groups found"
      renderOption={renderSelectOption}
      clearable
    />
  )
}

export default InputSelectGroup
