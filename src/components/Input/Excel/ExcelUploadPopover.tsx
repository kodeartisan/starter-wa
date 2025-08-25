import { Icon } from '@iconify/react'
import { Button, Popover, Stack, Text, Tooltip } from '@mantine/core'
import React, { useState } from 'react'
import ExcelUploader from './ExcelUploader'

interface Props {
  onConfirm: (data: any[]) => void
}

/**
 * @component ExcelUploadPopover
 * @description A popover component for Excel uploads, now refactored to use the generic ExcelUploader.
 * It acts as a lightweight wrapper, placing the uploader logic inside a Mantine Popover.
 */
const ExcelUploadPopover: React.FC<Props> = ({ onConfirm }) => {
  const [popoverOpened, setPopoverOpened] = useState(false)

  return (
    <Popover
      opened={popoverOpened}
      onChange={setPopoverOpened}
      withArrow
      shadow="md"
      position="bottom-end"
    >
      <Popover.Target>
        <Tooltip label="Upload excel" position="top">
          <Button
            size={'compact-sm'}
            variant="outline"
            onClick={() => setPopoverOpened((o) => !o)}
          >
            <Icon icon={'tabler:file-type-xls'} fontSize={24} />
          </Button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown w={350}>
        <Stack>
          <Text size="sm" fw={500}>
            Upload Excel File
          </Text>
          <ExcelUploader
            onConfirm={onConfirm}
            onClose={() => setPopoverOpened(false)}
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default ExcelUploadPopover
