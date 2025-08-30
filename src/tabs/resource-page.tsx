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
  Switch,
  Tabs,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import '@mantine/core/styles.css'
import { DatePickerInput, DateTimePicker } from '@mantine/dates'
import '@mantine/dates/styles.css'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import React, { useRef } from 'react'

// English: Using a darker gradient that matches the landing page's teal-to-lime theme with darker shades for a more prominent look.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-teal-8), var(--mantine-color-lime-8))'

// English: Overriding the primary icon to better represent the Direct Chat feature.
const DIRECT_CHAT_ICON = 'tabler:message-circle-plus'

// --- START: New Mockups for Direct Chat Feature ---

// Mockup of the simple, free-to-use direct chat interface.
const MockupDirectChatSimple = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Send a Message in Seconds</Title>
      <Text c="dimmed" size="sm">
        {' '}
        No more saving contacts for a one-time chat.{' '}
      </Text>
      <TextInput
        label="1. Enter WhatsApp Number"
        placeholder="e.g., 6281234567890 (with country code)"
        disabled
      />
      <Textarea
        label="2. Write Your Message"
        placeholder="Hello, I'm interested in the item you listed..."
        minRows={4}
        disabled
      />
      <Button
        mt="md"
        size="md"
        leftSection={<Icon icon="tabler:brand-whatsapp" />}
      >
        {' '}
        Send Message{' '}
      </Button>
    </Stack>
  </Card>
)

// Mockup showing the Pro feature of sending media attachments.
const MockupDirectChatWithMedia = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Send More Than Just Text</Title>
      <TextInput label="WhatsApp Number" value="6281234567890" disabled />
      <Tabs defaultValue="image" variant="pills" mt="xs">
        <Tabs.List grow>
          <Tabs.Tab value="text">Text</Tabs.Tab>
          <Tabs.Tab value="image" color="teal">
            {' '}
            Image{' '}
          </Tabs.Tab>
          <Tabs.Tab value="video">Video</Tabs.Tab>
          <Tabs.Tab value="file">File</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="image" pt="md">
          <Center
            p="xl"
            style={{
              border: '2px dashed var(--mantine-color-gray-3)',
              borderRadius: 'var(--mantine-radius-md)',
            }}
          >
            <Stack align="center">
              <Icon
                icon="tabler:photo"
                fontSize={48}
                color="var(--mantine-color-gray-5)"
              />
              <Text c="dimmed">Image_Preview.jpg</Text>
            </Stack>
          </Center>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  </Card>
)

// ++ START: MODIFIED - Added a mockup for the templates feature.
// Mockup showing the Pro feature of using message templates.
const MockupDirectChatTemplates = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Save Time with Templates</Title>
      <Text c="dimmed" size="sm">
        Create, save, and reuse messages for common replies or greetings.
      </Text>
      <Textarea
        label="Your Message"
        placeholder="Thank you for your inquiry. Our business hours are..."
        minRows={3}
        disabled
        value="Thank you for your inquiry. Our business hours are Monday to Friday, 9 AM to 5 PM."
      />
      <Group justify="flex-end">
        <Button
          variant="light"
          leftSection={<Icon icon="tabler:template" />}
          disabled
        >
          Use Template
        </Button>
      </Group>
    </Stack>
  </Card>
)
// ++ END: MODIFIED

// Mockup for the Privacy/Security feature slide, which is still relevant.
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
        Your messages are sent directly through WhatsApp Web. We never see or
        store your data.{' '}
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
          <b>Direct Sending:</b> Uses the official WhatsApp Web interface.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>No Data Storage:</b> Your conversations are never saved by us.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>You Are in Control:</b> All actions happen on your own computer.{' '}
        </List.Item>
      </List>
    </Stack>
  </Card>
)

// --- END: New Mockups for Direct Chat Feature ---

// --- Marquee Promo Tiles (1280x800px) ---
// ++ START: MODIFIED - Added "Templates" feature to the showcase tile.
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
              <Icon icon={DIRECT_CHAT_ICON} fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              The Fastest Way to Start a Chat{' '}
            </Title>
            <Title order={1} c="white" fw={500} mt="md">
              {' '}
              Message any number without saving it to your contacts.
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
                  <Icon icon="tabler:device-mobile-message" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Instant Messaging{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                Chat without saving the contact.
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
                  <Icon icon="tabler:paperclip" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  Send Media
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Send images, videos, documents.{' '}
              </Text>
            </Card>
            {/* English: Added a new feature card for templates. */}
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={44}
                >
                  <Icon icon="tabler:template" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Templates{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Save and reuse messages.{' '}
              </Text>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)
// ++ END: MODIFIED

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
        <Grid.Col span={5}>
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
        <Grid.Col span={7}>
          <Center h="100%">{featureComponent}</Center>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

// ++ START: MODIFIED - Added a new screenshot entry for the templates feature.
const ScreenshotGallery: React.FC = () => {
  const screenshotData = [
    {
      title: 'Marquee Promo Tile: Feature Showcase (1280x800)',
      filename: 'marquee_promo_tile_features.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Simple Interface (1280x800)',
      filename: 'feature_simple_interface.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:mouse"
          title="Clean & Intuitive Interface"
          description="Just enter a number, type your message, and send. It's that simple to start a conversation without cluttering your contacts."
          featureComponent={<MockupDirectChatSimple />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Send Rich Media (1280x800)',
      filename: 'feature_send_media.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:photo-video"
          title="Go Beyond Text"
          description="Send images, videos, documents, and more. Perfect for sharing quotes, portfolios, or product photos."
          featureComponent={<MockupDirectChatWithMedia />}
        />
      ),
    },
    // English: Added a new screenshot definition for message templates.
    {
      title: 'Feature Screenshot: Message Templates (1280x800)',
      filename: 'feature_message_templates.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:template"
          title="Save Time with Templates"
          description="Create and reuse message templates for common replies, greetings, or important information. A huge time-saver for business and personal use."
          featureComponent={<MockupDirectChatTemplates />}
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
// ++ END: MODIFIED

const ResourcePage = () => {
  const iconRef = useRef<HTMLDivElement>(null)
  const icons = [
    {
      component: <PromoIcon size={128} icon={DIRECT_CHAT_ICON} />,
      ref: iconRef,
      name: 'promotional_icon.png',
    },
  ]

  const storeListingText = {
    titles: [
      'Direct Message for WhatsApp',
      'Start Chat without Saving Contact',
      'Quick Message for WhatsApp Web',
    ],
    shortDescriptions: [
      'Instantly send WhatsApp messages to any number without adding them to your contacts. Fast, simple, and private.',
      'Type a number, write your message, and hit send. The easiest way to start a WhatsApp chat without saving the contact first.',
      'The ultimate time-saver for WhatsApp Web. Send messages to unsaved numbers, attach files, and schedule them for later.',
    ],
    longDescription: `📱 Stop Cluttering Your Contacts!

Tired of saving a number just to send one WhatsApp message? WhatsDirect - WA Direct Chats for WhatsApp is the ultimate tool for starting conversations quickly and efficiently, right from your computer.

✨ Key Features
- 🚀 Instant Chat: Enter any phone number and start chatting immediately. No need to save the contact first!
- 📎 Send Anything: Go beyond text. Send images, videos, documents, and location pins
- 📝 Message Templates : Save and reuse frequently sent messages to save even more time.
- 🔒 100% Private & Secure: The extension uses the official WhatsApp Web interface to send messages. Your data never leaves your computer, and we never see or store it.

🤔 Who Is This For?
- 💼 Business & Sales Professionals: Quickly message new leads, send quotes, and provide customer support without bloating your contact list.
- 🛒 Online Shoppers & Sellers: Easily communicate with buyers or sellers on marketplaces without exchanging contact details permanently.
- 🗓️ Event Organizers: Send details or reminders to attendees without saving dozens of numbers.
- 🙋‍♀️ Anyone who values their time and privacy: The perfect tool for any one-time conversation.

🚀 Get started in seconds and change the way you use WhatsApp Web forever!

WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  const justificationTexts = {
    singlePurpose: `The core purpose of this extension is to allow users to initiate a WhatsApp conversation with any phone number directly from WhatsApp Web, without first needing to save that number to their device's contact list. All features, such as the number input field, message composer, and media attachment options, are directly related to this single purpose of streamlining one-time or infrequent communication on WhatsApp.`,
    storage: `The 'storage' permission is used to store essential user settings and license information locally on the user's device. This includes:
- The user's license key to unlock Pro features.
- An instance ID for license activation management.
- User preferences, such as saved message templates.
This data is stored only on the user's computer and is crucial for providing a persistent and personalized experience without requiring a remote server or user accounts.`,
    scripting: `Content scripts are essential for the extension's functionality. They are used exclusively on web.whatsapp.com to:
1. Inject the user interface (the main modal for sending messages) onto the page, allowing users to interact with the extension directly within the WhatsApp Web environment.
2. Communicate with the WhatsApp Web application's JavaScript context to securely initiate the sending of messages. This process is handled locally and is necessary to fulfill the extension's core purpose.`,
    hostWhatsapp: `The permission for "https://web.whatsapp.com/*" is required to allow the extension's content scripts to run on WhatsApp Web. The extension needs to access the DOM and interact with the page to inject its UI and send messages on the user's behalf. The extension's functionality is entirely dependent on its ability to operate on this specific domain.`,
    hostLemonSqueezy: `The permission for "https://api.lemonsqueezy.com/*" is used to securely communicate with the Lemon Squeezy API for license validation and management. When a user activates a Pro license, the extension sends a request to this domain to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not transmit any personal chat data.`,
  }

  const keywords = [
    'whatsapp direct',
    'start chat',
    'unsaved number',
    'whatsapp without saving contact',
    'quick message',
    'direct message',
    'send whatsapp',
    'whatsapp web',
    'wa direct',
    'message unsaved number',
    'no contact whatsapp',
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
