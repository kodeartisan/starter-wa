// src/tabs/resource-page.tsx
// This page provides promotional materials for the Chrome Web Store listing.
import PromoIcon from '@/components/Promo/PromoIcon'
import ScreenshotWrapper from '@/components/Promo/ScreenshotWrapper'
import { PRIMARY_ICON } from '@/constants'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  Badge,
  Button,
  Card,
  Center,
  Code,
  Container,
  CopyButton,
  Fieldset,
  Grid,
  Group,
  List,
  MantineProvider,
  Paper,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core'
import '@mantine/core/styles.css'
import { DateTimePicker } from '@mantine/dates'
import '@mantine/dates/styles.css'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import React, { useRef } from 'react'

// A gradient background that matches the landing page's theme.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-teal-8), var(--mantine-color-lime-8))'

// The primary icon representing the Status Scheduler feature.
const STATUS_SCHEDULER_ICON = 'tabler:calendar-stats'

// --- START: New Mockups for Status Scheduler Feature ---

// Mockup of the main dashboard showing a list of scheduled and posted statuses.
const MockupStatusDashboard = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Status Management Dashboard</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Track all your statuses—drafts, scheduled, and posted—in one place.{' '}
      </Text>
      <Table striped highlightOnHover withTableBorder mt="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Status Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Weekend Promotion</Table.Td>
            <Table.Td>
              <Badge variant="light" leftSection={<Icon icon="tabler:photo" />}>
                Image
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge color="blue">Scheduled</Badge>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Morning Update</Table.Td>
            <Table.Td>
              <Badge
                variant="light"
                leftSection={<Icon icon="tabler:file-text" />}
              >
                Text
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge color="green">Posted</Badge>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>New Product Announcement</Table.Td>
            <Table.Td>
              <Badge variant="light" leftSection={<Icon icon="tabler:video" />}>
                Video
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge color="gray">Draft</Badge>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  </Card>
)

// Mockup showing the Pro scheduling feature.
const MockupCreateStatusPro = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Create & Schedule Status</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Craft your content, set the time, and let us do the posting.{' '}
      </Text>
      <Fieldset legend="Status Type: Image">
        <Center
          p="lg"
          style={{
            border: '2px dashed var(--mantine-color-gray-3)',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <Stack align="center">
            <Icon
              icon="tabler:photo-up"
              fontSize={48}
              color="var(--mantine-color-gray-5)"
            />
            <Text c="dimmed">promo_banner.jpg</Text>
          </Stack>
        </Center>
        <Textarea
          label="Caption"
          placeholder="50% off this weekend!"
          disabled
          mt="md"
        />
      </Fieldset>
      <Fieldset
        legend={
          <Group gap="xs">
            <Text>Automated Scheduling</Text>
          </Group>
        }
      >
        <Switch checked label="Schedule for later" disabled />
        <DateTimePicker
          label="Post Date & Time"
          value={new Date()}
          disabled
          mt="sm"
        />
      </Fieldset>
    </Stack>
  </Card>
)

// Mockup for the Privacy/Security feature slide.
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
        Your status drafts and media files are stored locally in your browser
        and are never seen, stored, or uploaded by us.{' '}
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
          <b>Local Processing:</b> Uses official WhatsApp Web functions in your
          browser.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>No Data Storage:</b> Your content is never saved by us.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>You Are in Control:</b> All actions happen on your own computer.{' '}
        </List.Item>
      </List>
    </Stack>
  </Card>
)

// --- START: Two New Mockups ---

// Mockup showcasing the ability to upload and schedule images or videos.
const MockupRichMediaPosting = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Rich Media Posting</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Upload and schedule engaging images or videos for your status. Capture
        your audience's attention.{' '}
      </Text>
      <Center
        p="lg"
        style={{
          border: '2px dashed var(--mantine-color-teal-3)',
          borderRadius: 'var(--mantine-radius-md)',
          backgroundColor: 'var(--mantine-color-teal-0)',
        }}
      >
        <Stack align="center" gap="xs">
          <Icon
            icon="tabler:photo-video"
            fontSize={60}
            color="var(--mantine-color-teal-6)"
          />
          <Text fw={500} c="teal.8">
            {' '}
            Upload Your Image or Video{' '}
          </Text>
          <Button variant="outline" color="teal" size="xs">
            {' '}
            Select File{' '}
          </Button>
        </Stack>
      </Center>
      <List
        mt="md"
        spacing="sm"
        size="sm"
        center
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <Icon icon="tabler:check" fontSize={14} />
          </ThemeIcon>
        }
      >
        <List.Item> Supported image formats: JPG, PNG, GIF </List.Item>
        <List.Item> Supported video formats: MP4, MOV </List.Item>
        <List.Item> Secure & encrypted media uploads (local) </List.Item>
      </List>
    </Stack>
  </Card>
)

// Mockup emphasizing time-saving and automation.
const MockupTimeSavingAutomation = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack align="center">
      <ThemeIcon
        size={60}
        radius="xl"
        variant="gradient"
        gradient={{ from: 'teal', to: 'lime' }}
      >
        <Icon icon="tabler:clock-hour-4" fontSize={32} />
      </ThemeIcon>
      <Title order={4} mt="md">
        {' '}
        Save Time with Status Automation{' '}
      </Title>
      <Text c="dimmed" size="sm" ta="center">
        {' '}
        Spend less time on manual tasks and more time growing your business.
        Automated posting keeps you engaged, even when you're away from your
        desk.{' '}
      </Text>
      <Grid mt="lg" gutter="md">
        <Grid.Col span={6}>
          <Card withBorder shadow="xs" p="md">
            <Stack align="center" gap="xs">
              <Icon
                icon="tabler:alarm-minus"
                fontSize={36}
                color="var(--mantine-color-red-6)"
              />
              <Text fw={500} size="sm" ta="center">
                {' '}
                Without Scheduler{' '}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                {' '}
                Manual posting, time-consuming, inconsistent presence.{' '}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card withBorder shadow="xs" p="md">
            <Stack align="center" gap="xs">
              <Icon
                icon="tabler:alarm-plus"
                fontSize={36}
                color="var(--mantine-color-teal-6)"
              />
              <Text fw={500} size="sm" ta="center">
                {' '}
                With Scheduler{' '}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                {' '}
                Set & forget, 24/7 engagement, save hours of work.{' '}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  </Card>
)

// --- END: Two New Mockups ---

// --- Page Components ---

const MarqueeTileFeatureShowcase = () => (
  <Paper
    w={1280}
    h={800}
    withBorder
    radius="lg"
    p={60}
    style={{
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Stack h="100%" justify="center">
      <Grid align="center" gutter={40}>
        <Grid.Col span={5}>
          <Stack>
            <ThemeIcon
              size={90}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal', to: 'lime' }}
            >
              <Icon icon={STATUS_SCHEDULER_ICON} fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              Automate Your WhatsApp Status Like a Pro{' '}
            </Title>
            <Title order={2} c="white" fw={500} mt="md">
              {' '}
              Keep your audience engaged, save time, and boost your reach. The
              essential tool for marketers and business owners.{' '}
            </Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack gap="lg">
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={44}
                >
                  <Icon icon="tabler:calendar-time" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Schedule Posts{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Plan status content for days or weeks in advance.{' '}
              </Text>
            </Card>
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={44}
                >
                  <Icon icon="tabler:photo-video" fontSize={30} />
                </ThemeIcon>
                <Title fw={700} order={2}>
                  {' '}
                  Use Rich Media{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Engage your audience with scheduled images & videos.{' '}
              </Text>
            </Card>
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={40}
                >
                  <Icon icon="tabler:dashboard" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Content Dashboard{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Manage all your statuses from one central place.{' '}
              </Text>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

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
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Stack h="100%" justify="center">
      <Grid align="center" gutter={50}>
        <Grid.Col span={4}>
          <Stack>
            <ThemeIcon size={60} radius="lg">
              <Icon icon={icon} fontSize={40} />
            </ThemeIcon>
            <Title order={1} fz={44} lh={1.2} c="white">
              {' '}
              {title}{' '}
            </Title>
            <Text size="xl" fw={500} c="gray.1" mt="md">
              {' '}
              {description}{' '}
            </Text>
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
  const screenshotData = [
    {
      title: 'Marquee Promo Tile: Feature Showcase (1280x800)',
      filename: 'marquee_promo_tile_features.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Organized Dashboard (1280x800)',
      filename: 'feature_dashboard.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:layout-dashboard"
          title="Your Content, Organized"
          description="Manage all your scheduled, posted, and draft statuses from a single, powerful dashboard. Stay on top of your content calendar with ease."
          featureComponent={<MockupStatusDashboard />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Plan Content in Advance (1280x800)',
      filename: 'feature_scheduling_pro.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:calendar-plus"
          title="Plan Content in Advance"
          description="Craft your text, image, or video status, pick a future date and time, and let us handle the rest. Perfect for campaigns, announcements, and daily updates."
          featureComponent={<MockupCreateStatusPro />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Rich Media Posting (1280x800)',
      filename: 'feature_rich_media.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:photo-video"
          title="Post Rich Media"
          description="Upload and schedule engaging images or captivating videos for your status. Capture your audience's attention with stunning visual content."
          featureComponent={<MockupRichMediaPosting />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Effortless Time Saving (1280x800)',
      filename: 'feature_time_saving.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:clock-hour-4"
          title="Save Time with Automation"
          description="Focus on what matters most. Automate your status updates to maintain a consistent presence, freeing up your time for core business tasks."
          featureComponent={<MockupTimeSavingAutomation />}
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
          description="This extension operates 100% locally on your computer. Your status drafts and files are never uploaded to any server, ensuring complete privacy."
          featureComponent={<FeatureMockupPrivacy />}
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

const ResourcePage = () => {
  const iconRef = useRef<HTMLDivElement>(null)
  const icons = [
    {
      component: <PromoIcon size={128} icon={PRIMARY_ICON} />,
      ref: iconRef,
      name: 'promotional_icon.png',
    },
  ]

  const storeListingText = {
    titles: [
      'Status Scheduler for WhatsApp',
      'Automate & Schedule WA Statuses',
      'WhatsApp Status Planner & Poster',
    ],
    shortDescriptions: [
      'Schedule text, image, and video statuses to post automatically. Save time, increase engagement, and plan your content in advance.',
      'The essential tool for marketers. Plan your WhatsApp statuses ahead of time. Supports images, videos, and fully automated posting.',
      'Automate your WhatsApp presence. Create statuses, schedule them, and let the extension post them for you at the perfect time.',
    ],
    longDescription: `🚀 Elevate Your Audience Engagement with Automatic Status Scheduling!

Tired of manually posting WhatsApp statuses every day? Status Scheduler for WhatsApp is the ultimate tool to automate your presence, save you precious time, and keep your audience consistently engaged.

✨ Key Features
- 🗓️ Schedule & Forget: Plan your status content for days, weeks, or even months in advance. Set the perfect time, and we'll post it for you.
- 📸 Rich Media: Go beyond text! Schedule stunning images and captivating videos to grab your contacts' attention.
- 📋 Full Content Dashboard: Manage all your statuses—drafts, scheduled, and already posted—from one clean, intuitive interface.
- 🛡️ Safe & Reliable: Built with safety first, our tool interacts responsibly with WhatsApp Web to ensure reliable posting without compromising your account.
- ⏰ Save Time: Focus on your business. Spend less time on manual tasks and more time on what matters.

🤔 Who Is This For?
- 💼 Digital Marketers: Plan and automate promotional campaigns, product launches, and daily deals.
- 📈 Business Owners: Maintain a consistent brand presence and keep your customers informed of the latest news.
- 🎨 Content Creators & Influencers: Share your work, behind-the-scenes content, and announcements automatically.
- 👥 Community Managers: Send scheduled updates, reminders, and news to your community.

🚀 Get started in seconds and take control of your WhatsApp content strategy!

WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  const justificationTexts = {
    singlePurpose: `The core purpose of this extension is to allow users to create, manage, and automatically schedule WhatsApp statuses. All features, such as text/image/video status creation, the management dashboard, and scheduling controls, are directly related to this single purpose of automating and planning status content.`,
    storage: `The 'storage' permission is used to store essential user settings and license information locally on the user's device. This includes:
- The user's license key to unlock Pro features.
- An instance ID for license activation management.
- User-created data such as status drafts and references to related media files, which are stored locally in IndexedDB for persistence.
This data is stored only on the user's computer and is crucial for providing a persistent and personalized experience without requiring a remote server or user accounts.`,
    scripting: `Content scripts are essential for the extension's functionality. They are used exclusively on web.whatsapp.com to:
1. Inject the user interface (the main modal for managing statuses) onto the page.
2. Communicate with the WhatsApp Web JavaScript context to securely post the scheduled statuses on the user's behalf. This process is handled locally and is necessary to fulfill the extension's core purpose.`,
    hostWhatsapp: `The permission for "https://web.whatsapp.com/*" is required to allow the extension's content scripts to run on WhatsApp Web. The extension needs to access the DOM and interact with the page to inject its UI and perform the status posting on the user's behalf. The extension's functionality is entirely dependent on its ability to operate on this specific domain.`,
    hostLemonSqueezy: `The permission for "https://api.lemonsqueezy.com/*" is used to securely communicate with the Lemon Squeezy API for license validation and management. When a user activates a Pro license, the extension sends a request to this domain to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not transmit any personal data or status content.`,
  }

  const keywords = [
    'whatsapp status scheduler',
    'whatsapp status planner',
    'schedule whatsapp status',
    'whatsapp marketing automation',
    'auto post whatsapp status',
    'whatsapp status automation',
    'image status scheduler',
    'video status scheduler',
    'whatsapp content planner',
    'status auto poster',
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
                          {' '}
                          {copied ? 'Copied' : 'Copy'}{' '}
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
                          {' '}
                          {copied ? 'Copied' : 'Copy'}{' '}
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
                          {' '}
                          {copied ? 'Copied' : 'Copy'}{' '}
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
                      {' '}
                      Host Permission: https://web.whatsapp.com/*{' '}
                    </Title>
                    <CopyButton value={justificationTexts.hostWhatsapp}>
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
                      {' '}
                      Host Permission: https://api.lemonsqueezy.com/*{' '}
                    </Title>
                    <CopyButton value={justificationTexts.hostLemonSqueezy}>
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
