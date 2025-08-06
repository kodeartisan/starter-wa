// src/features/profile/PageProfile.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import { Setting } from '@/constants'
import useLicense from '@/hooks/useLicense'
import { useAppStore } from '@/stores/app'
import { showModalActivation, showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useStorage } from '@plasmohq/storage/hook'
import dayjs from 'dayjs'
import React from 'react'
import { When } from 'react-if'
import packageJson from '../../../package.json'

const PageProfile: React.FC = () => {
  const license = useLicense()
  const { profile, license: licenseData } = useAppStore()
  const [licenseKey] = useStorage(Setting.LICENSE_KEY)

  const handleDeactivate = async () => {
    if (
      confirm(
        'Are you sure you want to deactivate your license on this device?',
      )
    ) {
      await license.deactivate()
    }
  }

  const handleUpgrade = () => {
    showModalUpgrade()
  }

  const handleActivate = () => {
    showModalActivation()
  }

  const maskLicenseKey = (key: string | undefined | null) => {
    if (!key) return 'N/A'
    const keyParts = key.split('-')
    if (keyParts.length > 1) {
      return `****-****-****-${keyParts[keyParts.length - 1]}`
    }
    return '****' + key.slice(-4)
  }

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: string
    label: string
    value: React.ReactNode
  }) => (
    <Group wrap="nowrap" gap="lg">
      <ThemeIcon variant="light" size={36} radius="md">
        <Icon icon={icon} fontSize={20} />
      </ThemeIcon>
      <div>
        <Text size="xs" c="dimmed">
          {label}
        </Text>
        <Text size="sm" fw={500}>
          {value || '-'}
        </Text>
      </div>
    </Group>
  )

  return (
    <LayoutPage title="My Profile">
      <Stack>
        {/* Account Details */}
        <Card withBorder radius="md" p="md" shadow="none">
          <Stack>
            <Title order={5}>Account Details</Title>
            <Divider />
            <InfoItem
              icon="tabler:device-mobile"
              label="Number"
              value={profile?.number}
            />
            <InfoItem
              icon="tabler:map-pin"
              label="Country"
              value={profile?.country}
            />
            <InfoItem
              icon="tabler:building-store"
              label="Account Type"
              value={profile?.type}
            />
            <InfoItem
              icon="tabler:info-circle"
              label="App Version"
              value={packageJson.version}
            />
          </Stack>
        </Card>

        {/* License Details */}
        <Card withBorder radius="md" p="md" shadow="none">
          <Stack>
            <Group justify="space-between">
              <Title order={5}>License Status</Title>
              <Badge
                color={license.isPro() ? 'teal' : 'gray'}
                size="lg"
                variant="filled"
              >
                {license.isPro() ? 'Pro' : 'Free'}
              </Badge>
            </Group>
            <Divider />
            <When condition={license.isPro()}>
              <Stack my="xs" gap="sm">
                <InfoItem
                  icon="tabler:user"
                  label="Licensed To"
                  value={licenseData?.meta.customer_name}
                />
                <InfoItem
                  icon="tabler:mail"
                  label="Email"
                  value={licenseData?.meta.customer_email}
                />
                <InfoItem
                  icon="tabler:key"
                  label="License Key"
                  value={maskLicenseKey(licenseKey)}
                />
                <InfoItem
                  icon="tabler:calendar-event"
                  label="Expires On"
                  value={
                    licenseData?.license_key.expires_at
                      ? dayjs(licenseData.license_key.expires_at).format(
                          'DD MMMM YYYY',
                        )
                      : 'Lifetime'
                  }
                />
              </Stack>
            </When>
            <Text size="sm" c="dimmed">
              {license.isPro()
                ? 'Thank you for being a Pro user! You have access to all features.'
                : 'Upgrade to Pro to unlock all features.'}
            </Text>
            <Group justify="flex-end" mt="md">
              <When condition={license.isFree()}>
                <Button
                  onClick={handleUpgrade}
                  color="teal"
                  leftSection={<Icon icon="tabler:crown" fontSize={18} />}
                >
                  Upgrade to Pro
                </Button>
                <Button
                  onClick={handleActivate}
                  variant="outline"
                  leftSection={<Icon icon="tabler:key" fontSize={18} />}
                >
                  Activate License
                </Button>
              </When>
              <When condition={license.isPro()}>
                <Button
                  onClick={license.goToMyOrders}
                  variant="outline"
                  leftSection={<Icon icon="tabler:credit-card" fontSize={18} />}
                >
                  Manage Subscription
                </Button>
                <Button
                  onClick={handleDeactivate}
                  color="red"
                  variant="light"
                  leftSection={<Icon icon="tabler:key-off" fontSize={18} />}
                >
                  Deactivate License
                </Button>
              </When>
            </Group>
          </Stack>
        </Card>

        <Card withBorder radius="md" p="md" shadow="none">
          <Stack>
            <Group justify="space-between">
              <Title order={5}>Data Privacy Guarantee</Title>
              <ThemeIcon variant="light" color="teal">
                <Icon icon="tabler:shield-check" fontSize={20} />
              </ThemeIcon>
            </Group>
            <Divider />
            <Text size="sm" c="dimmed">
              All your data is stored only on your computer and is never sent to
              our servers. You have 100% control over your data.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </LayoutPage>
  )
}

export default PageProfile
