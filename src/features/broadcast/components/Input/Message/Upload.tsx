// src/features/broadcast/components/Input/Message/Upload.tsx
import { Icon } from '@iconify/react'
import { Box, Stack, Text } from '@mantine/core'
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileRejection,
} from '@mantine/dropzone'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  type: 'image' | 'video' | 'file'
  value: File | null
  onDrop: (file: File) => void
  onReject?: (fileRejections: FileRejection[]) => void | null
}

const Upload: React.FC<Props> = ({
  type,
  value,
  onDrop,
  onReject = () => {},
}) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: string
  } | null>(null)
  const dropzoneRef = useRef<any>(null)

  const mimes = {
    image: IMAGE_MIME_TYPE,
    video: ['video/mp4'],
    audio: [],
    file: [],
  }

  const maxSizes = {
    image: 3 * 1024 * 1024, // 3MB
    video: 8 * 1024 * 1024, // 8MB
    file: 8 * 1024 * 1024, // 8MB
  }

  const idleDescriptions = {
    image: 'Max size: 3MB | Formats: JPG, PNG, GIF, WEBP',
    video: 'Max size: 8MB | Formats: MP4',
    file: 'Max size: 8MB',
  }

  const rejectDescriptions = {
    image: 'Max size: 3MB | Formats: JPG, PNG, GIF, WEBP',
    video: 'Max size: 8MB | Formats: MP4',
    file: 'Max size: 8MB',
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  useEffect(() => {
    if (value) {
      if (type === 'image') {
        const previewUrl = URL.createObjectURL(value)
        setPreview(previewUrl)
      } else if (type === 'video') {
        generateVideoThumbnail(value).then((thumbnail) => setPreview(thumbnail))
      } else if (type === 'file') {
        const sizeInMB = (value.size / (1024 * 1024)).toFixed(2)
        setFileInfo({ name: value.name, size: `${sizeInMB} MB` })
      }
    } else {
      setPreview(null)
      setFileInfo(null)
    }
  }, [value, type])

  const handleDrop = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      onDrop(file)
      if (type === 'video') {
        const thumbnail = await generateVideoThumbnail(file)
        setPreview(thumbnail)
      } else if (type === 'image') {
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
      } else if (type === 'file') {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
        setFileInfo({ name: file.name, size: `${sizeInMB} MB` })
      }
    }
  }

  const handleReject = (fileRejections: FileRejection[]) => {
    onReject(fileRejections)
    console.log(fileRejections)
  }

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      video.src = URL.createObjectURL(file)
      video.addEventListener('loadeddata', () => {
        canvas.width = 200
        canvas.height = 150
        video.currentTime = 0
        video.addEventListener('seeked', () => {
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            const thumbnailUrl = canvas.toDataURL('image/png')
            URL.revokeObjectURL(video.src)
            resolve(thumbnailUrl)
          }
        })
      })
    })
  }

  const renderContent = () => {
    const isFileSelected = (type === 'file' && fileInfo) || preview

    if (isFileSelected) {
      return (
        <Box
          pos="relative"
          style={{
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {type === 'file' && fileInfo ? (
            <Stack justify="center" align="center" ta="center">
              <Icon icon="tabler:file-text" fontSize={50} />
              <Text>File: {fileInfo.name}</Text>
              <Text size="sm">Size: {fileInfo.size}</Text>
            </Stack>
          ) : (
            preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  height: 100,
                  objectFit: 'contain',
                }}
              />
            )
          )}
        </Box>
      )
    }

    return (
      <>
        <Dropzone.Idle>
          <Stack justify="center" align="center">
            <Icon
              icon={
                type === 'image'
                  ? 'tabler:photo'
                  : type === 'video'
                    ? 'tabler:video'
                    : type === 'file'
                      ? 'tabler:file-text'
                      : 'tabler:file'
              }
              fontSize={50}
            />
            <Text>Drag & drop here or click to select a file</Text>
            <Text size="xs" c="dimmed">
              {idleDescriptions[type]}
            </Text>
          </Stack>
        </Dropzone.Idle>
        <Dropzone.Accept>
          <Stack justify="center" align="center">
            <Icon icon={'tabler:upload'} fontSize={50} />
            <Text>Drop the file here...</Text>
          </Stack>
        </Dropzone.Accept>
        <Dropzone.Reject>
          <Stack justify="center" align="center">
            <Icon icon={'tabler:x'} fontSize={50} />
            <Text>{rejectDescriptions[type]}</Text>
          </Stack>
        </Dropzone.Reject>
      </>
    )
  }

  return (
    <Dropzone
      ref={dropzoneRef}
      onDrop={handleDrop}
      onReject={handleReject}
      maxSize={maxSizes[type]}
      accept={mimes[type]}
      multiple={false}
    >
      {renderContent()}
    </Dropzone>
  )
}

export default Upload
