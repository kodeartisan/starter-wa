// src/tabs/resource-page.tsx
// English: This file provides promotional materials for the Chrome Web Store listing.
import PromoIcon from '@/components/Promo/PromoIcon'
import ScreenshotWrapper from '@/components/Promo/ScreenshotWrapper'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Checkbox,
  Code,
  Container,
  CopyButton,
  Grid,
  Group,
  List,
  MantineProvider,
  Paper,
  Radio,
  Select,
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
import '@mantine/dates/styles.css'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import React, { useRef } from 'react'

// --- Promotional Tile Components (for generation) --- //
// These components are designed to be rendered inside ScreenshotWrapper.
// English: Using a darker gradient that matches the landing page's teal-to-lime theme with darker shades for a more prominent look.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-teal-8), var(--mantine-color-lime-8))'

// --- Small Promo Tile Options (440x280px) --- //
// English: Three distinct design options for the small promotional tile,
// all focused on showcasing the extension's key features in different layouts.

// English: Option 1 uses a classic 2x2 grid layout for features.
const SmallTileFeaturesGrid = () => (
  <Paper
    w={440}
    h={280}
    withBorder
    radius="md"
    p="lg"
    display="flex"
    style={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Text size="xl" fw={'bolder'} c="white">
      Powerful Whatsapp Backup Tool
    </Text>
    <Text c="gray.2" size="sm" fw={500} mt="xs" mb="lg">
      Export chats to PDF, Excel, and more. 100% Private.
    </Text>
    <Grid w="100%" gutter="sm">
      <Grid.Col span={6}>
        <Group gap="xs">
          <ThemeIcon size="md" radius="sm">
            <Icon icon="tabler:files" fontSize={16} />
          </ThemeIcon>
          <Text size="sm" c="white">
            Multiple Formats
          </Text>
        </Group>
      </Grid.Col>
      <Grid.Col span={6}>
        <Group gap="xs">
          <ThemeIcon size="md" radius="sm">
            <Icon icon="tabler:shield-lock" fontSize={16} />
          </ThemeIcon>
          <Text size="sm" c="white">
            100% Private
          </Text>
        </Group>
      </Grid.Col>
      <Grid.Col span={6}>
        <Group gap="xs">
          <ThemeIcon size="md" radius="sm">
            <Icon icon="tabler:photo-video" fontSize={16} />
          </ThemeIcon>
          <Text size="sm" c="white">
            Include Media
          </Text>
        </Group>
      </Grid.Col>
      <Grid.Col span={6}>
        <Group gap="xs">
          <ThemeIcon size="md" radius="sm">
            <Icon icon="tabler:filter" fontSize={16} />
          </ThemeIcon>
          <Text size="sm" c="white">
            Advanced Filters
          </Text>
        </Group>
      </Grid.Col>
    </Grid>
  </Paper>
)

// English: Option 2 uses a clean, centered vertical list for features.
const SmallTileFeaturesList = () => (
  <Paper
    w={440}
    h={280}
    withBorder
    radius="md"
    p="xl"
    display="flex"
    style={{
      flexDirection: 'column',
      justifyContent: 'center',
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Title order={3} ta="center" lh={1.2} c="white" mb="xl">
      Your Complete WhatsApp Archive
    </Title>
    <Stack gap="sm" align="center">
      <Group gap="xs">
        <Icon icon="tabler:database-export" fontSize={20} color="white" />
        <Text size="sm" c="white">
          Unlimited Backups
        </Text>
      </Group>
      <Group gap="xs">
        <Icon icon="tabler:photo-video" fontSize={20} color="white" />
        <Text size="sm" c="white">
          Export All Media
        </Text>
      </Group>
      <Group gap="xs">
        <Icon icon="tabler:files" fontSize={20} color="white" />
        <Text size="sm" c="white">
          Multiple Formats (PDF, Excel)
        </Text>
      </Group>
      <Group gap="xs">
        <Icon icon="tabler:shield-check" fontSize={20} color="white" />
        <Text size="sm" c="white">
          100% Private & Secure
        </Text>
      </Group>
    </Stack>
  </Paper>
)

// English: Option 3 uses a more visual, icon-driven horizontal layout for features.
const SmallTileFeaturesIcons = () => (
  <Paper
    w={440}
    h={280}
    withBorder
    radius="md"
    p="lg"
    display="flex"
    style={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Title order={3} ta="center" lh={1.2} c="white">
      All-in-One Backup Solution
    </Title>
    <Text c="gray.2" size="sm" fw={500} mt="xs" mb="xl">
      Securely save your chats with all the features you need.
    </Text>
    <Group justify="center" gap="md">
      <Stack align="center" gap={4}>
        <ThemeIcon size="lg" radius="lg">
          <Icon icon="tabler:files" />
        </ThemeIcon>
        <Text c="white" fz="xs">
          Formats
        </Text>
      </Stack>
      <Stack align="center" gap={4}>
        <ThemeIcon size="lg" radius="lg">
          <Icon icon="tabler:photo-video" />
        </ThemeIcon>
        <Text c="white" fz="xs">
          Media
        </Text>
      </Stack>
      <Stack align="center" gap={4}>
        <ThemeIcon size="lg" radius="lg">
          <Icon icon="tabler:filter" />
        </ThemeIcon>
        <Text c="white" fz="xs">
          Filters
        </Text>
      </Stack>
      <Stack align="center" gap={4}>
        <ThemeIcon size="lg" radius="lg">
          <Icon icon="tabler:shield-lock" />
        </ThemeIcon>
        <Text c="white" fz="xs">
          Secure
        </Text>
      </Stack>
    </Group>
  </Paper>
)

// --- Marquee Promo Tiles (1280x800px) --- //
// English: [MODIFIED] Component dimensions changed to 1280x800.
const MarqueeTileFeatureShowcase = () => (
  <Paper
    w={1280}
    h={800}
    withBorder
    radius="lg"
    p={60}
    style={{
      // English: Applying the consistent dark theme gradient.
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Stack h="100%" justify="center">
      <Grid align="center" gutter={40}>
        <Grid.Col span={5}>
          <Stack>
            {/* English: [MODIFIED] Font size adjusted and color changed for dark background. */}
            <Title order={1} fz={44} lh={1.2} c="white">
              The Ultimate WhatsApp Backup & Export Tool
            </Title>
            <Text size="xl" c="gray.3" mt="md">
              Securely save your conversations and media in multiple formats
              with advanced filtering.
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={7}>
          <Grid gutter="lg">
            <Grid.Col span={6}>
              <Card withBorder radius="md" p="lg">
                <Group>
                  <ThemeIcon variant="light" size="lg">
                    <Icon icon="tabler:files" />
                  </ThemeIcon>
                  <Text fw={700}>Multiple Formats</Text>
                </Group>
                <Text size="sm" c="dimmed" mt="xs">
                  Export to PDF, Excel, CSV, JSON, and more.
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={6}>
              <Card withBorder radius="md" p="lg">
                <Group>
                  <ThemeIcon variant="light" size="lg">
                    <Icon icon="tabler:shield-lock" />
                  </ThemeIcon>
                  <Text fw={700}>100% Private</Text>
                </Group>
                <Text size="sm" c="dimmed" mt="xs">
                  Your data never leaves your computer.
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={6}>
              <Card withBorder radius="md" p="lg">
                <Group>
                  <ThemeIcon variant="light" size="lg">
                    <Icon icon="tabler:photo-video" />
                  </ThemeIcon>
                  <Text fw={700}>Include Media</Text>
                </Group>
                <Text size="sm" c="dimmed" mt="xs">
                  Save images, videos, and documents.
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={6}>
              <Card withBorder radius="md" p="lg">
                <Group>
                  <ThemeIcon variant="light" size="lg">
                    <Icon icon="tabler:filter" />
                  </ThemeIcon>
                  <Text fw={700}>Advanced Filtering</Text>
                </Group>
                <Text size="sm" c="dimmed" mt="xs">
                  Filter by date range and keywords.
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

// --- Feature Mockups for Screenshots --- //
// English: These components represent the light-themed UI and remain unchanged.
const FeatureMockupExportFormats = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={5}>Export Options</Title>
      <Text c="dimmed" size="sm">
        Choose your desired format for the chat backup.
      </Text>
      <Radio.Group label="Format" defaultValue="pdf">
        <Group mt="xs">
          <Radio value="html" label="HTML (.zip)" />
          <Radio value="pdf" label="PDF" />
          <Radio value="xlsx" label="Excel" />
          <Radio value="csv" label="CSV" />
        </Group>
      </Radio.Group>
      <Button mt="lg" leftSection={<Icon icon="tabler:download" />}>
        Start Backup
      </Button>
    </Stack>
  </Card>
)

const FeatureMockupAdvancedFiltering = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={5}>Advanced Filtering</Title>
      <Text c="dimmed" size="sm">
        Pinpoint the exact messages you need.
      </Text>
      <DatePickerInput
        type="range"
        label="Filter by Date Range"
        placeholder="Pick start and end dates"
        value={[new Date(2025, 6, 10), new Date(2025, 6, 24)]}
        disabled
      />
      <TagsInput
        label="Filter by Keywords"
        placeholder="Add keywords"
        description="Only export messages containing these words."
        value={['contract', 'invoice', 'approved']}
        disabled
      />
    </Stack>
  </Card>
)

const FeatureMockupMediaBackup = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={5}>Include Media in Your Backup</Title>
      <Text c="dimmed" size="sm">
        Don't just save text—save the whole story.
      </Text>
      <Checkbox.Group
        label="Include Message Types"
        defaultValue={['chat', 'image', 'video']}
      >
        <Group mt="xs">
          <Checkbox value="chat" label="Text" />
          <Checkbox value="image" label="Images" />
          <Checkbox value="video" label="Videos" />
          <Checkbox value="document" label="Documents" />
        </Group>
      </Checkbox.Group>
    </Stack>
  </Card>
)

const FeatureMockupPrivacy = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack align="center">
      <ThemeIcon size={60} radius="xl" variant="light" color="teal">
        <Icon icon="tabler:shield-lock" fontSize={32} />
      </ThemeIcon>
      <Title order={4} mt="md">
        100% Private & Secure
      </Title>
      <Text c="dimmed" size="sm" ta="center">
        Your data is processed locally and never leaves your computer.
      </Text>
      <List
        mt="lg"
        spacing="sm"
        size="sm"
        center
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <Icon icon="tabler:check" fontSize={14} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <b>100% Local Processing:</b> Your conversations are never uploaded.
        </List.Item>
        <List.Item>
          <b>No Cloud Sync:</b> We have no access to your files or chats.
        </List.Item>
        <List.Item>
          <b>You Are in Control:</b> Save your backups on your own device.
        </List.Item>
      </List>
    </Stack>
  </Card>
)

const FeatureMockupSimpleInterface = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Start Your Backup in Seconds</Title>
      <Text c="dimmed" size="sm">
        Our intuitive interface makes saving your chats effortless.
      </Text>
      <Select
        mt="md"
        label="1. Select Chat"
        placeholder="Click to choose a conversation"
        data={[{ value: 'jane', label: 'Jane Doe' }]}
        defaultValue="jane"
        disabled
        leftSection={
          <Avatar
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png"
            size="sm"
          />
        }
      />
      <Select
        label="2. Choose Date Range"
        placeholder="Select a date range"
        data={[{ value: 'all', label: 'All Time' }]}
        defaultValue="all"
        disabled
      />
      <Radio.Group label="3. Select Format" defaultValue="pdf">
        <Group mt="xs">
          <Radio value="pdf" label="PDF" />
          <Radio value="xlsx" label="Excel" />
          <Radio value="html" label="HTML (.zip)" />
        </Group>
      </Radio.Group>
      <Button mt="lg" size="md" leftSection={<Icon icon="tabler:download" />}>
        Start Backup
      </Button>
    </Stack>
  </Card>
)

// --- New Reusable Marquee Tile for Feature Details ---
interface MarqueeTileFeatureDetailProps {
  icon: string
  title: string
  description: string
  featureComponent: React.ReactNode
}

const MarqueeTileFeatureDetail: React.FC<MarqueeTileFeatureDetailProps> = ({
  icon,
  title,
  description,
  featureComponent,
}) => (
  <Paper
    w={1280}
    h={800}
    withBorder
    radius="lg"
    p={60}
    style={{
      // English: Applying the consistent dark theme gradient.
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Stack h="100%" justify="center">
      <Grid align="center" gutter={50}>
        <Grid.Col span={5}>
          <Stack>
            <ThemeIcon size={60} radius="lg">
              <Icon icon={icon} fontSize={40} />
            </ThemeIcon>
            {/* English: [MODIFIED] Font size adjusted and color changed for dark background. */}
            <Title order={1} fz={44} lh={1.2} c="white">
              {title}
            </Title>
            <Text size="xl" fw={500} c="gray.1" mt="md">
              {description}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={7}>
          <Center h="100%">{featureComponent}</Center>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

const ScreenshotGallery: React.FC = () => {
  // English: Data for generating promotional assets.
  const screenshotData = [
    {
      title: 'Small Promo Tile: Option 1 (Grid Layout)',
      filename: 'small_promo_tile_grid.png',
      component: <SmallTileFeaturesGrid />,
    },
    {
      title: 'Small Promo Tile: Option 2 (List Layout)',
      filename: 'small_promo_tile_list.png',
      component: <SmallTileFeaturesList />,
    },
    {
      title: 'Small Promo Tile: Option 3 (Icons Layout)',
      filename: 'small_promo_tile_icons.png',
      component: <SmallTileFeaturesIcons />,
    },
    {
      title: 'Marquee Promo Tile: Feature Showcase (1280x800)',
      filename: 'marquee_promo_tile_features.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Multiple Export Formats (1280x800)',
      filename: 'feature_export_formats.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:files"
          title="Multiple Export Formats"
          description="Convert your chats into professional PDF, CSV, Excel, JSON, and TXT files for any purpose."
          featureComponent={<FeatureMockupExportFormats />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Advanced Filtering (1280x800)',
      filename: 'feature_advanced_filtering.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:filter"
          title="Advanced Filtering"
          description="Easily find what you need. Filter your exports by custom date ranges or multiple keywords to pinpoint specific messages."
          featureComponent={<FeatureMockupAdvancedFiltering />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Media Backups (1280x800)',
      filename: 'feature_media_backups.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:photo-video"
          title="Save Your Media"
          description="Don’t just save text. The Pro version allows you to back up and include all media types in your exports."
          featureComponent={<FeatureMockupMediaBackup />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Privacy First (1280x800)',
      filename: 'feature_privacy_secure.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:shield-lock"
          title="Your Privacy is Our Priority"
          description="This extension operates 100% locally on your computer. Your messages and media are never uploaded to any server, ensuring complete privacy."
          featureComponent={<FeatureMockupPrivacy />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Simple Interface (1280x800)',
      filename: 'feature_simple_interface.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:mouse"
          title="Easy-to-Use Interface"
          description="A clean and straightforward design allows you to back up your important chats in just a few clicks. No complicated steps."
          featureComponent={<FeatureMockupSimpleInterface />}
        />
      ),
    },
  ]
  return (
    <Stack>
      <Text c="dimmed" mb="md">
        Generate and download high-resolution promotional assets for the Chrome
        Web Store.
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
      component: <PromoIcon size={128} icon="tabler:camera" />,
      ref: icon1Ref,
      name: 'Icon-Option-1.png',
    },
    {
      component: <PromoIcon size={128} icon="tabler:file-export" />,
      ref: icon2Ref,
      name: 'Icon-Option-2.png',
    },
    {
      component: <PromoIcon size={128} icon="tabler:download" />,
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
            Chrome Web Store - Promotional Resources
          </Title>
          <Text c="dimmed" ta="center">
            Use these assets and text to create your store listing page.
          </Text>
          <Tabs defaultValue="screenshots">
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
                Screenshots & Tiles
              </Tabs.Tab>
              <Tabs.Tab
                value="keywords"
                leftSection={<Icon icon="tabler:tags" />}
              >
                Keywords (SEO)
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
                          {copied ? 'Copied' : 'Copy'}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                </Card>
              </Stack>
            </Tabs.Panel>
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
