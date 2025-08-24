import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTextarea from '../InputTextarea'

interface Props {
  form: UseFormReturnType<any>
}

const FormText: React.FC<Props> = ({ form }: Props) => {
  return (
    <InputTextarea
      value={form.values.inputText}
      onChange={(data) => form.setFieldValue('inputText', data)}
      error={form.errors.inputText}
    />
  )
}

export default FormText
