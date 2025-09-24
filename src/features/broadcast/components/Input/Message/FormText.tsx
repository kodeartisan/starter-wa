// src/features/broadcast/components/Input/Message/FormText.tsx
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTextarea from '../InputTextarea'

interface Props {
  form: UseFormReturnType<any>
  // ++ ADDED: Accept variables prop.
  variables: { label: string; variable: string }[]
}

const FormText: React.FC<Props> = ({ form, variables }) => {
  return (
    <InputTextarea
      value={form.values.inputText}
      onChange={(data) => form.setFieldValue('inputText', data)}
      error={form.errors.inputText}
      // ++ MODIFIED: Pass variables to the InputTextarea component.
      variables={variables}
    />
  )
}

export default FormText
