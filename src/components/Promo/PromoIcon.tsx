// English: A simple, professional SVG icon for branding.
// This component is reusable for generating different icon sizes.
import { ThemeIcon } from '@mantine/core'
import React from 'react'

interface Props {
  size: number
}

const PromoIcon: React.FC<Props> = ({ size }) => {
  return (
    <ThemeIcon
      size={size}
      radius="lg"
      variant="gradient"
      gradient={{ from: 'teal', to: 'lime', deg: 105 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '70%', height: '70%', color: 'white' }}
      >
        <path d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8.08a2 2 0 0 0-1.67.9l-.81 1.2a2 2 0 0 1-1.69.9H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16z" />
        <path d="M12 12.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z" />
        <path d="M12 19H6a2 2 0 0 1-2-2V9" />
        <path d="M18 17v-2a2 2 0 0 0-2-2h-4" />
      </svg>
    </ThemeIcon>
  )
}

export default PromoIcon
