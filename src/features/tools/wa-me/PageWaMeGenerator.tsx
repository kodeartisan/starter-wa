// src/features/Tools/WaMeGenerator/PageWaMeGenerator.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import React, { useState } from 'react'
import { When } from 'react-if'

/**
 * @component PageWaMeGenerator
 * @description A tool to generate WhatsApp "wa.me" click-to-chat links and corresponding QR codes.
 */
const PageWaMeGenerator: React.FC = () => {
  const [number, setNumber] = useState('')
  const [message, setMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const clipboard = useClipboard({ timeout: 1000 })

  /**
   * @description Handles the link generation logic.
   * It cleans the phone number, encodes the message, and constructs the final URL.
   */
  const handleGenerateLink = () => {
    if (!number) {
      toast.error('Phone number is required.')
      return
    }
    // Remove any non-digit characters from the number.
    const cleanedNumber = number.replace(/\D/g, '')
    // Encode the message for use in a URL.
    const encodedMessage = encodeURIComponent(message)
    const link = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`
    setGeneratedLink(link)
    toast.success('Link generated successfully!')
  }

  return (
    <LayoutPage title="WA.me Link Generator">
      <Stack>
        <Stack align="center" gap={4} mb="xl">
          <Icon
            icon="tabler:link"
            fontSize={48}
            color="var(--mantine-color-teal-6)"
          />
          <Title order={3} ta="center">
            WA.me Link Generator
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Create a WhatsApp click-to-chat link with a pre-filled message.
          </Text>
        </Stack>

        <Card withBorder p="lg" radius="md" shadow="none">
          <Stack>
            <TextInput
              label="WhatsApp Number"
              placeholder="e.g., 6281234567890"
              description="Enter the full number with country code, without '+' or spaces."
              value={number}
              onChange={(event) => setNumber(event.currentTarget.value)}
              required
            />
            <Textarea
              label="Pre-filled Message (Optional)"
              placeholder="Enter the message you want to pre-fill."
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
              minRows={4}
              autosize
            />
            <Group justify="flex-end" mt="md">
              <Button
                onClick={handleGenerateLink}
                leftSection={<Icon icon="tabler:refresh-dot" fontSize={20} />}
              >
                Generate Link
              </Button>
            </Group>
          </Stack>
        </Card>

        <When condition={generatedLink}>
          <Card withBorder p="lg" radius="md" mt="lg">
            <Stack align="center">
              <Title order={4}>Your Link is Ready!</Title>
              <TextInput
                w="100%"
                readOnly
                label="Generated Link"
                value={generatedLink}
                rightSection={
                  <Tooltip
                    label={clipboard.copied ? 'Copied!' : 'Copy Link'}
                    position="left"
                    withArrow
                  >
                    <ActionIcon
                      variant="subtle"
                      onClick={() => clipboard.copy(generatedLink)}
                    >
                      <Icon
                        icon={clipboard.copied ? 'tabler:check' : 'tabler:copy'}
                      />
                    </ActionIcon>
                  </Tooltip>
                }
              />
            </Stack>
          </Card>
        </When>
      </Stack>
    </LayoutPage>
  )
}

export default PageWaMeGenerator
