// src/tabs/resource-page.tsx
// English: This file provides promotional materials for the Chrome Web Store listing.
import ScreenshotWrapper from '@/components/Promo/ScreenshotWrapper'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Code,
  Container,
  CopyButton,
  Grid,
  Group,
  MantineProvider,
  Paper,
  Radio,
  Stack,
  Tabs,
  TagsInput,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core'
import '@mantine/core/styles.css'
import { DatePickerInput } from '@mantine/dates'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import React, { useRef } from 'react'

interface IconProps {
  size: number
}

const PromoIcon1: React.FC<IconProps> = ({ size }) => {
  return (
    <ThemeIcon
      size={size}
      radius="lg"
      variant="gradient"
      gradient={{ from: 'teal', to: 'lime', deg: 105 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '70%', height: '70%', color: 'white' }}
      >
        <path d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8.08a2 2 0 0 0-1.67.9l-.81 1.2a2 2 0 0 1-1.69.9H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16z" />
        <path d="M12 12.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z" />
        <path d="M12 19H6a2 2 0 0 1-2-2V9" />
        <path d="M18 17v-2a2 2 0 0 0-2-2h-4" />
      </svg>
    </ThemeIcon>
  )
}

const PromoIcon2: React.FC<IconProps> = ({ size }) => {
  return (
    <ThemeIcon
      size={size}
      radius="lg"
      variant="gradient"
      gradient={{ from: 'blue', to: 'cyan', deg: 105 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '70%', height: '70%', color: 'white' }}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <polyline points="9 15 12 12 15 15"></polyline>
      </svg>
    </ThemeIcon>
  )
}

const PromoIcon3: React.FC<IconProps> = ({ size }) => {
  return (
    <ThemeIcon
      size={size}
      radius="lg"
      variant="gradient"
      gradient={{ from: 'grape', to: 'pink', deg: 105 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '70%', height: '70%', color: 'white' }}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    </ThemeIcon>
  )
}

const ScreenshotGallery: React.FC = () => {
  const screenshotData = []

  return (
    <Stack>
      <Text c="dimmed" mb="md">
        Generate and download high-resolution screenshots (1280x800px)
        showcasing the extension's features.
      </Text>
      <Stack gap="xl">
        {screenshotData.map((item) => (
          <ScreenshotWrapper
            key={item.title}
            title={item.title}
            filename={item.filename}
          >
            {item.component}
          </ScreenshotWrapper>
        ))}
      </Stack>
    </Stack>
  )
}

// --- End of Embedded Screenshot Components ---

const ResourcePage = () => {
  const icon1Ref = useRef<HTMLDivElement>(null)
  const icon2Ref = useRef<HTMLDivElement>(null)
  const icon3Ref = useRef<HTMLDivElement>(null)

  // English: Defines the data for the three icon options to be mapped in the UI.
  const icons = [
    {
      component: <PromoIcon1 size={128} />,
      ref: icon1Ref,
      name: 'Icon-Option-1.png',
    },
    {
      component: <PromoIcon2 size={128} />,
      ref: icon2Ref,
      name: 'Icon-Option-2.png',
    },
    {
      component: <PromoIcon3 size={128} />,
      ref: icon3Ref,
      name: 'Icon-Option-3.png',
    },
  ]

  const storeListingText = {
    titles: [
      'Backup & Export for WhatsApp',
      'WhatsApp Chat Exporter & Saver',
      'Secure WhatsApp Chat Backup',
    ],
    shortDescriptions: [
      'Securely back up and export your WhatsApp chats to PDF, Excel, CSV, and more formats right from your computer.',
      'One-click tool to save your WhatsApp chat history. Export conversations and media to PDF, Excel, or CSV locally & privately.',
      'Never lose your chat history. Archive any WhatsApp conversation with media into multiple file formats. 100% secure & private.',
    ],
    longDescription: `🛡️ Secure Your WhatsApp Conversations Forever

Never lose important conversations or precious memories again. Backup & Export for WhatsApp is the ultimate tool for archiving your WhatsApp chats securely and easily. With a single click, convert your chat history into professional, organized files like PDF, Excel, and CSV, all processed 100% locally on your computer for maximum privacy.

✨ Key Features
💾 Unlimited Backups: Archive entire conversations with no message limits.
🖼️ Include Media: Save photos, videos, voice notes, and documents.
📄 Multiple Export Formats: Export to PDF, Excel (XLSX), CSV, JSON, HTML, and TXT.
🔍 Advanced Filtering: Pinpoint messages with custom date ranges and keyword searches.
🔐 100% Secure: Your data never leaves your computer.
💬 Priority Support: Get faster, dedicated support when you need it.
💎 Lifetime Access: A one-time purchase gets you all features and future updates forever. No subscriptions!

🔒 Your Privacy is Our Priority
We believe you should have complete control over your data. This extension operates entirely within your browser.
✅ Your messages and media are never uploaded to any server.
✅ The entire backup process happens on your own machine.
✅ Your conversations remain private and secure, always.

🤔 Who Is This For?
💼 Professionals: Archive client communications for record-keeping or legal compliance.
❤️ Individuals: Save precious conversations with family and friends forever.
🔬 Researchers: Export chat data into structured formats like CSV or JSON for analysis.
🙋‍♀️ Anyone who values their data: Protect yourself from accidental data loss from a lost or broken phone.

🚀 Get peace of mind knowing your WhatsApp history is safe, secure, and accessible in any format you need.`,
  }

  const keywords = [
    'WhatsApp backup',
    'export chat',
    'PDF converter',
    'save WhatsApp',
    'WhatsApp archive',
    'Excel export',
    'download whatsapp chat',
    'whatsapp to pdf',
    'whatsapp to excel',
    'chat history',
  ]
  const keywordsString = keywords.join(', ')

  const handleDownloadIcon = async (
    ref: React.RefObject<HTMLDivElement>,
    filename: string,
  ) => {
    if (!ref.current) return
    const canvas = await html2canvas(ref.current, {
      backgroundColor: null, // Transparent background
    })
    canvas.toBlob((blob) => {
      if (blob) FileSaver.saveAs(blob, filename)
    })
  }
  return (
    <MantineProvider theme={theme}>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <Title order={1} ta="center">
            {' '}
            Chrome Web Store - Promotional Resources{' '}
          </Title>
          <Text c="dimmed" ta="center">
            {' '}
            Use these assets and text to create your store listing page.{' '}
          </Text>
          <Tabs defaultValue="text">
            <Tabs.List grow>
              <Tabs.Tab
                value="text"
                leftSection={<Icon icon="tabler:file-text" />}
              >
                {' '}
                Store Listing Text{' '}
              </Tabs.Tab>
              <Tabs.Tab
                value="icons"
                leftSection={<Icon icon="tabler:photo" />}
              >
                {' '}
                Promotional Icons{' '}
              </Tabs.Tab>
              <Tabs.Tab
                value="screenshots"
                leftSection={<Icon icon="tabler:camera" />}
              >
                {' '}
                Screenshots{' '}
              </Tabs.Tab>
              <Tabs.Tab
                value="keywords"
                leftSection={<Icon icon="tabler:tags" />}
              >
                {' '}
                Keywords (SEO){' '}
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="text" pt="lg">
              <Stack gap="xl">
                <Stack>
                  <Title order={3}>Titles</Title>
                  {storeListingText.titles.map((title, index) => (
                    <Card withBorder radius="md" key={index}>
                      <Group justify="space-between">
                        <Text fw={500}>Option {index + 1}</Text>
                        <Text
                          size="sm"
                          c={title.length > 30 ? 'red' : 'dimmed'}
                        >
                          {title.length} / 30 chars
                        </Text>
                      </Group>
                      <Group mt="sm" justify="space-between">
                        <Code>{title}</Code>
                        <CopyButton value={title}>
                          {({ copied, copy }) => (
                            <Button
                              size="xs"
                              color={copied ? 'teal' : 'gray'}
                              onClick={copy}
                            >
                              {copied ? 'Copied' : 'Copy'}
                            </Button>
                          )}
                        </CopyButton>
                      </Group>
                    </Card>
                  ))}
                </Stack>
                <Stack>
                  <Title order={3}>Short Descriptions</Title>
                  {storeListingText.shortDescriptions.map((desc, index) => (
                    <Card withBorder radius="md" key={index}>
                      <Group justify="space-between">
                        <Text fw={500}>Option {index + 1}</Text>
                        <Text
                          size="sm"
                          c={desc.length > 132 ? 'red' : 'dimmed'}
                        >
                          {desc.length} / 132 chars
                        </Text>
                      </Group>
                      <Textarea
                        mt="sm"
                        readOnly
                        value={desc}
                        autosize
                        maxRows={4}
                      />
                      <Group justify="flex-end" mt="sm">
                        <CopyButton value={desc}>
                          {({ copied, copy }) => (
                            <Button
                              size="xs"
                              color={copied ? 'teal' : 'gray'}
                              onClick={copy}
                            >
                              {copied ? 'Copied' : 'Copy'}
                            </Button>
                          )}
                        </CopyButton>
                      </Group>
                    </Card>
                  ))}
                </Stack>
                <Card withBorder radius="md">
                  <Title order={3}>Detailed Description</Title>
                  <Textarea
                    mt="sm"
                    readOnly
                    value={storeListingText.longDescription}
                    autosize
                    minRows={15}
                  />
                  <Group justify="flex-end" mt="sm">
                    <CopyButton value={storeListingText.longDescription}>
                      {({ copied, copy }) => (
                        <Button
                          size="xs"
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          {' '}
                          {copied ? 'Copied' : 'Copy'}{' '}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                </Card>
              </Stack>
            </Tabs.Panel>
            {/* MODIFIED: The Icons tab now maps over the 'icons' array to display three options. */}
            <Tabs.Panel value="icons" pt="lg">
              <Grid>
                {icons.map(({ component, ref, name }, index) => (
                  <Grid.Col span={{ base: 12, sm: 4 }} key={index}>
                    <Card
                      withBorder
                      radius="md"
                      p="xl"
                      style={{ height: '100%' }}
                    >
                      <Stack
                        align="center"
                        justify="space-between"
                        style={{ height: '100%' }}
                      >
                        <div ref={ref}>{component}</div>
                        <Stack align="center" gap="md">
                          <Text fw={500}>Option {index + 1} (128x128 px)</Text>
                          <Button
                            mt="md"
                            variant="light"
                            onClick={() => handleDownloadIcon(ref, name)}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="screenshots" pt="lg">
              <ScreenshotGallery />
            </Tabs.Panel>
            <Tabs.Panel value="keywords" pt="lg">
              <Card withBorder radius="md">
                <Group justify="space-between">
                  <Title order={3}>Keywords for Store Listing</Title>
                  <CopyButton value={keywordsString}>
                    {({ copied, copy }) => (
                      <Button
                        size="xs"
                        color={copied ? 'teal' : 'gray'}
                        onClick={copy}
                        leftSection={<Icon icon="tabler:copy" />}
                      >
                        {' '}
                        {copied ? 'Copied All' : 'Copy All'}{' '}
                      </Button>
                    )}
                  </CopyButton>
                </Group>
                <Text c="dimmed" size="sm" mt="xs">
                  {' '}
                  Use these keywords in your store listing's metadata to improve
                  search visibility.{' '}
                </Text>
                <Paper withBorder p="md" mt="md" radius="sm">
                  <Group gap="xs">
                    {keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="light"
                        color="gray"
                        size="lg"
                      >
                        {' '}
                        {keyword}{' '}
                      </Badge>
                    ))}
                  </Group>
                </Paper>
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </MantineProvider>
  )
}

export default ResourcePage
