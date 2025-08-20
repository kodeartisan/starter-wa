// src/tabs/resource-page.tsx
import PromoIcon from '@/components/Promo/PromoIcon'
import ScreenshotWrapper from '@/components/Promo/ScreenshotWrapper'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  Accordion,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Code,
  Container,
  CopyButton,
  Divider,
  Grid,
  Group,
  List,
  MantineProvider,
  Paper,
  Progress,
  Radio,
  Select,
  Stack,
  Tabs,
  TagsInput,
  Text,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
  Transition,
} from '@mantine/core'
import '@mantine/core/styles.css'
import { DatePickerInput } from '@mantine/dates'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import React, { useRef } from 'react'

// English: A realistic mockup of the Backup Options UI for promotional screenshots.
const MockBackupOptions = () => (
  <Stack>
    <Select
      label="Select chat"
      placeholder="Search for a chat..."
      data={['Jane Doe', 'Project Team', 'Mom']}
      value="Jane Doe"
      readOnly
      leftSection={<Icon icon="tabler:message" />}
    />
    <TagsInput
      label="Filter by Keywords (Optional)"
      placeholder="Add keywords and press Enter"
      description="Only export messages containing these keywords."
      value={['project', 'invoice']}
      readOnly
    />
    <Select
      label="Date Range"
      data={['Last 7 Days', 'Last 30 Days', 'All Time']}
      value="Last 30 Days"
      readOnly
    />
    <Checkbox.Group
      label="Include Message Types"
      description="Select the types of messages to include."
      value={['chat', 'image']}
      readOnly
    >
      <Group mt="xs">
        <Checkbox value="chat" label="Text" />
        <Group gap="xs">
          <Checkbox value="image" label="Images" />
          <Badge size="xs" variant="light" color="teal">
            PRO
          </Badge>
        </Group>
        <Group gap="xs">
          <Checkbox value="video" label="Videos" />
          <Badge size="xs" variant="light" color="teal">
            PRO
          </Badge>
        </Group>
      </Group>
    </Checkbox.Group>
    <Radio.Group label="Format" value="xlsx" readOnly>
      <Group mt="xs">
        <Radio size="sm" value="html" label="HTML (.zip)" />
        <Group gap="xs">
          <Radio size="sm" value="pdf" label="PDF" />
          <Badge size="xs" variant="light" color="teal">
            PRO
          </Badge>
        </Group>
        <Group gap="xs">
          <Radio size="sm" value="xlsx" label="Excel" />
          <Badge size="xs" variant="light" color="teal">
            PRO
          </Badge>
        </Group>
      </Group>
    </Radio.Group>
    <Group justify="flex-end" mt="xl">
      <Button leftSection={<Icon icon="tabler:download" />}>
        Start Backup
      </Button>
    </Group>
  </Stack>
)

// English: A realistic mockup of the Backup Progress UI.
const MockBackupProgress = () => (
  <Center h={300}>
    <Stack w="100%" align="center">
      <Text size="lg" fw={500}>
        Backup in Progress...
      </Text>
      <Progress value={65} animated size="lg" w="80%" />
      <Text c="dimmed" size="sm">
        Processing message 2,345 of 3,608...
      </Text>
      <Button mt="lg" variant="outline" color="red">
        Cancel
      </Button>
    </Stack>
  </Center>
)

// English: A realistic mockup of the Backup Result UI, highlighting the Pro upsell.
const MockBackupResult = () => (
  <Center h={450}>
    <Stack align="center" gap="lg">
      <ThemeIcon color="teal" size={80} radius="xl">
        <Icon icon="tabler:circle-check" fontSize={48} />
      </ThemeIcon>
      <Title order={3}>Backup Complete!</Title>
      <Text c="dimmed" size="sm" ta="center" maw={400}>
        Successfully exported 10 messages. The file is in your downloads folder.
      </Text>
      <Card
        withBorder
        p="lg"
        shadow="none"
        radius="md"
        mt="md"
        style={{
          width: '100%',
          borderColor: 'var(--mantine-color-orange-4)',
          backgroundColor: 'var(--mantine-color-orange-0)',
        }}
      >
        <Stack align="center" gap="sm">
          <Group gap="xs">
            <Icon
              icon="tabler:alert-triangle"
              color="var(--mantine-color-orange-7)"
              fontSize={24}
            />
            <Title order={5} c="orange.9">
              Warning: Some Memories Are At Risk!
            </Title>
          </Group>
          <Text ta="center" size="sm" c="dimmed">
            <b>3,598 messages</b> and <b>87 media files</b> were NOT SAVED and
            could be lost forever. Upgrade now to protect all your data.
          </Text>
          <Button
            mt="sm"
            color="teal"
            leftSection={<Icon icon="tabler:crown" fontSize={18} />}
          >
            Upgrade to Protect Everything
          </Button>
        </Stack>
      </Card>
      <Button variant="outline" mt="xl">
        Start Another Backup
      </Button>
    </Stack>
  </Center>
)

const ResourcePage = () => {
  const icon128Ref = useRef<HTMLDivElement>(null)
  const icon48Ref = useRef<HTMLDivElement>(null)
  const icon16Ref = useRef<HTMLDivElement>(null)

  // English: Store listing text with emojis for better engagement.
  const storeListingText = {
    title: 'Backup & Export for WhatsApp',
    shortDescription:
      'Securely back up and export your WhatsApp chats to PDF, Excel, CSV, and more formats right from your computer.',
    longDescription: `## 🛡️ Secure Your WhatsApp Conversations Forever

Never lose important conversations or precious memories again. **Backup & Export for WhatsApp** is the ultimate tool for archiving your WhatsApp chats securely and easily. With a single click, convert your chat history into professional, organized files like PDF, Excel, and CSV, all processed 100% locally on your computer for maximum privacy.

## ✨ Key Features

### 🎁 For Everyone (Free Version)
* **💾 Basic Backup**: Save up to 10 messages per chat.
* **📄 HTML Export**: Export your chats into a clean, readable HTML file.
* **🔍 Simple Filtering**: Filter chats from the last 7 days.
* **🔐 100% Secure**: Your data never leaves your computer.

### 🚀 Unlock Total Control (Pro Version)
* **♾️ Unlimited Backups**: Archive entire conversations with no message limits.
* **🖼️ Include Media**: Save photos, videos, voice notes, and documents.
* **📑 Multiple Export Formats**: Export to PDF, Excel (XLSX), CSV, JSON, and TXT.
* **🗓️ Advanced Filtering**: Pinpoint messages with custom date ranges and keyword searches.
* **👑 Priority Support**: Get faster, dedicated support when you need it.
* **🔑 Lifetime Access**: Pay once, get all features and future updates forever. No subscriptions!

## 🔒 Your Privacy is Our Priority

We believe you should have complete control over your data. This extension operates entirely within your browser.

✅ **Your messages and media are never uploaded to any server.**
✅ The entire backup process happens on your own machine.
✅ Your conversations remain private and secure, always.

## 🤔 Who Is This For?

* **💼 Professionals**: Archive client communications for record-keeping or legal compliance.
* **❤️ Individuals**: Save precious conversations with family and friends forever.
* **🔬 Researchers**: Export chat data into structured formats like CSV or JSON for analysis.
* **👤 Anyone who values their data**: Protect yourself from accidental data loss from a lost or broken phone.

Upgrade to Pro today for a small one-time fee and gain peace of mind knowing your WhatsApp history is safe, secure, and accessible in any format you need.`,
  }

  // English: List of relevant keywords for the Chrome Web Store.
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
    const canvas = await html2canvas(ref.current, { backgroundColor: null }) // Transparent background
    canvas.toBlob((blob) => {
      if (blob) FileSaver.saveAs(blob, filename)
    })
  }

  return (
    <MantineProvider theme={theme}>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <Title order={1} ta="center">
            Chrome Web Store - Promotional Resources
          </Title>
          <Text c="dimmed" ta="center">
            Use these assets and text to create your store listing page.
          </Text>

          <Tabs defaultValue="text">
            <Tabs.List grow>
              <Tabs.Tab
                value="text"
                leftSection={<Icon icon="tabler:file-text" />}
              >
                Store Listing Text
              </Tabs.Tab>
              <Tabs.Tab
                value="icons"
                leftSection={<Icon icon="tabler:photo" />}
              >
                Promotional Icons
              </Tabs.Tab>
              <Tabs.Tab
                value="screenshots"
                leftSection={<Icon icon="tabler:camera" />}
              >
                Screenshots
              </Tabs.Tab>
              <Tabs.Tab
                value="keywords"
                leftSection={<Icon icon="tabler:tags" />}
              >
                Keywords (SEO)
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="text" pt="lg">
              <Stack>
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={3}>Title</Title>
                    <Text
                      size="sm"
                      c={storeListingText.title.length > 30 ? 'red' : 'dimmed'}
                    >
                      {storeListingText.title.length} / 30 chars
                    </Text>
                  </Group>
                  <Group mt="sm" justify="space-between">
                    <Code>{storeListingText.title}</Code>
                    <CopyButton value={storeListingText.title}>
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

                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={3}>Short Description</Title>
                    <Text
                      size="sm"
                      c={
                        storeListingText.shortDescription.length > 132
                          ? 'red'
                          : 'dimmed'
                      }
                    >
                      {storeListingText.shortDescription.length} / 132 chars
                    </Text>
                  </Group>
                  <Textarea
                    mt="sm"
                    readOnly
                    value={storeListingText.shortDescription}
                    autosize
                    maxRows={3}
                  />
                  <Group justify="flex-end" mt="sm">
                    <CopyButton value={storeListingText.shortDescription}>
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
                          {copied ? 'Copied' : 'Copy'}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                </Card>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="icons" pt="lg">
              <Text c="dimmed" mb="md">
                Click to download required icon sizes. Previews show how the
                icon appears on different backgrounds.
              </Text>
              <Grid>
                {[
                  { size: 128, ref: icon128Ref, previewSize: 48 },
                  { size: 48, ref: icon48Ref, previewSize: 36 },
                  { size: 16, ref: icon16Ref, previewSize: 16 },
                ].map(({ size, ref, previewSize }) => (
                  <Grid.Col span={{ base: 12, sm: 4 }} key={size}>
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
                        <div ref={ref}>
                          <PromoIcon size={size} />
                        </div>
                        <Stack align="center" gap="md">
                          <Text fw={500}>
                            {size}x{size} px
                          </Text>
                          <Divider label="Previews" w="100%" />
                          <Group>
                            <Paper bg="white" p={4} radius="sm" withBorder>
                              <PromoIcon size={previewSize} />
                            </Paper>
                            <Paper bg="gray.2" p={4} radius="sm">
                              <PromoIcon size={previewSize} />
                            </Paper>
                            <Paper bg="dark.6" p={4} radius="sm">
                              <PromoIcon size={previewSize} />
                            </Paper>
                          </Group>
                          <Button
                            mt="md"
                            variant="light"
                            onClick={() =>
                              handleDownloadIcon(ref, `icon${size}.png`)
                            }
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
              <Text c="dimmed" mb="md">
                Generate and download high-resolution screenshots (1280x800px)
                showcasing the extension's features.
              </Text>
              <Stack>
                <ScreenshotWrapper
                  title="1. Easy Backup Options"
                  filename="screenshot_1_options.png"
                >
                  <MockBackupOptions />
                </ScreenshotWrapper>
                <ScreenshotWrapper
                  title="2. Backup in Progress"
                  filename="screenshot_2_progress.png"
                >
                  <MockBackupProgress />
                </ScreenshotWrapper>
                <ScreenshotWrapper
                  title="3. Results & Pro Upgrade"
                  filename="screenshot_3_result.png"
                >
                  <MockBackupResult />
                </ScreenshotWrapper>
              </Stack>
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
                        {copied ? 'Copied All' : 'Copy All'}
                      </Button>
                    )}
                  </CopyButton>
                </Group>
                <Text c="dimmed" size="sm" mt="xs">
                  Use these keywords in your store listing's metadata to improve
                  search visibility.
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
                        {keyword}
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
