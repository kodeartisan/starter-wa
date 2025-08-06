import LayoutPage from '@/components/Layout/LayoutPage'
import { Icon } from '@iconify/react'
import {
  Accordion,
  Anchor,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import React from 'react'

const faqData = [
  {
    icon: 'tabler:key',
    question: 'Where can I find my license key?',
    answer:
      'You will receive an email from Lemon Squeezy after making a purchase. This email usually contains your purchase details and your license key.',
  },
  {
    icon: 'tabler:shield-lock',
    question: 'Is my data secure?',
    answer:
      'Absolutely. Your data security is our priority. This extension does not collect, store, or share any personal data from your WhatsApp account. All processes occur locally on your device.',
  },
  {
    icon: 'tabler:mail-question',
    question: 'How can I get more help and support?',
    answer:
      'If you have other questions or need assistance, please feel free to email us at extdotninja@gmail.com. Our team will be happy to help you.',
  },
]

const PageFaq: React.FC = () => {
  return (
    <LayoutPage title="Help & FAQ">
      <Stack p="md">
        {/* Accordion */}
        <Accordion variant="separated" radius="md">
          {faqData.map((item) => (
            <Accordion.Item key={item.question} value={item.question}>
              <Accordion.Control
                icon={
                  <ThemeIcon variant="light" size="lg">
                    <Icon icon={item.icon} fontSize={22} />
                  </ThemeIcon>
                }
              >
                <Text fw={500}>{item.question}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text c="dimmed" size="sm" lh={1.6}>
                  {item.answer}
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* Contact Support */}
        <Paper withBorder p="md" shadow="none" radius="md" mt="xl">
          <Group>
            <ThemeIcon size="xl" radius="md" variant="light">
              <Icon icon="tabler:mail-filled" fontSize={24} />
            </ThemeIcon>
            <Stack gap={2}>
              <Title order={4}>Still have questions?</Title>
              <Text c="dimmed" size="sm">
                Our team is ready to help. Contact us via email.
              </Text>
              <Anchor
                href="mailto:extdotninja@gmail.com"
                size="sm"
                fw={500}
                target="_blank"
              >
                extdotninja@gmail.com
              </Anchor>
            </Stack>
          </Group>
        </Paper>
      </Stack>
    </LayoutPage>
  )
}

export default PageFaq
