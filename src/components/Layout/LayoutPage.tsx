import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import { useAppStore } from '@/stores/app'
import env from '@/utils/env'
import {
  showModalActivation,
  showModalFaq,
  showModalProfile,
  showModalUpgrade,
} from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
  Menu,
  ScrollArea,
  Stack,
  Text,
  Title,
  type MantineSpacing,
  type StyleProp,
} from '@mantine/core'
import icon from 'data-base64:../../../assets/icon.png'
import { When } from 'react-if'
import packageJson from '../../../package.json'
import classes from './LayoutPage.module.css'

interface Props {
  width?: StyleProp<React.CSSProperties['width']> | null
  height?: StyleProp<React.CSSProperties['height']> | null
  p?: StyleProp<MantineSpacing>
  title?: string | null
  children: React.ReactNode
}

const LayoutPage: React.FC<Props> = ({
  width = 900,
  height = 620,
  p = 'xl',
  children,
  title = null,
}: Props) => {
  const wa = useWa()
  const license = useLicense()

  const handleDeactivate = async () => {
    if (
      confirm(
        'Are you sure you want to deactivate your license on this device?',
      )
    ) {
      await license.deactivate()
    }
  }

  const renderBody = () => {
    return (
      <Stack p={'xl'} w={width}>
        {children}
      </Stack>
    )
  }

  return (
    <>
      <Stack w={width} gap={0}>
        <Group
          justify="space-between"
          px={'lg'}
          py={'sm'}
          className={classes.header}
        >
          <Group gap={6}>
            <img
              width={32}
              height={32}
              src={icon}
              style={{
                borderRadius: 10,
              }}
            />
            <Title order={3} ml={2}>
              {title ? title : packageJson.displayName}
            </Title>
            <When condition={license.isPro() && env.isProduction()}>
              <Button
                radius={'lg'}
                size="compact-sm"
                variant="outline"
                px={'sm'}
              >
                <Text fw={500}>Pro</Text>
              </Button>
            </When>
          </Group>
          <Group>
            <When condition={license.isFree()}>
              <Button
                variant="filled"
                size="xs"
                color="yellow"
                onClick={showModalUpgrade}
                leftSection={<Icon icon={'tabler:crown'} fontSize={24} />}
              >
                Upgrade
              </Button>
            </When>

            <Menu width={220}>
              <Menu.Target>
                <ActionIcon variant="transparent">
                  <Icon
                    icon="tabler:dots-vertical"
                    color="white"
                    fontSize={22}
                  />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <Icon icon="tabler:user-square-rounded" fontSize={22} />
                  }
                  onClick={showModalProfile}
                >
                  <Text>Profile</Text>
                </Menu.Item>
                <When condition={license.isFree()}>
                  <Menu.Item
                    leftSection={<Icon icon="tabler:key" fontSize={22} />}
                    onClick={showModalActivation}
                  >
                    <Text>Activate</Text>
                  </Menu.Item>
                </When>
                <When condition={license.isPro()}>
                  <Menu.Item
                    leftSection={<Icon icon="tabler:key" fontSize={22} />}
                    onClick={handleDeactivate}
                  >
                    <Text>Deactivate</Text>
                  </Menu.Item>
                </When>
                <When condition={license.isPro()}>
                  <Menu.Item
                    leftSection={
                      <Icon icon="tabler:credit-card" fontSize={22} />
                    }
                    onClick={license.goToMyOrders}
                  >
                    <Text>Manage Subscription</Text>
                  </Menu.Item>
                </When>
                <Menu.Item
                  leftSection={
                    <Icon icon="tabler:world-question" fontSize={20} />
                  }
                  onClick={showModalFaq}
                >
                  <Text>Faqs</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        {wa.isReady ? (
          <ScrollArea h={height}>{renderBody()}</ScrollArea>
        ) : (
          <Center h={height}>
            <Loader />
          </Center>
        )}
      </Stack>
    </>
  )
}

export default LayoutPage
