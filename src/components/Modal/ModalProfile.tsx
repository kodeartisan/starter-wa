// src/components/Modal/ModalActivation.tsx
import Modal from '@/components/Modal/Modal'
import PageProfile from '@/features/profile/PageProfile'
import _ from 'lodash'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
}

const ModalProfile: React.FC<Props> = ({ opened, onClose }: Props) => {
  const handleOnClose = () => {
    onClose()
  }

  return (
    <Modal opened={opened} onClose={handleOnClose} withCloseButton>
      <PageProfile />
    </Modal>
  )
}

export default ModalProfile
