// src/features/broadcast/components/Form/SignatureSettings.tsx
import { Setting } from '@/constants'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Group,
  Popover,
  Stack,
  Switch,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core'
import { useStorage } from '@plasmohq/storage/hook'
import React from 'react'

/**
 * @component SignatureSettings
 * @description A component for managing a persistent message signature for broadcasts.
 * It allows users to enable/disable and edit a signature that is automatically
 * appended to their messages.
 */
const SignatureSettings: React.FC = () => {
  const [signatureEnabled, setSignatureEnabled] = useStorage(
    Setting.SIGNATURE_ENABLED,
    false,
  )
  const [signatureText, setSignatureText] = useStorage(
    Setting.SIGNATURE_TEXT,
    '',
  )

  return (
    <Stack>
      <Tooltip
        label="Automatically append a signature to the end of your text messages or media captions."
        refProp="rootRef"
        position="top-start"
      >
        <Switch
          label={<Text fw={500}>Enable signature</Text>}
          checked={signatureEnabled}
          onChange={(event) => setSignatureEnabled(event.currentTarget.checked)}
        />
      </Tooltip>

      {signatureEnabled && (
        <Textarea
          placeholder="e.g., Best regards, Your Name"
          value={signatureText}
          onChange={(event) => setSignatureText(event.currentTarget.value)}
          autosize
          minRows={2}
        />
      )}
    </Stack>
  )
}

export default SignatureSettings
