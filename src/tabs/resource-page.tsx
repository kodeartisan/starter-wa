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
  List,
  MantineProvider,
  MultiSelect,
  Paper,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import '@mantine/core/styles.css'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import { DataTable } from 'mantine-datatable'
import React, { useRef } from 'react'

// English: Using a darker gradient that matches the landing page's teal-to-lime theme with darker shades for a more prominent look.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-teal-8), var(--mantine-color-lime-8))'

// English: Overriding the primary icon to better represent the Group Link Generator feature.
const GROUP_LINK_ICON = 'tabler:ticket'

// --- START: New Mockups for Group Link Generator Feature ---

// Mockup of the simple, free-to-use group link generator interface.
const MockupGroupLinkSimple = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Generate a Link in Seconds</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Stop digging through settings. Just select a group and get the invite
        link instantly.{' '}
      </Text>
      <MultiSelect
        label="1. Select Your Group"
        placeholder="Choose a group you admin"
        data={['Project Alpha Team']}
        value={['Project Alpha Team']}
        disabled
      />
      <Button
        mt="md"
        size="md"
        leftSection={<Icon icon="tabler:refresh-dot" />}
      >
        {' '}
        Generate Link{' '}
      </Button>
      <TextInput
        label="Your Generated Link"
        value="https://chat.whatsapp.com/Abc123Def456"
        disabled
      />
    </Stack>
  </Card>
)

// Mockup showing the Pro feature of generating links for multiple groups.
const MockupGroupLinkMultiSelect = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Manage All Your Groups at Once (Pro)</Title>
      <MultiSelect
        label="Select Multiple Groups"
        placeholder="Choose groups"
        data={['Marketing Team', 'Event Volunteers', 'Q4 Sales Drive']}
        value={['Marketing Team', 'Event Volunteers', 'Q4 Sales Drive']}
        disabled
      />
      <Textarea
        label="Custom Message Template"
        value="Please join our group: {link}"
        disabled
        minRows={2}
      />
      <Group justify="flex-end" mt="md">
        <Button size="md" leftSection={<Icon icon="tabler:refresh-dot" />}>
          {' '}
          Generate 3 Links{' '}
        </Button>
      </Group>
    </Stack>
  </Card>
)

// Mockup showing the Pro sharing features like QR codes and exporting.
const MockupGroupLinkSharing = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Share Links Your Way (Pro)</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Easily share your links with QR codes or export them for your records.{' '}
      </Text>
      <TextInput
        label="Marketing Team Link"
        value="https://chat.whatsapp.com/Ghi789Jkl012"
        disabled
        rightSection={
          <Group gap="xs" wrap="nowrap">
            <ActionIcon variant="subtle" disabled>
              <Icon icon="tabler:copy" />
            </ActionIcon>
            <ActionIcon variant="subtle" disabled>
              <Icon icon="tabler:qrcode" />
            </ActionIcon>
          </Group>
        }
      />
      <Group mt="lg">
        <Button
          variant="light"
          size="sm"
          leftSection={<Icon icon="tabler:file-type-csv" />}
        >
          {' '}
          Export as CSV{' '}
        </Button>
        <Button
          variant="light"
          size="sm"
          leftSection={<Icon icon="tabler:file-type-xls" />}
        >
          {' '}
          Export as Excel{' '}
        </Button>
      </Group>
    </Stack>
  </Card>
)

// Mockup for the link history feature.
const MockupGroupLinkHistory = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Keep Track with Link History</Title>
      <Text c="dimmed" size="sm">
        {' '}
        View all previously generated links and revoke them when they are no
        longer needed.{' '}
      </Text>
      <DataTable
        minHeight={150}
        records={[
          {
            groupName: 'Event Volunteers',
            link: 'https://chat.whatsapp.com/Mno345Pqr678',
            date: '2025-09-14 10:30',
          },
        ]}
        columns={[
          { accessor: 'groupName', title: 'Group' },
          { accessor: 'link', title: 'Link' },
          {
            accessor: 'actions',
            title: 'Actions',
            render: () => (
              <Group gap="xs" justify="right">
                <ActionIcon variant="subtle" color="red">
                  <Icon icon="tabler:trash" />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
      />
    </Stack>
  </Card>
)

// --- END: New Mockups ---

// --- Marquee Promo Tiles (1280x800px) ---
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
              <Icon icon={GROUP_LINK_ICON} fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              The Fastest Way to Get Group Invites{' '}
            </Title>
            <Title order={1} c="white" fw={500} mt="md">
              {' '}
              Generate invite links for multiple WhatsApp groups at once.{' '}
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
                  <Icon icon="tabler:users-group" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Bulk Generation{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Get links for all groups in one click.{' '}
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
                  <Icon icon="tabler:qrcode" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  QR Codes & Export{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Share links easily anywhere.{' '}
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
                  <Icon icon="tabler:history" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Link History{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Track and revoke old links.{' '}
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

const ScreenshotGallery: React.FC = () => {
  const screenshotData = [
    {
      title: 'Marquee Promo Tile: Feature Showcase (1280x800)',
      filename: 'marquee_promo_tile_features.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Simple Link Generation (1280x800)',
      filename: 'feature_simple_link_generation.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:mouse"
          title="Clean & Intuitive Interface"
          description="Just select a group you admin, click a button, and your invite link is ready. It's that simple."
          featureComponent={<MockupGroupLinkSimple />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Bulk Generation (Pro) (1280x800)',
      filename: 'feature_bulk_generation.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:users-group"
          title="Generate Links in Bulk"
          description="A massive time-saver for community managers. Select all the groups you need and generate every invite link at once."
          featureComponent={<MockupGroupLinkMultiSelect />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Advanced Sharing (Pro) (1280x800)',
      filename: 'feature_advanced_sharing.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:share"
          title="Share and Export with Ease"
          description="Instantly generate QR codes for posters and flyers, or export your link list to CSV and Excel for your records and marketing campaigns."
          featureComponent={<MockupGroupLinkSharing />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Link History & Revoke (1280x800)',
      filename: 'feature_link_history.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:history"
          title="Total Control Over Your Links"
          description="All generated links are saved in a convenient history tab. If a link is no longer needed, you can revoke it with a single click to protect your group's privacy."
          featureComponent={<MockupGroupLinkHistory />}
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
      component: <PromoIcon size={128} icon={GROUP_LINK_ICON} />,
      ref: iconRef,
      name: 'promotional_icon.png',
    },
  ]
  const storeListingText = {
    titles: [
      'Group Link Generator for WhatsApp',
      'Bulk Invite Links for WhatsApp Web',
      'Manage Group Invites Instantly',
    ],
    shortDescriptions: [
      'Quickly generate, manage, and share invite links for all your WhatsApp groups. Select multiple groups and get all links at once.',
      'The ultimate time-saver for community managers. Generate invite links in bulk, create QR codes, and export your list right from WhatsApp Web.',
      'Stop digging through settings. Get invite links for one or many WhatsApp groups instantly. Includes link history and revoke options.',
    ],
    longDescription: `Tired of manually opening every single group just to get an invite link? Group Link Generator for WhatsApp is the ultimate tool for community managers, event organizers, and anyone who manages multiple groups.

✨ Key Features
- 🚀 Bulk Link Generation (Pro): Select multiple groups and generate all their invite links with a single click. A massive time-saver!
- 🔗 Single Link Generation: Quickly get an invite link for any group you administer.
- 📱 QR Code Generation (Pro): Instantly create and download a QR code for your invite link, perfect for posters, presentations, and social media.
- 📋 Export Links (Pro): Export your list of generated links and group names to CSV or Excel for easy record-keeping and sharing.
- 📜 Link History: Keep track of every link you've generated.
- 🗑️ Revoke Links: Easily revoke old invite links directly from your history to maintain group privacy and control.
- 🔒 100% Private & Secure: The extension operates locally on your computer using the official WhatsApp Web interface. Your group data is never seen or stored by us.

🤔 Who Is This For?
- 💼 Community Managers: Onboard new members to dozens of groups in seconds.
- 🗓️ Event Organizers: Share group links for workshops, parties, or meetings effortlessly.
- 📈 Marketing Professionals: Easily gather and share links for promotional campaigns.
- 🙋‍♀️ Anyone who manages more than one group and values their time.

🚀 Install now and revolutionize the way you manage your WhatsApp groups!

WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  const justificationTexts = {
    singlePurpose: `The core purpose of this extension is to allow users to generate and manage WhatsApp group invite links directly from WhatsApp Web, without needing to manually navigate into each group's settings. All features, such as group selection, link generation, QR code creation, and link history, are directly related to this single purpose of streamlining group management.`,
    storage: `The 'storage' permission is used to store essential user settings and license information locally on the user's device. This includes: - The user's license key to unlock Pro features. - An instance ID for license activation management. - A history of previously generated group links for user reference and management. This data is stored only on the user's computer and is crucial for providing a persistent and personalized experience without requiring a remote server or user accounts.`,
    scripting: `Content scripts are essential for the extension's functionality. They are used exclusively on web.whatsapp.com to: 1. Inject the user interface (the main modal for generating links) onto the page, allowing users to interact with the extension directly within the WhatsApp Web environment. 2. Communicate with the WhatsApp Web application's JavaScript context to securely fetch the user's groups and generate invite links. This process is handled locally and is necessary to fulfill the extension's core purpose.`,
    hostWhatsapp: `The permission for "https://web.whatsapp.com/*" is required to allow the extension's content scripts to run on WhatsApp Web. The extension needs to access the DOM and interact with the page to inject its UI and fetch group data on the user's behalf. The extension's functionality is entirely dependent on its ability to operate on this specific domain.`,
    hostLemonSqueezy: `The permission for "https://api.lemonsqueezy.com/*" is used to securely communicate with the Lemon Squeezy API for license validation and management. When a user activates a Pro license, the extension sends a request to this domain to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not transmit any personal chat or group data.`,
  }

  const keywords = [
    'whatsapp group link',
    'invite link generator',
    'bulk invite links',
    'whatsapp group manager',
    'community manager tools',
    'whatsapp qr code',
    'export whatsapp group links',
    'revoke invite link',
    'WA group invite',
    'whatsapp link',
    'group invite',
    'whatsapp community',
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
