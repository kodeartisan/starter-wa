import { Group, TextInput } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'

interface Props {
  form: UseFormReturnType<any>
}

const FormLocation: React.FC<Props> = ({ form }: Props) => {
  return (
    <>
      <Group grow>
        <TextInput
          required
          label="Latitude"
          placeholder="-22.95201"
          {...form.getInputProps('inputLocation.lat')}
        />
        <TextInput
          required
          label="Longitude"
          placeholder="-43.2102601"
          {...form.getInputProps('inputLocation.lng')}
        />
      </Group>

      <TextInput label="Name" {...form.getInputProps('inputLocation.name')} />
      <TextInput
        label="Address"
        {...form.getInputProps('inputLocation.address')}
      />
      <TextInput label="Url" {...form.getInputProps('inputLocation.url')} />
    </>
  )
}

export default FormLocation
