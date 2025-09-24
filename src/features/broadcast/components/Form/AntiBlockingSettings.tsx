// src/features/broadcast/components/Form/AntiBlockingSettings.tsx
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Fieldset,
  Group,
  NumberInput,
  Popover,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTyping from '../Input/InputTyping'

interface Props {
  form: UseFormReturnType<any>
}

/**
 * @component AntiBlockingSettings
 * @description A sub-component for ModalCreateBroadcast that groups all anti-blocking settings.
 * This includes delay settings and typing effect.
 */
const AntiBlockingSettings: React.FC<Props> = ({ form }) => {
  return <Stack></Stack>
}

export default AntiBlockingSettings
