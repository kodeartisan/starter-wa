// src/components/Layout/LayoutPage.tsx
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import env from '@/utils/env'
import {
  goToResourcePage,
  showModalActivation,
  showModalFaq,
  showModalPricing,
  showModalProfile,
} from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
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
  width = 700,
  height = 570,
  p = 'xl',
  children,
  title = null,
}: Props) => {
  const wa = useWa()
  const license = useLicense()

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
          py={'md'}
          className={classes.header}
        >
          <Group gap={6}>
            <img
              width={38}
              height={38}
              src={icon}
              style={{
                borderRadius: 10,
              }}
            />
            <Group gap={4}>
              <Title order={3} ml={2}>
                {title ? title : packageJson.shortName}
              </Title>
              <Badge mb={16}>{packageJson.version}</Badge>
            </Group>
            <When condition={license.isPro() && env.isProduction()}>
              <Button
                variant="filled"
                color="blue"
                size="xs"
                radius="md"
                onClick={goToResourcePage}
              >
                RS
              </Button>
            </When>
          </Group>
          <Group gap={3}>
            <When condition={env.isDevelopment()}>
              <Button
                variant="filled"
                color="blue"
                size="xs"
                radius="md"
                onClick={goToResourcePage}
              >
                RS
              </Button>
            </When>
            <Tooltip label="Contact Us" position="top">
              <ActionIcon
                variant="subtle"
                color="#767677"
                size={36}
                href="mailto:extdotninja@gmail.com"
                rel="noopener noreferrer"
                component="a"
              >
                <Icon icon="tabler:mail" fontSize={30} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Help" position="top">
              <ActionIcon
                variant="subtle"
                color="#767677"
                size={36}
                onClick={showModalFaq}
              >
                <Icon icon="tabler:help" fontSize={30} />
              </ActionIcon>
            </Tooltip>
            <When condition={license.isPro()}>
              <Tooltip label="Profile" position="top">
                <ActionIcon
                  variant="subtle"
                  color="#767677"
                  size={36}
                  onClick={showModalProfile}
                >
                  <Icon icon="tabler:user" fontSize={30} />
                </ActionIcon>
              </Tooltip>
            </When>
            <When condition={license.isFree()}>
              <Tooltip label="Activate" position="top">
                <ActionIcon
                  variant="subtle"
                  color="#767677"
                  size={36}
                  onClick={showModalActivation}
                >
                  <Icon icon="tabler:key" fontSize={30} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Upgrade now" position="top">
                <ActionIcon
                  variant="subtle"
                  color="yellow"
                  size={36}
                  onClick={showModalPricing}
                >
                  <Icon icon="tabler:crown" fontSize={32} />
                </ActionIcon>
              </Tooltip>
            </When>
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
