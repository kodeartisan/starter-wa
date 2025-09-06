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
import { PRIMARY_ICON } from '@/constants'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import React, { useRef } from 'react'

// English: Using a darker gradient that matches the landing page's teal-to-lime theme with darker shades for a more prominent look.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-teal-8), var(--mantine-color-lime-8))'

// --- Marquee Promo Tiles (1280x800px) --- //

// English: [MODIFIED] Component dimensions changed to 1280x800.
// English: The feature card grid has been changed to a vertical stack.
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
      <Grid align="center">
        <Grid.Col span={4}>
          <Stack>
            <ThemeIcon
              size={90}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal', to: 'lime' }}
            >
              <Icon icon={PRIMARY_ICON} fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              The Ultimate WhatsApp Backup & Export Tool{' '}
            </Title>
            <Title order={2} c="white" fw={500} mt="md">
              {' '}
              Save your conversations and media in multiple formats with
              advanced filtering.{' '}
            </Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={5}>
          {/* English: Changed the Grid layout to a Stack for a vertical list of features. */}
          <Stack gap="lg">
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:files" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Multiple Formats{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                HTML, PDF, Excel, CSV, JSON, TXT.{' '}
              </Title>
            </Card>

            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:photo-video" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Include Media{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Save images, videos, and files.{' '}
              </Title>
            </Card>
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:filter" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Advanced Filtering{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Filter by date range and keywords.{' '}
              </Title>
            </Card>
          </Stack>
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
        {' '}
        Choose your desired format for the chat backup.{' '}
      </Text>
      <Radio.Group label="Format" defaultValue="pdf">
        <Group mt="xs">
          <Radio value="html" label="HTML" />
          <Radio value="pdf" label="PDF" />
          <Radio value="xlsx" label="Excel" />
          <Radio value="csv" label="CSV" />
          <Radio value="json" label="JSON" />
          <Radio value="txt" label="TXT" />
        </Group>
      </Radio.Group>
      <Button mt="lg" leftSection={<Icon icon="tabler:download" />}>
        {' '}
        Start Backup{' '}
      </Button>
    </Stack>
  </Card>
)

const FeatureMockupAdvancedFiltering = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={5}>Advanced Filtering</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Pinpoint the exact messages you need.{' '}
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
        {' '}
        Don't just save text—save the whole story.{' '}
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
        {' '}
        100% Private & Secure{' '}
      </Title>
      <Text c="dimmed" size="sm" ta="center">
        {' '}
        Your data is processed locally and never leaves your computer.{' '}
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
          {' '}
          <b>100% Local Processing:</b> Your conversations are never uploaded.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>No Cloud Sync:</b> We have no access to your files or chats.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>You Are in Control:</b> Save your backups on your own device.{' '}
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
        {' '}
        Our intuitive interface makes saving your chats effortless.{' '}
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
        {' '}
        Start Backup{' '}
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
      <Grid align="center">
        <Grid.Col span={4}>
          <Stack>
            <ThemeIcon size={90} radius="lg">
              <Icon icon={icon} fontSize={60} />
            </ThemeIcon>
            {/* English: [MODIFIED] Font size adjusted and color changed for dark background. */}
            <Title order={1} fz={50} lh={1.2} c="white">
              {' '}
              {title}{' '}
            </Title>
            <Title order={2} fw={500} c="gray.1" mt="md">
              {' '}
              {description}{' '}
            </Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Center h="100%">{featureComponent}</Center>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

const ScreenshotGallery: React.FC = () => {
  // English: Data for generating promotional assets.
  // MODIFIED: Removed the small promo tiles as requested.
  const screenshotData = [
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
          description="Convert into HTML, PDF, CSV, Excel, JSON, and TXT files."
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
          description="Filter your exports by custom date ranges or multiple keywords."
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
          description="Back up and include all media types."
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
          description="Your messages and media are never uploaded to any server, ensuring complete privacy."
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
        {' '}
        Generate and download high-resolution promotional assets for the Chrome
        Web Store.{' '}
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
  // English: A single ref for the promotional icon.
  const iconRef = useRef<HTMLDivElement>(null)

  // English: Defines the data for the single icon option to be mapped in the UI.
  // MODIFIED: Reduced to a single, preferred icon.
  const icons = [
    {
      component: <PromoIcon size={128} icon={PRIMARY_ICON} />,
      ref: iconRef,
      name: 'promotional_icon.png',
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
    // MODIFIED: Emojis have been re-added to the long description for better visual appeal.
    longDescription: `🛡️ Secure Your WhatsApp Conversations Forever

Never lose important conversations or precious memories again. WhatsBackup - WA Chats Backup & Exporter for WhatsApp is the ultimate tool for archiving your WhatsApp chats securely and easily. With a single click, convert your chat history into professional, organized files like PDF, Excel, and CSV, all processed 100% locally on your computer for maximum privacy.

✨ Key Features
💾 Unlimited Backups: Archive entire conversations with no message limits.
🖼️ Include Media: Save photos, videos, voice notes, and documents.
📄 Multiple Export Formats: Export to PDF, Excel, CSV, JSON, HTML, and TXT.
🔍 Advanced Filtering: Pinpoint messages with custom date ranges and keyword searches.
🔐 100% Secure: Your data never leaves your computer.

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

🚀 Get peace of mind knowing your WhatsApp history is safe, secure, and accessible in any format you need.

WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  // English: Added justification texts for the new Privacy tab.
  const justificationTexts = {
    singlePurpose: `The core purpose of this extension is to provide users with a secure and private way to back up their WhatsApp chats and export them into various file formats (PDF, CSV, Excel, etc.). All features, including chat selection, date filtering, keyword searching, and format conversion, are directly related to this single purpose of creating local, user-controlled backups of their WhatsApp data.`,
    storage: `The 'storage' permission is used to store essential user settings and license information locally on the user's device. This includes:
- The user's license key to unlock Pro features.
- An instance ID for license activation management.
- User preferences, such as default export settings.
This data is stored only on the user's computer and is crucial for providing a persistent and personalized experience without requiring a remote server or user accounts.`,
    scripting: `Content scripts are essential for the extension's functionality. They are used exclusively on web.whatsapp.com to:
1. Inject the user interface (the main modal for backup options) onto the page, allowing users to interact with the extension directly within the WhatsApp Web environment.
2. Communicate with the WhatsApp Web application's JavaScript context to securely fetch chat and message data for the backup process. This data is handled locally and is necessary to fulfill the extension's core purpose of exporting chats.`,
    hostWhatsapp: `The permission for "https://web.whatsapp.com/*" is required to allow the extension's content scripts to run on WhatsApp Web. The extension needs to access the DOM and interact with the page to inject its UI and retrieve chat data for the user to back up. The extension's functionality is entirely dependent on its ability to operate on this specific domain.`,
    hostLemonSqueezy: `The permission for "https://api.lemonsqueezy.com/*" is used to securely communicate with the Lemon Squeezy API for license validation and management. When a user activates a Pro license, the extension sends a request to this domain to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not transmit any personal chat data.`,
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
          <Tabs defaultValue="screenshots">
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
                Screenshots & Tiles{' '}
              </Tabs.Tab>
              <Tabs.Tab
                value="keywords"
                leftSection={<Icon icon="tabler:tags" />}
              >
                {' '}
                Keywords (SEO){' '}
              </Tabs.Tab>
              {/* ADDED: New tab for privacy justifications. */}
              <Tabs.Tab
                value="privacy"
                leftSection={<Icon icon="tabler:shield-lock" />}
              >
                {' '}
                Privacy Justifications{' '}
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
                          {' '}
                          {title.length} / 30 chars{' '}
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
                              {' '}
                              {copied ? 'Copied' : 'Copy'}{' '}
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
                          {' '}
                          {desc.length} / 132 chars{' '}
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
                              {' '}
                              {copied ? 'Copied' : 'Copy'}{' '}
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
            {/* MODIFIED: The layout is simplified and centered for a single icon. */}
            <Tabs.Panel value="icons" pt="lg">
              <Center>
                <Card withBorder radius="md" p="xl" w={300}>
                  <Stack align="center" justify="space-between">
                    <div ref={iconRef}>{icons[0].component}</div>
                    <Stack align="center" gap="md" mt="md">
                      <Text fw={500}>Promotional Icon (128x128 px)</Text>
                      <Button
                        variant="light"
                        onClick={() =>
                          handleDownloadIcon(icons[0].ref, icons[0].name)
                        }
                      >
                        {' '}
                        Download{' '}
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Center>
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
            {/* ADDED: New panel with privacy justification content. */}
            <Tabs.Panel value="privacy" pt="lg">
              <Stack gap="xl">
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={4}>Single Purpose Justification</Title>
                    <CopyButton value={justificationTexts.singlePurpose}>
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
                  <Textarea
                    mt="sm"
                    readOnly
                    value={justificationTexts.singlePurpose}
                    autosize
                    minRows={4}
                  />
                </Card>
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={4}>Storage Permission Justification</Title>
                    <CopyButton value={justificationTexts.storage}>
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
                  <Textarea
                    mt="sm"
                    readOnly
                    value={justificationTexts.storage}
                    autosize
                    minRows={5}
                  />
                </Card>
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={4}>Content Scripting Justification</Title>
                    <CopyButton value={justificationTexts.scripting}>
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
                  <Textarea
                    mt="sm"
                    readOnly
                    value={justificationTexts.scripting}
                    autosize
                    minRows={5}
                  />
                </Card>
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={4}>
                      Host Permission: https://web.whatsapp.com/*
                    </Title>
                    <CopyButton value={justificationTexts.hostWhatsapp}>
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
                  <Textarea
                    mt="sm"
                    readOnly
                    value={justificationTexts.hostWhatsapp}
                    autosize
                    minRows={4}
                  />
                </Card>
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={4}>
                      Host Permission: https://api.lemonsqueezy.com/*
                    </Title>
                    <CopyButton value={justificationTexts.hostLemonSqueezy}>
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
                  <Textarea
                    mt="sm"
                    readOnly
                    value={justificationTexts.hostLemonSqueezy}
                    autosize
                    minRows={4}
                  />
                </Card>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </MantineProvider>
  )
}

export default ResourcePage
