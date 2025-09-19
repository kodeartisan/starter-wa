// src/tabs/resource-page.tsx
// English: This file provides promotional materials for the Chrome Web Store listing.
import PromoIcon from '@/components/Promo/PromoIcon'
import ScreenshotWrapper from '@/components/Promo/ScreenshotWrapper'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
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
        <Grid.Col span={5}>
          <Stack>
            <ThemeIcon
              size={90}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal', to: 'lime' }}
            >
              <Icon icon="tabler:message-circle-plus" fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              Direct Chat for WhatsApp{' '}
            </Title>
            <Title order={2} c="white" fw={500} mt="md">
              {' '}
              Instantly chat with anyone on WhatsApp without saving their
              number. Send text, images, videos, files, and more.{' '}
            </Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack gap="lg">
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:keyboard" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Enter Any Number{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Start chats with unsaved contacts.{' '}
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
                  <Icon icon="tabler:paperclip" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Send All Media Types{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Send images, videos, docs & more.
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
                  <Icon icon="tabler:address-book-off" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Keep Contacts Clean{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                No more clutter for one-time chats.{' '}
              </Title>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

// --- Feature Mockups for Screenshots ---
const FeatureMockupDirectChatUI = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Direct Chat Interface</Title>
      <Text c="dimmed" size="sm">
        {' '}
        A clean and simple form to start your conversation quickly.{' '}
      </Text>
      <TextInput
        label="WhatsApp Number"
        placeholder="e.g., 6281234567890"
        description="Enter the full number with country code."
        defaultValue="12025550181"
      />
      <Textarea
        label="Message"
        placeholder="Write a message..."
        defaultValue="Hello! I'm interested in the item you listed for sale."
        minRows={4}
      />
      <Button mt="sm">Send Message</Button>
    </Stack>
  </Card>
)

const FeatureMockupMessageTypeSelection = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Go Beyond Text</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Upgrade to unlock all message types for richer conversations.{' '}
      </Text>
      <Text fw={500} size="sm" mt="md">
        Message Type
      </Text>
      <Grid>
        <Grid.Col span={4}>
          <Button variant="filled" fullWidth>
            <Icon icon="tabler:text-size" fontSize={24} />
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button variant="default" fullWidth>
            <Icon icon="tabler:photo" fontSize={24} />
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button variant="default" fullWidth>
            <Icon icon="tabler:video" fontSize={24} />
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button variant="default" fullWidth>
            <Icon icon="tabler:file" fontSize={24} />
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button variant="default" fullWidth>
            <Icon icon="tabler:map-pin" fontSize={24} />
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button variant="default" fullWidth>
            <Icon icon="tabler:user-square" fontSize={24} />
          </Button>
        </Grid.Col>
      </Grid>
    </Stack>
  </Card>
)

const FeatureMockupImageUpload = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Attach Images, Videos & Files</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Easily upload media with a caption, just like in a normal chat.{' '}
      </Text>
      <Paper
        mt="md"
        withBorder
        p="xl"
        radius="md"
        style={{ borderStyle: 'dashed' }}
      >
        <Center>
          <Stack align="center">
            <Icon icon="tabler:photo" fontSize={50} />
            <Text>Drag & drop here or click to select a file</Text>
            <Text size="xs" c="dimmed">
              Max size: 3MB | Formats: JPG, PNG, WEBP
            </Text>
          </Stack>
        </Center>
      </Paper>
      <Textarea placeholder="Enter your caption here" />
    </Stack>
  </Card>
)

const FeatureMockupContactVCard = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Send Contacts (vCard)</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Share contact details from your own contact list without leaving the
        chat.{' '}
      </Text>
      <Group justify="space-between" mt="md">
        <Text fw={500}>Selected Contacts (1)</Text>
        <Button
          size="xs"
          variant="outline"
          leftSection={<Icon icon="tabler:address-book" fontSize={16} />}
        >
          Select Contact(s)
        </Button>
      </Group>
      <Paper withBorder p="xs" radius="sm" mt="xs">
        <Group justify="space-between">
          <Text size="sm">Alice Johnson</Text>
          <ActionIcon color="red" variant="transparent">
            <Icon icon="tabler:trash" fontSize={16} />
          </ActionIcon>
        </Group>
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
      filename: 'marquee_promo_tile_direct_chat.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Main Interface (1280x800)',
      filename: 'feature_direct_chat_main_ui.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:keyboard"
          title="Enter Any Number"
          description="Simply type or paste any WhatsApp number with its country code to start a direct conversation instantly."
          featureComponent={<FeatureMockupDirectChatUI />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Message Types (1280x800)',
      filename: 'feature_direct_chat_message_types.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:apps"
          title="Choose Your Message Type"
          description="Send simple text, images, videos, files, locations, and more."
          featureComponent={<FeatureMockupMessageTypeSelection />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Attach Media (1280x800)',
      filename: 'feature_direct_chat_attach_media.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:paperclip"
          title="Attach Media & Files"
          description="Easily upload photos, videos, or documents and add a caption before sending to an unsaved number."
          featureComponent={<FeatureMockupImageUpload />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Send Contacts (1280x800)',
      filename: 'feature_direct_chat_send_vcard.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:user-square"
          title="Share Contacts Instantly (Pro)"
          description="Need to share someone's contact details? Select a contact from your address book and send it as a vCard."
          featureComponent={<FeatureMockupContactVCard />}
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
      'Direct Chat for WhatsApp',
      'Chat Without Saving Numbers',
      'Send Media to Unsaved Contacts',
    ],
    shortDescriptions: [
      'Start a WhatsApp chat with anyone without saving their number. Send text, images, videos, files, vCards, and more.',
      'The quickest way to message unsaved numbers on WhatsApp. Supports all media types, including documents and locations.',
      'Stop cluttering your contacts. Type in a number, write your message, and send instantly. Perfect for business and personal use.',
    ],
    longDescription: `⚙️ The Fastest Way to Chat on WhatsApp

Tired of your phone's contact list being filled with numbers you only need for a one-time conversation? With Direct Chat for WhatsApp, you can start a conversation with any WhatsApp number instantly, without the hassle of saving it to your address book first.

This extension integrates seamlessly into WhatsApp Web, providing a simple interface to supercharge your messaging.

✨ Key Features
- **Chat Without Saving**: The core feature. Enter any phone number and start chatting right away. Keep your address book clean and organized.
- **Send Anything (Pro)**: Go beyond simple text. The Pro version unlocks the ability to send:
    - 🖼️ Images & Videos
    - 📄 Documents & Files
    - 📍 Locations
    - 👤 Contact Cards (vCards)
- **Use Message Templates**: Save time by creating and reusing templates for frequently sent messages. The free version includes 1 template, while Pro offers unlimited templates.
- **Simple & Intuitive**: A clean, straightforward interface designed to get your message sent in seconds.
- **Privacy-Focused**: The extension operates locally in your browser. We never collect, store, or transmit your personal data, contacts, or chat information. Your privacy is guaranteed.

🤔 Who Is This For?
- **Sales & Business Professionals**: Quickly send quotes, brochures, or follow-up messages to new leads.
- **Online Shoppers & Sellers**: Easily contact sellers or buyers on marketplaces without adding them as a contact.
- **Event Organizers**: Send location pins or event details to attendees and vendors.
- **Anyone Needing Convenience**: Message a new acquaintance, a service provider, or a delivery person without the unnecessary step of saving their number.

🚀 How It Works
1. Click the extension icon on the WhatsApp Web page.
2. Enter the full WhatsApp number, including the country code.
3. Type your message or select a media type to send.
4. Click "Send Message"!

Upgrade your WhatsApp experience today. Stop the contact clutter and start chatting smarter!

---
WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension is an independent project and has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  const justificationTexts = {
    singlePurpose: `The extension's single purpose is to allow users to initiate conversations on WhatsApp with phone numbers that are not saved in their contacts. All features—including entering a number, composing a text message, and attaching various media types (images, files, locations, vCards)—are directly tied to this core function of facilitating direct chats within the WhatsApp Web interface.`,
    storage: `The 'storage' permission is used to locally store user settings and license information. This includes: the user's license key for Pro features and an instance ID for license management. This data is kept on the user's device to ensure a consistent experience without needing a remote server.`,
    scripting: `Content scripts are essential to inject the extension's user interface onto the web.whatsapp.com page. They also communicate with the WhatsApp Web application's context to securely perform actions on behalf of the user, which is necessary to fulfill the extension's core purpose.`,
    hostWhatsapp: `Permission for "https://web.whatsapp.com/*" is required for the extension to function. It allows the content scripts to run on WhatsApp Web, enabling the injection of its UI and interaction with the page to send messages to unsaved numbers.`,
    hostLemonSqueezy: `Permission for "https://api.lemonsqueezy.com/*" is used for secure license management. When a user activates a Pro license, the extension communicates with this API to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not involve any personal chat data.`,
  }

  const keywords = [
    'whatsapp direct chat',
    'wa direct message',
    'chat without saving number',
    'whatsapp unsaved number',
    'send whatsapp without contact',
    'whatsapp web extension',
    'whatsapp pro',
    'send media whatsapp',
    'whatsapp marketing',
    'whatsapp crm',
    'whatsapp business',
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
                  <PromoIcon size={128} icon={'tabler:message-circle-plus'} />
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
