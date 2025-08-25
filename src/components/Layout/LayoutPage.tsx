// src/components/Layout/LayoutPage.tsx
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import env from '@/utils/env'
import { goToLandingPage } from '@/utils/util'
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

  const renderBody = () => {
    return (
      <Stack px={'xl'} py={'md'} w={width}>
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
          {/* MODIFIED: Changed button text to be more benefit-focused. */}
          <When condition={license.isFree()}>
            <Button
              variant="filled"
              color="yellow"
              size="xs"
              radius="md"
              leftSection={<Icon icon="tabler:crown" fontSize={16} />}
              onClick={goToLandingPage}
            >
              Go Pro
            </Button>
          </When>
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
