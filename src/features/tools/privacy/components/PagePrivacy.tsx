import LayoutPage from '@/components/Layout/LayoutPage'
import { Setting } from '@/constants'
import { Card, Divider, Group, Stack, Switch, Text, Title } from '@mantine/core'
import { useStorage } from '@plasmohq/storage/hook'
import React, { useEffect, useState } from 'react'

const PagePrivacy: React.FC = () => {
  const [blurProfilePictures, setBlurProfilePictures] = useStorage(
    Setting.BLUR_PROFILE_PICTURES,
    false,
  )
  const [blurMessages, setBlurMessages] = useStorage(
    Setting.BLUR_MESSAGES,
    false,
  )
  const [blurUserGroupNames, setBlurUserGroupNames] = useStorage(
    Setting.BLUR_USER_GROUP_NAMES,
    false,
  )
  const [blurRecentMessages, setBlurRecentMessages] = useStorage(
    Setting.BLUR_RECENT_MESSAGES,
    false,
  )
  const [allSwitchesEnabled, setAllSwitchesEnabled] = useState(false)

  useEffect(() => {
    const allEnabled =
      blurProfilePictures &&
      blurMessages &&
      blurUserGroupNames &&
      blurRecentMessages
    setAllSwitchesEnabled(allEnabled)
  }, [
    blurProfilePictures,
    blurMessages,
    blurUserGroupNames,
    blurRecentMessages,
  ])

  const handleToggleAll = async (checked: boolean) => {
    setAllSwitchesEnabled(checked)
    await Promise.all([
      setBlurProfilePictures(checked),
      setBlurMessages(checked),
      setBlurUserGroupNames(checked),
      setBlurRecentMessages(checked),
    ])
  }

  const handleIndividualSwitchChange = async (
    setter: (value: boolean) => Promise<void>,
    checked: boolean,
  ) => {
    await setter(checked)
    if (!checked) {
      setAllSwitchesEnabled(false)
    }
  }

  const privacyOptions = [
    {
      label: 'Profile Pictures',
      description: 'Blur all contact and group profile pictures.',
      checked: blurProfilePictures,
      setter: setBlurProfilePictures,
    },
    {
      label: 'User/Group Names',
      description: 'Blur names in the chat list and chat header.',
      checked: blurUserGroupNames,
      setter: setBlurUserGroupNames,
    },
    {
      label: 'Recent Messages',
      description: 'Blur the last message preview in the chat list.',
      checked: blurRecentMessages,
      setter: setBlurRecentMessages,
    },
    {
      label: 'Messages',
      description: 'Blur all messages in the active chat view.',
      checked: blurMessages,
      setter: setBlurMessages,
    },
  ]

  return (
    <LayoutPage title="Privacy">
      <Stack>
        <Card withBorder radius="md" shadow="none">
          <Stack>
            <Title order={4}>Content Blurring</Title>
            <Text c="dimmed" size="sm">
              Enhance your privacy by blurring different parts of the WhatsApp
              interface.
            </Text>

            <Divider my="sm" />

            <Group justify="space-between">
              <Text fw={500}>Blur Everything</Text>
              <Switch
                aria-label="Toggle all privacy settings"
                checked={allSwitchesEnabled}
                onChange={async (event) => {
                  await handleToggleAll(event.currentTarget.checked)
                }}
              />
            </Group>

            <Divider my="sm" />

            <Stack gap="md">
              {privacyOptions.map((option, index) => (
                <Group justify="space-between" key={index} wrap="nowrap">
                  <Stack gap={0}>
                    <Text fw={500}>{option.label}</Text>
                    <Text size="xs" c="dimmed">
                      {option.description}
                    </Text>
                  </Stack>
                  <Switch
                    aria-label={`Toggle ${option.label}`}
                    checked={option.checked}
                    onChange={async (event) => {
                      await handleIndividualSwitchChange(
                        option.setter,
                        event.currentTarget.checked,
                      )
                    }}
                  />
                </Group>
              ))}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </LayoutPage>
  )
}

export default PagePrivacy
