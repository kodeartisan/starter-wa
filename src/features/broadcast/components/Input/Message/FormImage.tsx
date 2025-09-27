// src/features/broadcast/components/Input/Message/FormImage.tsx
import type { UseFormReturnType } from '@mantine/form'
import React, { useEffect, useState } from 'react'
import InputTextarea from '../InputTextarea'
import Upload from './Upload'

interface Props {
  form: UseFormReturnType<any>
  // ++ MODIFIED: Update the variables prop type to include the optional tooltip.
  variables: { label: string; variable: string; tooltip?: string }[]
}

const FormImage: React.FC<Props> = ({ form, variables }) => {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <>
      <Upload
        type="image"
        value={form.values.inputImage.file}
        onDrop={(file) => {
          form.setFieldValue('inputImage.file', file)
        }}
      />
      <InputTextarea
        value={form.values.inputImage.caption}
        onChange={(data) => form.setFieldValue('inputImage.caption', data)}
        placeholder="Enter your caption here"
        // ++ MODIFIED: Pass variables to the InputTextarea component.
        variables={variables}
      />
    </>
  )
}

export default FormImage
