// English: A simple, professional icon wrapper for branding.
// This component is reusable for generating different icon sizes and types.
import { Icon } from '@iconify/react'
import { ThemeIcon } from '@mantine/core'
import React from 'react'

interface Props {
  size: number
  icon: string
}

const PromoIcon: React.FC<Props> = ({ size, icon }) => {
  return (
    <ThemeIcon
      size={size}
      radius="lg"
      variant="gradient"
      gradient={{ from: 'teal', to: 'lime', deg: 105 }}
    >
      {/* Use the Icon component for dynamic icon rendering */}
      <Icon
        icon={icon}
        style={{ width: '70%', height: '70%', color: 'white' }}
      />
    </ThemeIcon>
  )
}

export default PromoIcon
