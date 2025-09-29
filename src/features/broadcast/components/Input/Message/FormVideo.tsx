// src/features/broadcast/components/Input/Message/FormVideo.tsx
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTextarea from '../InputTextarea'
import Upload from './Upload'

interface Props {
  form: UseFormReturnType<any>
  variables: { label: string; variable: string; tooltip?: string }[]
}

const FormVideo: React.FC<Props> = ({ form, variables }) => {
  return (
    <>
      <Upload
        type="video"
        value={form.values.inputVideo.file}
        onDrop={(file) => {
          form.setFieldValue('inputVideo.file', file)
        }}
      />
      <InputTextarea
        value={form.values.inputVideo.caption}
        onChange={(data) => form.setFieldValue('inputVideo.caption', data)}
        placeholder="Enter your caption here"
        variables={variables}
        // ++ ADDED: Pass props for live preview.
        messageType={form.values.type}
        message={{ caption: form.values.inputVideo.caption }}
      />
    </>
  )
}

export default FormVideo
