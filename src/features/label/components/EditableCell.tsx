// src/features/label/components/EditableCell.tsx
import { Loader, TextInput, Tooltip } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  value: string
  onSave: (newValue: string) => Promise<void>
  children: React.ReactNode
}

/**
 * A reusable component that displays a value and provides an inline editing
 * experience on double-click.
 */
const EditableCell: React.FC<Props> = ({ value, onSave, children }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setCurrentValue(value)
    setIsEditing(true)
  }

  const handleSave = async () => {
    // Avoid saving if the value hasn't changed
    if (currentValue.trim() === value.trim()) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      await onSave(currentValue)
    } catch (error) {
      // The parent component will show an error toast. Revert value on failure.
      setCurrentValue(value)
    } finally {
      setIsLoading(false)
      setIsEditing(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave()
    } else if (event.key === 'Escape') {
      setIsEditing(false)
      setCurrentValue(value)
    }
  }

  if (isEditing) {
    return (
      <TextInput
        ref={inputRef}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.currentTarget.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        rightSection={isLoading ? <Loader size="xs" /> : null}
        onClick={(e) => e.stopPropagation()} // Prevent row click events
      />
    )
  }

  return (
    <Tooltip label="Double-click to edit" openDelay={500} withArrow>
      <div
        onDoubleClick={handleDoubleClick}
        style={{ cursor: 'pointer', width: '100%', minHeight: '22px' }}
      >
        {children}
      </div>
    </Tooltip>
  )
}

export default React.memo(EditableCell)
