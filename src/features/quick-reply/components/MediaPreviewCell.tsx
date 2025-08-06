// src/features/quick-reply/components/MediaPreviewCell.tsx
import { Media, Message } from '@/constants'
import type { QuickReply } from '@/libs/db'
import db from '@/libs/db'
import { generateVideoThumbnail } from '@/utils/util'
import { Group, Image, Loader, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { getQuickReplyMessagePreview } from '../helpers/preview'

interface Props {
  reply: QuickReply
}

/**
 * @component MediaPreviewCell
 * @description A component for DataTable cells that asynchronously loads and displays
 * a thumbnail for media-based quick replies (Image/Video) alongside a text preview.
 */
const MediaPreviewCell: React.FC<Props> = ({ reply }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const generatePreview = async () => {
      // Only attempt to load media for Image or Video types
      if (reply.type !== Message.IMAGE && reply.type !== Message.VIDEO) {
        setIsLoading(false)
        return
      }
      const media = await db.media
        .where({ parentId: reply.id, type: Media.QUICK_REPLY })
        .first()
      if (media?.file && isMounted) {
        try {
          if (reply.type === Message.IMAGE) {
            const url = URL.createObjectURL(media.file)
            setPreviewUrl(url)
          } else if (reply.type === Message.VIDEO) {
            const thumbnailUrl = await generateVideoThumbnail(media.file)
            setPreviewUrl(thumbnailUrl)
          }
        } catch (error) {
          console.error('Failed to generate preview:', error)
          setPreviewUrl(null)
        }
      }
      setIsLoading(false)
    }
    generatePreview()

    return () => {
      isMounted = false
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [reply])

  // Use the new centralized helper function for a consistent text preview
  const textPreview = getQuickReplyMessagePreview(reply, 80)

  // Show a loader only while fetching media
  if (
    isLoading &&
    (reply.type === Message.IMAGE || reply.type === Message.VIDEO)
  ) {
    return <Loader size="xs" />
  }

  return (
    <Group gap="xs" wrap="nowrap" style={{ alignItems: 'center' }}>
      {previewUrl && (
        <Image
          src={previewUrl}
          w={40}
          h={40}
          radius="sm"
          fit="cover"
          alt="Media preview"
        />
      )}
      <Text size="sm" style={{ whiteSpace: 'normal', flex: 1 }}>
        {textPreview}
      </Text>
    </Group>
  )
}

export default MediaPreviewCell
