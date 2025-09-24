// src/features/broadcast/components/Input/Message/FormVideo.tsx
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTextarea from '../InputTextarea'
import Upload from './Upload'

interface Props {
  form: UseFormReturnType<any>
  // ++ ADDED: Accept variables prop.
  variables: { label: string; variable: string }[]
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
        // ++ MODIFIED: Pass variables to the InputTextarea component.
        variables={variables}
      />
    </>
  )
}

export default FormVideo
