// src/features/broadcast/components/Input/InputTextarea.tsx
import { Status } from '@/constants'
import useAi from '@/hooks/useAi'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Menu,
  Popover,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core'
import EmojiPicker from 'emoji-picker-react'
import React, { useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  error?: any
  placeholder?: string | null
  variables?: { label: string; variable: string; tooltip?: string }[]
}

const InputTextarea: React.FC<Props> = ({
  value,
  onChange,
  error = null,
  placeholder = 'Enter your message here',
  variables = [],
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [emojiPickerOpened, setEmojiPickerOpened] = useState<boolean>(false)
  const ai = useAi()
  const [isRewriting, setIsRewriting] = useState(false)

  const applyFormat = (startTag: string, endTag: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText =
      value.substring(0, start) +
      startTag +
      (selectedText || '') +
      endTag +
      value.substring(end)
    onChange(newText)

    setTimeout(() => {
      if (textarea) {
        const newPosition = start + startTag.length + (selectedText.length || 0)
        textarea.focus()
        textarea.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }

  const handleEmojiSelect = (emojiData: any) => {
    applyFormat(emojiData.emoji)
    setEmojiPickerOpened(false)
  }

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = value.substring(0, start) + variable + value.substring(end)
    onChange(newText)

    setTimeout(() => {
      if (textarea) {
        const newPosition = start + variable.length
        textarea.focus()
        textarea.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }

  const handleAiRewrite = async (rewriteType: string) => {
    if (!value) {
      toast.error('Please enter a message to rewrite.')
      return
    }
    const prompts: Record<string, string> = {
      professional: 'Rewrite the following message to be more professional',
      friendly: 'Rewrite the following message to be more friendly and casual',
      fix_grammar:
        'Correct any spelling and grammar mistakes in the following message',
    }
    const prompt = prompts[rewriteType]
    if (!prompt) return

    setIsRewriting(true)
    try {
      const result = await ai.rewriteMessage(prompt, value)
      if (result.status === Status.SUCCESS && result.data) {
        onChange(result.data)
      } else {
        toast.error(result.error || 'Failed to rewrite message.')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred.')
    } finally {
      setIsRewriting(false)
    }
  }

  const renderEmojiToolbar = () => {
    return (
      <Popover
        opened={emojiPickerOpened}
        onChange={setEmojiPickerOpened}
        position="right-end"
      >
        <Popover.Target>
          <Tooltip label="Emoji" position="top">
            <ActionIcon
              onClick={() => setEmojiPickerOpened((o) => !o)}
              variant="subtle"
            >
              <Icon icon="tabler:mood-smile" width={16} />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown p={0}>
          <EmojiPicker
            width={350}
            height={370}
            onEmojiClick={handleEmojiSelect}
            searchDisabled
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
          />
        </Popover.Dropdown>
      </Popover>
    )
  }

  return (
    <Stack gap={3} mt={'sm'}>
      <Group justify="space-between">
        <Group gap={6}>
          <Tooltip label="Italic" position="top">
            <ActionIcon onClick={() => applyFormat('_', '_')} variant="subtle">
              <Icon icon="tabler:italic" fontSize={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Bold" position="top">
            <ActionIcon onClick={() => applyFormat('*', '*')} variant="subtle">
              <Icon icon="tabler:bold" width={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Strikethrough" position="top">
            <ActionIcon onClick={() => applyFormat('~', '~')} variant="subtle">
              <Icon icon="tabler:strikethrough" width={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Monospace" position="top">
            <ActionIcon
              onClick={() => applyFormat('```', '```')}
              variant="subtle"
            >
              <Icon icon="tabler:code" width={18} />
            </ActionIcon>
          </Tooltip>
          {renderEmojiToolbar()}
        </Group>
      </Group>
      <Box style={{ position: 'relative' }}>
        <LoadingOverlay
          visible={isRewriting}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 1 }}
        />
        <Stack gap={8}>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder={
              placeholder ||
              'Write a message... You can use {name} to personalize.'
            }
            minRows={6}
            autosize
            styles={{
              input: {
                ...(error ? { borderColor: 'red', borderWidth: '1px' } : {}),
                transition: 'border-color 0.3s ease',
              },
            }}
          />
          {variables.length > 0 && (
            <Group mb={4}>
              {variables.map((variable, index) =>
                variable.tooltip ? (
                  <Tooltip
                    key={index}
                    label={variable.tooltip}
                    withArrow
                    position="top"
                    multiline
                    w={220}
                  >
                    <Button
                      variant="outline"
                      size="compact-xs"
                      onClick={() => insertVariable(variable.variable)}
                    >
                      {variable.label}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    key={index}
                    variant="outline"
                    size="compact-xs"
                    onClick={() => insertVariable(variable.variable)}
                  >
                    {variable.label}
                  </Button>
                ),
              )}
            </Group>
          )}
        </Stack>
      </Box>
      {error && (
        <Text c="red" size="sm">
          {' '}
          {error}{' '}
        </Text>
      )}
    </Stack>
  )
}

export default InputTextarea
