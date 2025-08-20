// English: A reusable wrapper to handle screenshot generation and download logic.
// It takes a title, a child component to render, and a filename.
import { Icon } from '@iconify/react'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import React, { useRef, useState } from 'react'

interface Props {
  title: string
  filename: string
  children: React.ReactNode
}

const ScreenshotWrapper: React.FC<Props> = ({ title, filename, children }) => {
  const screenshotRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    if (!screenshotRef.current) return
    setIsLoading(true)
    try {
      const canvas = await html2canvas(screenshotRef.current, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        backgroundColor: '#f8f9fa',
      })
      canvas.toBlob((blob) => {
        if (blob) {
          FileSaver.saveAs(blob, filename)
        }
      })
    } catch (error) {
      console.error('Failed to generate screenshot:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card withBorder radius="md">
      <Stack>
        <Group justify="space-between">
          <Title order={4}>{title}</Title>
          <Button
            size="xs"
            variant="light"
            onClick={handleDownload}
            loading={isLoading}
            leftSection={<Icon icon="tabler:download" fontSize={16} />}
          >
            Download
          </Button>
        </Group>
        <div
          ref={screenshotRef}
          style={{ padding: '20px', backgroundColor: '#f8f9fa' }}
        >
          {children}
        </div>
      </Stack>
    </Card>
  )
}

export default ScreenshotWrapper
