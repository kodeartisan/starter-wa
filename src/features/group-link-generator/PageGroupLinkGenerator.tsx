import LayoutPage from '@/components/Layout/LayoutPage'
import wa from '@/libs/wa'
import { useAppStore } from '@/stores/app'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import React, { useEffect, useMemo, useState } from 'react'
import { When } from 'react-if'

/**
 * @component PageGroupLinkGenerator
 * @description A tool to select a WhatsApp group and generate its invite link.
 */
const PageGroupLinkGenerator: React.FC = () => {
  const { groups } = useAppStore()
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [generatedLink, setGeneratedLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const clipboard = useClipboard({ timeout: 1000 })
  const [groupOptions, setGroupOptions] = useState<any[]>()

  // Format the group list from the store for the Select component
  // const groupOptions = useMemo(() => {
  //   return (
  //     groups
  //       ?.filter((group) => {
  //         return false
  //       })
  //       .map((group: any) => ({
  //         label: `${group.name} (${group.participants.length} members)`,
  //         value: group.id,
  //       })) || []
  //   )
  // }, [groups])

  useEffect(() => {
    console.log('groups', groups)
  }, [groups])

  /**
   * @description Fetches the invite link for the selected group.
   */
  const handleGenerateLink = async () => {
    if (!selectedGroupId) {
      toast.error('Please select a group first.')
      return
    }
    setIsLoading(true)
    setGeneratedLink('')
    try {
      // Fetch the invite link using the wa-js wrapper
      const link = await wa.group.getInviteLink(selectedGroupId)
      if (link) {
        setGeneratedLink(link)
        toast.success('Invite link generated successfully!')
      } else {
        toast.error(
          'Could not generate an invite link. You may not be an admin of this group.',
        )
      }
    } catch (error: any) {
      console.error('Failed to generate group link:', error)
      toast.error(error.message || 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LayoutPage>
      <Stack>
        <Stack align="center" gap={4} mb="xl">
          <Icon
            icon="tabler:ticket"
            fontSize={48}
            color="var(--mantine-color-teal-6)"
          />
          <Title order={3} ta="center">
            Group Invite Link Generator
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Quickly get the invite link for any of your WhatsApp groups.
          </Text>
        </Stack>

        <Paper withBorder p="lg" radius="md" shadow="none">
          <Stack>
            <Select
              label="Select a Group"
              placeholder="Choose a group from the list"
              data={groupOptions}
              value={selectedGroupId}
              onChange={setSelectedGroupId}
              searchable
              nothingFoundMessage="No groups found"
              disabled={isLoading || groups.length === 0}
            />
            <Group justify="flex-end" mt="md">
              <Button
                onClick={handleGenerateLink}
                loading={isLoading}
                disabled={!selectedGroupId}
                leftSection={<Icon icon="tabler:refresh-dot" fontSize={20} />}
              >
                Generate Link
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* This section appears only after a link has been generated */}
        <When condition={generatedLink}>
          <Card withBorder p="lg" radius="md" mt="lg">
            <Stack align="center">
              <Title order={4}>Your Invite Link is Ready!</Title>
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

export default PageGroupLinkGenerator
