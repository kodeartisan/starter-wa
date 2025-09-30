// src/features/broadcast/components/Input/Message/FormFile.tsx
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTextarea from '../InputTextarea'
import Upload from './Upload'

interface Props {
  form: UseFormReturnType<any>
  variables: { label: string; variable: string; tooltip?: string }[]
}

const FormFile: React.FC<Props> = ({ form, variables }) => {
  return (
    <>
      <Upload
        type="file"
        value={form.values.inputFile.file}
        onDrop={(file) => {
          form.setFieldValue('inputFile.file', file)
        }}
        onRemove={() => form.setFieldValue('inputFile.file', null)}
      />
      <InputTextarea
        value={form.values.inputFile.caption}
        onChange={(data) => form.setFieldValue('inputFile.caption', data)}
        placeholder="Enter your caption here"
        variables={variables}
      />
    </>
  )
}

export default FormFile
