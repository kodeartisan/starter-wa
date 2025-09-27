// src/components/Layout/LayoutPage.tsx
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import env from '@/utils/env'
import { closePage, goToResourcePage, showModalPricing } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
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
  height = 700,
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
          py={'xs'}
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
            <Title order={4} ml={2}>
              {title ? title : packageJson.displayName}
            </Title>
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
          </Group>
          <Group>
            <When condition={license.isFree() ?? true}>
              <Button
                variant="filled"
                color="yellow"
                size="xs"
                radius="md"
                leftSection={<Icon icon="tabler:crown" fontSize={16} />}
                onClick={showModalPricing}
              >
                Upgrade Now
              </Button>
            </When>
            <ActionIcon variant="transparent" color="red" onClick={closePage}>
              <Icon icon="tabler:x" />
            </ActionIcon>
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
