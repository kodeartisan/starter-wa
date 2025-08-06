import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTextarea from '../InputTextarea'
import Upload from './Upload'

interface Props {
  form: UseFormReturnType<any>
}

const FormFile: React.FC<Props> = ({ form }: Props) => {
  return (
    <>
      <Upload
        type="file"
        value={form.values.inputFile.file}
        onDrop={(file) => {
          form.setFieldValue('inputFile.file', file)
        }}
      />
      <InputTextarea
        value={form.values.inputFile.caption}
        onChange={(data) => form.setFieldValue('inputFile.caption', data)}
        placeholder="Enter your caption here"
      />
    </>
  )
}

export default FormFile
