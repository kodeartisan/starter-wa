// src/components/Modal/ModalQRCode.tsx
import Modal from '@/components/Modal/Modal'
import { Icon } from '@iconify/react'
import { Button, Center, Stack, Title } from '@mantine/core'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import { QRCodeCanvas } from 'qrcode.react'
import React, { useRef } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  link: string
  groupName: string
}

/**
 * @component ModalQRCode
 * @description A modal to display and download a QR code for a given link.
 */
const ModalQRCode: React.FC<Props> = ({ opened, onClose, link, groupName }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null)

  /**
   * @description Generates a canvas from the QR code element and triggers a download.
   */
  const handleDownload = async () => {
    if (!qrCodeRef.current) return
    try {
      const canvas = await html2canvas(qrCodeRef.current, {
        scale: 4, // Higher scale for better resolution
        backgroundColor: 'white',
      })
      canvas.toBlob((blob) => {
        if (blob) {
          // Sanitize the group name to create a safe filename
          const safeFilename = groupName
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase()
          FileSaver.saveAs(blob, `whatsapp_group_qr_${safeFilename}.png`)
        }
      })
    } catch (error) {
      console.error('Failed to generate QR code image:', error)
    }
  }

  if (!link) return null

  return (
    <Modal opened={opened} onClose={onClose} withCloseButton w={400}>
      <Stack align="center" p="md">
        <Title order={4} ta="center">
          QR Code for "{groupName}"
        </Title>
        <Center
          p="md"
          mt="md"
          style={{
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <div ref={qrCodeRef} style={{ background: 'white', padding: '16px' }}>
            <QRCodeCanvas value={link} size={200} level="H" />
          </div>
        </Center>
        <Button
          mt="lg"
          onClick={handleDownload}
          leftSection={<Icon icon="tabler:download" fontSize={18} />}
        >
          Download Image
        </Button>
      </Stack>
    </Modal>
  )
}

export default ModalQRCode
