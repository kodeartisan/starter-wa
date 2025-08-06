import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Box,
  Card,
  Paper,
  type MantineSpacing,
  type StyleProp,
} from '@mantine/core'
import React, { type CSSProperties } from 'react'
import { When } from 'react-if'

interface Props {
  opened: boolean
  onClose: () => void
  height?: string | number
  width?: string | number
  style?: CSSProperties
  withCloseButton?: boolean | false
  h?: StyleProp<React.CSSProperties['height']>
  w?: StyleProp<React.CSSProperties['width']>
  p?: StyleProp<MantineSpacing>
  children: React.ReactNode
}

const Modal: React.FC<Props> = ({
  opened,
  onClose,
  style = {},
  withCloseButton = false,
  p = 'lg',
  h,
  w,
  children,
  ...rest
}: Props) => {
  if (!opened) return null
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 399,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          opacity: '0.15',
        }}
        onClick={onClose}
      ></div>
      <Box
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1050,
          ...style,
        }}
        {...rest}
      >
        <Card shadow={'xs'} p={p} w={w} h={h} radius={'md'}>
          <When condition={withCloseButton}>
            <ActionIcon
              onClick={onClose}
              color="red"
              variant="transparent"
              style={{
                position: 'absolute',
                right: 3,
                top: 1,
              }}
            >
              <Icon icon="tabler:x" fontSize={16} />
            </ActionIcon>
            <Box mb={'md'} />
          </When>

          {children}
        </Card>
      </Box>
    </>
  )
}

export default Modal
