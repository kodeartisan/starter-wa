// src/tabs/resource-page.tsx
// English: This file provides promotional materials for the Chrome Web Store listing.
import PromoIcon from '@/components/Promo/PromoIcon'
import ScreenshotWrapper from '@/components/Promo/ScreenshotWrapper'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Code,
  Container,
  CopyButton,
  Grid,
  Group,
  MantineProvider,
  Paper,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'
import React from 'react'

// English: Using a darker gradient that matches the landing page's teal-to-lime theme for a prominent look.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-teal-8), var(--mantine-color-lime-8))'

// --- Marquee Promo Tile (1280x800px) ---
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
      <Grid align="center">
        <Grid.Col span={4}>
          <Stack>
            <ThemeIcon
              size={100}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal', to: 'lime' }}
            >
              <Icon icon="teenyicons:send-solid" fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              WA Super Group Bulk Sender{' '}
            </Title>
            <Title order={1} c="white" fw={500} mt="md">
              Send bulk messages, schedule campaigns with powerful anti-blocking
              features.{' '}
            </Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={6} offset={0}>
          <Stack gap="lg">
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:users-plus" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Manage Recipients
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Import from Groups, Excel & more.{' '}
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
                  <Icon icon="tabler:clock-hour-8" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Schedule in Advance{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Plan your outreach for the perfect time.{' '}
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
                  <Icon icon="tabler:shield-cog" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Broadcast with Confidence{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Protect your account from bans.{' '}
              </Title>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

// --- Feature Mockups for Screenshots ---
const FeatureMockupBroadcastCreationUI = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Create a New Broadcast</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Compose your message, add recipients, and configure settings—all in one
        place.{' '}
      </Text>
      <TextInput
        label="Campaign Name (Optional)"
        placeholder="e.g., Weekly Newsletter"
        defaultValue="Q4 Product Launch"
      />
      <Textarea
        label="Message"
        placeholder="Write a message... You can use {name} to personalize."
        defaultValue="Hi {name}, join us for our new product launch this Friday!"
        minRows={4}
      />
      <Button mt="sm">Send Broadcast</Button>
    </Stack>
  </Card>
)

const FeatureMockupRecipientManagement = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Manage Your Recipients</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Easily add contacts from multiple sources to build your perfect
        broadcast list.{' '}
      </Text>
      <Text fw={500} size="sm" mt="md">
        {' '}
        Add from...{' '}
      </Text>
      <Grid>
        <Grid.Col span={6}>
          <Button variant="outline" fullWidth>
            <Icon icon="tabler:users-group" />
            <Text ml="xs">Groups</Text>
          </Button>
        </Grid.Col>
        <Grid.Col span={6}>
          <Button variant="outline" fullWidth>
            <Icon icon="tabler:file-type-xls" />
            <Text ml="xs">Excel / CSV</Text>
          </Button>
        </Grid.Col>
        <Grid.Col span={6}>
          <Button variant="outline" fullWidth>
            <Icon icon="tabler:address-book" />
            <Text ml="xs">My Contacts</Text>
          </Button>
        </Grid.Col>
        <Grid.Col span={6}>
          <Button variant="outline" fullWidth>
            <Icon icon="tabler:keyboard" />
            <Text ml="xs">Manual Input</Text>
          </Button>
        </Grid.Col>
      </Grid>
    </Stack>
  </Card>
)

const FeatureMockupAntiBlocking = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Smart Anti-Blocking</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Send with confidence using features that mimic human behavior.{' '}
      </Text>
      <Paper mt="md" withBorder p="md" radius="sm">
        <Stack>
          <Group justify="space-between">
            <Text fw={500}>Batch Sending</Text>
          </Group>
          <Text size="xs" c="dimmed" mt={-10}>
            {' '}
            Send in smaller chunks with delays in between.{' '}
          </Text>
        </Stack>
      </Paper>
      <Paper withBorder p="md" radius="sm">
        <Stack>
          <Group justify="space-between">
            <Text fw={500}>Smart Pause</Text>
          </Group>
          <Text size="xs" c="dimmed" mt={-10}>
            {' '}
            Automatically pause sending outside of working hours.{' '}
          </Text>
        </Stack>
      </Paper>
      <Paper withBorder p="md" radius="sm">
        <Stack>
          <Text fw={500}>Account Warm-up</Text>
          <Text size="xs" c="dimmed" mt={-10}>
            {' '}
            Send initial messages slowly to improve account safety.{' '}
          </Text>
        </Stack>
      </Paper>
    </Stack>
  </Card>
)

const FeatureMockupCampaignHistory = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Track Your Campaigns</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Monitor the status of your broadcasts and export detailed reports.{' '}
      </Text>
      <Paper withBorder p="md" radius="sm" mt="md">
        <Stack>
          <Group justify="space-between">
            <Text fw={500}>Weekly Promo</Text>
            <Badge color="teal">Done</Badge>
          </Group>
          <Text size="sm">Recipients: 250 Total</Text>
          <Group grow>
            <Text size="xs" c="green">
              {' '}
              Success: 245{' '}
            </Text>
            <Text size="xs" c="red">
              {' '}
              Failed: 5{' '}
            </Text>
          </Group>
          <Button size="xs" variant="light" mt="xs">
            {' '}
            View Details & Export{' '}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  </Card>
)

const FeatureMockupPersonalizationAndTemplates = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Personalize & Save Time</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Use variables and templates to create unique messages in seconds.{' '}
      </Text>
      <Textarea
        mt="sm"
        label="Message"
        defaultValue="Hi {name}, don't miss our special event! {We'd love to see you|Hope you can make it}."
        minRows={4}
      />
      <Group mt="xs">
        <Button variant="light" size="compact-xs">
          {' '}
          {'{name}'}{' '}
        </Button>
        <Button variant="light" size="compact-xs">
          {' '}
          {'{number}'}{' '}
        </Button>
        <Button variant="light" size="compact-xs">
          {' '}
          {'{Hi|Hello}'}{' '}
        </Button>
      </Group>
      <Group justify="flex-end" mt="md">
        <Button
          variant="subtle"
          size="sm"
          leftSection={<Icon icon="tabler:device-floppy" />}
        >
          {' '}
          Save as Template{' '}
        </Button>
      </Group>
    </Stack>
  </Card>
)

const FeatureMockupSchedulingAndAutomation = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Schedule & Automate</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Plan ahead and automate your sending schedule for optimal timing.{' '}
      </Text>
      <Paper withBorder p="md" radius="sm" mt="md">
        <Stack>
          <Group justify="space-between">
            <Text fw={500}>Send Later</Text>
          </Group>
          <TextInput
            label="Date and Time"
            type="datetime-local"
            defaultValue="2025-10-15T10:30"
          />
        </Stack>
      </Paper>
      <Paper withBorder p="md" radius="sm" mt="sm">
        <Stack>
          <Group justify="space-between">
            <Text fw={500}>Smart Pause</Text>
          </Group>
          <Group grow>
            <TextInput label="Send between" type="time" defaultValue="09:00" />
            <TextInput label="And" type="time" defaultValue="17:00" />
          </Group>
        </Stack>
      </Paper>
    </Stack>
  </Card>
)

const FeatureMockupMediaBroadcasting = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Send Rich Media</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Capture attention by sending images, videos, and files.{' '}
      </Text>
      <Group mt="md" grow>
        <Button variant="default">Text</Button>
        <Button>Image</Button>
        <Button variant="default">Video</Button>
        <Button variant="default">File</Button>
      </Group>
      <Paper
        mt="sm"
        h={150}
        withBorder
        radius="sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'var(--mantine-color-gray-0)',
        }}
      >
        <ThemeIcon size={40} radius="xl" color="gray">
          <Icon icon="tabler:photo" />
        </ThemeIcon>
        <Text mt="xs" c="dimmed">
          Image_Promo.png
        </Text>
      </Paper>
    </Stack>
  </Card>
)

// --- Reusable Marquee Tile for Feature Details ---
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
      <Grid align="center">
        <Grid.Col span={4}>
          <Stack>
            <ThemeIcon size={90} radius="lg">
              <Icon icon={icon} fontSize={60} />
            </ThemeIcon>
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
        <Grid.Col span={6} offset={1}>
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
      filename: 'marquee_promo_tile_broadcast.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Main Interface (1280x800)',
      filename: 'feature_broadcast_main_ui.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:broadcast"
          title="Intuitive Broadcast Creation"
          description="Our streamlined interface lets you compose messages, manage recipients, and configure advanced settings—all in one place."
          featureComponent={<FeatureMockupBroadcastCreationUI />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Recipient Management (1280x800)',
      filename: 'feature_broadcast_recipients.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:users-plus"
          title="Flexible Recipient Management"
          description="Build your audience your way. Import from WhatsApp Groups, upload Excel/CSV files."
          featureComponent={<FeatureMockupRecipientManagement />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Media Broadcasting (1280x800)',
      filename: 'feature_broadcast_media.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:photo-plus"
          title="Send Rich Media Messages"
          description="Go beyond text. Make your broadcasts more engaging by sending images, videos, and important documents to capture attention."
          featureComponent={<FeatureMockupMediaBroadcasting />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Personalization & Templates (1280x800)',
      filename: 'feature_broadcast_personalization.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:letter-case"
          title="Personalize & Save Time"
          description="Engage your audience with personalized variables like {name}. Save unlimited message templates to streamline your workflow."
          featureComponent={<FeatureMockupPersonalizationAndTemplates />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Scheduling & Automation (1280x800)',
      filename: 'feature_broadcast_scheduling.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:calendar-cog"
          title="Advanced Scheduling"
          description="Plan campaigns in advance with the message scheduler and define sending hours with Smart Pause to reach your audience at the perfect time."
          featureComponent={<FeatureMockupSchedulingAndAutomation />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Anti-Blocking System (1280x800)',
      filename: 'feature_broadcast_anti_blocking.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:shield-cog"
          title="Broadcast Safely"
          description="Send with confidence. Protect your account with smart features like Batch Sending, Smart Pause, and Warm-up Mode that simulate human behavior."
          featureComponent={<FeatureMockupAntiBlocking />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Campaign Reports (1280x800)',
      filename: 'feature_broadcast_reports.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:chart-bar"
          title="Monitor Your Success"
          description="Track the real-time status of every message. Dive into detailed reports and export your campaign data to CSV or Excel for deeper analysis."
          featureComponent={<FeatureMockupCampaignHistory />}
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
  const storeListingText = {
    titles: [
      'WA Super Group Bulk Sender',
      'Bulk Sender for WhatsApp',
      'WhatsApp Broadcasting Tool',
    ],
    shortDescriptions: [
      'Send personalized bulk messages from WhatsApp Web. Import from Groups & Excel, Schedule Campaigns, and use Smart Anti-Blocking features.',
      'The ultimate broadcasting tool for WhatsApp. Send mass messages with personalization, media attachments, and advanced safety features.',
      'Manage bulk messaging campaigns on WhatsApp. Import unlimited contacts, schedule for later, and view detailed reports. Pro features available.',
    ],
    longDescription: `⚙️ The Ultimate WhatsApp Broadcasting Tool

Tired of manually sending the same message over and over? With WA Super Group Bulk Sender, you can run powerful, personalized bulk messaging campaigns directly from WhatsApp Web. This extension is designed for marketers, business owners, and community managers who need to communicate efficiently.

✨ Key Features
- **Unlimited Recipients**: Send messages to as many contacts as you need. No arbitrary limits.
- **Advanced Recipient Management**: Build your lists with unparalleled flexibility.
  - 👥 Import members directly from your WhatsApp Groups.
  - 📊 Import from Excel/CSV files with columns for number and name.
  - 📖 Select from your saved phone contacts.
  - ⌨️ Add numbers manually.
- **Personalize Every Message**: Increase engagement by using variables like {name} to make each message feel unique and personal.
- **Schedule Campaigns (Pro)**: Plan your outreach in advance. Schedule broadcasts to be sent at the perfect date and time for maximum impact.
- **Smart Anti-Blocking System (Pro)**: Send with confidence. Our system is packed with features to protect your account:
  - ⏱️ Randomized delays between messages.
  - 📦 Batch sending to break large campaigns into smaller, safer chunks.
  - ⏸️ Smart Pause to halt sending outside of your specified working hours.
  - 🔥 Account Warm-up mode to gradually increase sending speed for new campaigns.
- **Send All Media Types (Pro)**: Go beyond text. Broadcast images, videos, and documents to your entire contact list.
- **Save Unlimited Templates (Pro)**: Create and reuse message templates for common announcements, promotions, or replies to streamline your workflow.
- **Live Preview & Reporting**: See exactly how your message will look before sending and track the delivery status for every recipient. Export detailed campaign reports to CSV or Excel for analysis.
- **Privacy-Focused**: The extension operates locally in your browser. We never collect, store, or transmit your personal data, contacts, or chat information. Your privacy is guaranteed.

🤔 Who Is This For?
- **Marketers & Sales Teams**: Run promotional campaigns, announce new products, and follow up with leads in bulk.
- **Businesses & Organizations**: Keep customers, students, or patients informed with important updates and newsletters.
- **Community Managers**: Notify members about upcoming meetings, events, or important announcements quickly and reliably.

🚀 How It Works
1. Click the extension icon on the WhatsApp Web page.
2. Create a new broadcast campaign.
3. Add your recipients using any of the import methods.
4. Compose your personalized message, attach media, and configure the anti-blocking settings.
5. Send immediately or schedule it for later!

Upgrade your WhatsApp marketing and communication today. Stop the manual work and start broadcasting smarter!

---
WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension is an independent project and has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  const justificationTexts = {
    singlePurpose: `The extension's single purpose is to enable users to send bulk messages (broadcasts) on WhatsApp Web. All features—including recipient management (importing from groups, Excel, etc.), message composition with personalization, scheduling, and anti-blocking mechanisms—are directly tied to this core function of facilitating and managing broadcast campaigns within the WhatsApp Web interface.`,
    storage: `The 'storage' permission is used to locally store user settings, campaign data, and license information. This includes: saved message templates, recipient lists, broadcast history, the user's license key for Pro features, and an instance ID for license management. All data is kept on the user's device to ensure a consistent experience and maintain user privacy.`,
    scripting: `Content scripts are essential to inject the extension's user interface onto the web.whatsapp.com page. They also communicate with the WhatsApp Web application's context to securely perform actions on behalf of the user (like sending messages), which is necessary to fulfill the extension's core purpose.`,
    hostWhatsapp: `Permission for "https://web.whatsapp.com/*" is required for the extension to function. It allows the content scripts to run on WhatsApp Web, enabling the injection of its UI and interaction with the page to send broadcast messages.`,
    hostLemonSqueezy: `Permission for "https://api.lemonsqueezy.com/*" is used for secure license management. When a user activates a Pro license, the extension communicates with this API to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not involve any personal chat data.`,
  }

  const keywords = [
    'whatsapp bulk sender',
    'wa bulk message',
    'whatsapp marketing',
    'whatsapp broadcast',
    'send to group members',
    'whatsapp scheduler',
    'whatsapp automation',
    'wa sender pro',
    'whatsapp excel import',
    'whatsapp crm',
    'whatsapp business',
    'bulk whatsapp',
  ]
  const keywordsString = keywords.join(', ')

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
                <ScreenshotWrapper
                  title="Promotional Icon (128x128)"
                  filename="icon_128.png"
                >
                  <PromoIcon size={128} icon={'teenyicons:send-solid'} />
                </ScreenshotWrapper>
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
