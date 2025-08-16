// src/components/Modal/ModalFaq.tsx
import Modal from '@/components/Modal/Modal'
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

interface Props {
  opened: boolean
  onClose: () => void
}

const faqData = [
  {
    icon: 'tabler:rocket',
    question: 'What are the main benefits of upgrading to Pro?',
    answer:
      "With Pro, you get **Total Protection** by backing up all messages and media without limits—no more risk of losing important data or precious memories. You'll unlock **Exclusive Features** like custom date ranges, Excel/CSV exports, and upcoming premium tools. Plus, you receive **Priority Support**, ensuring our team assists you first whenever you need help.",
  },
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

const ModalFaq: React.FC<Props> = ({ opened, onClose }: Props) => {
  const handleOnClose = () => {
    onClose()
  }

  return (
    <Modal opened={opened} onClose={handleOnClose} withCloseButton w={700}>
      <Stack>
        <Stack align="center" gap={4} mb={'xl'}>
          <Icon
            icon="tabler:world-question"
            fontSize={48}
            color="var(--mantine-color-teal-6)"
          />
          <Title order={3} ta="center">
            Frequently Asked Questions
          </Title>
        </Stack>

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
                {/* MODIFIED: Changed the answer to markdown-like bolding for emphasis. */}
                <Text
                  fw={500}
                  dangerouslySetInnerHTML={{
                    __html: item.question.replace(
                      /\*\*(.*?)\*\*/g,
                      '<b>$1</b>',
                    ),
                  }}
                ></Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text
                  c="dimmed"
                  size="sm"
                  lh={1.6}
                  dangerouslySetInnerHTML={{
                    __html: item.answer.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
                  }}
                ></Text>
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
    </Modal>
  )
}

export default ModalFaq
