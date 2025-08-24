import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Box,
  Button,
  Fieldset,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import { When } from 'react-if'

interface Props {
  form: UseFormReturnType<any>
}

const FormPoll: React.FC<Props> = ({ form }: Props) => {
  const handleInsert = () => {
    form.insertListItem('inputPoll.choices', '')
  }

  const handleRemove = (index: number) => {
    form.removeListItem('inputPoll.choices', index)
  }

  return (
    <>
      <TextInput
        required
        label="Name"
        {...form.getInputProps('inputPoll.name')}
      />
      <Fieldset legend={<Text fw={500}>Choices</Text>}>
        <Stack>
          {form.values.inputPoll.choices.map((button: any, index: number) => (
            <Group key={index}>
              <TextInput
                style={{
                  flexGrow: 1,
                }}
                {...form.getInputProps(`inputPoll.choices.${index}`)}
              />
              <When condition={index !== 0}>
                <ActionIcon color="red" onClick={() => handleRemove(index)}>
                  <Icon icon={'tabler:trash'} fontSize={24} />
                </ActionIcon>
              </When>
            </Group>
          ))}
          <Box>
            <Button size="xs" onClick={handleInsert}>
              Add
            </Button>
          </Box>
        </Stack>
      </Fieldset>
    </>
  )
}

export default FormPoll
