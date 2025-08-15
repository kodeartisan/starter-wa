// src/components/Modal/ModalActivation.tsx
import Modal from '@/components/Modal/Modal'
import PageFaq from '@/features/faq/PageFaq'
import _ from 'lodash'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
}

const ModalFaq: React.FC<Props> = ({ opened, onClose }: Props) => {
  const handleOnClose = () => {
    onClose()
  }

  return (
    <Modal opened={opened} onClose={handleOnClose} withCloseButton>
      <PageFaq />
    </Modal>
  )
}

export default ModalFaq
