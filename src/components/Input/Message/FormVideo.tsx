import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTextarea from '../InputTextarea'
import Upload from './Upload'

interface Props {
  form: UseFormReturnType<any>
}

const FormVideo: React.FC<Props> = ({ form }: Props) => {
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
      />
    </>
  )
}

export default FormVideo
