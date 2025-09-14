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
  Paper,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import '@mantine/core/styles.css'
import { DataTable } from 'mantine-datatable'
import 'mantine-datatable/styles.layer.css'
import { PRIMARY_ICON } from '@/constants'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import { QRCodeCanvas } from 'qrcode.react'
import React, { useRef } from 'react'

// English: Using a darker gradient that matches the landing page's teal-to-lime theme with darker shades for a more prominent look.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-teal-8), var(--mantine-color-lime-8))'

// --- Marquee Promo Tiles (1280x800px) --- //

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
              size={90}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal', to: 'lime' }}
            >
              <Icon icon="tabler:ticket" fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              Bulk Group Invite Link Generator{' '}
            </Title>
            <Title order={2} c="white" fw={500} mt="md">
              {' '}
              Generate invite links, create QR codes, and export your list right
              from WhatsApp Web.{' '}
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
                  <Icon icon="tabler:list-details" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Bulk Generate Links{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Select multiple groups at once.{' '}
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
                  <Icon icon="tabler:qrcode" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Create QR Codes{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Easily share your group invites.{' '}
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
                  <Icon icon="tabler:file-export" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Export to Excel/CSV{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Save your generated link lists.{' '}
              </Title>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

// --- Feature Mockups for Screenshots --- //
const FeatureMockupSelectGroups = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Generate Invite Links in Bulk</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Save time by selecting multiple groups at once.{' '}
      </Text>
      <Paper p="lg" withBorder radius="md" mt="md">
        <Stack>
          {/* This is a simplified mockup of the MultiSelect component */}
          <Text size="sm" fw={500}>
            Select Group(s)
          </Text>
          <Paper withBorder radius="sm" p="xs">
            <Group gap="xs">
              <Badge
                variant="light"
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                  >
                    <Icon icon="tabler:x" />
                  </ActionIcon>
                }
              >
                Project Alpha (15 members)
              </Badge>
              <Badge
                variant="light"
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                  >
                    <Icon icon="tabler:x" />
                  </ActionIcon>
                }
              >
                Marketing Team (8 members)
              </Badge>
              <Badge
                variant="light"
                rightSection={
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                  >
                    <Icon icon="tabler:x" />
                  </ActionIcon>
                }
              >
                Community Event (120 members)
              </Badge>
            </Group>
          </Paper>

          <Textarea
            label="Custom Message Template"
            description="Use {link} as a placeholder for the invite link."
            value={'Please join our group: {link}'}
            readOnly
          />

          <Button mt="sm" leftSection={<Icon icon="tabler:refresh-dot" />}>
            Generate 3 Link(s)
          </Button>
        </Stack>
      </Paper>
    </Stack>
  </Card>
)

const FeatureMockupGeneratedLinks = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Your Invite Links are Ready!</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Easily copy links or generate a QR code for each group.{' '}
      </Text>
      <Stack mt="md" gap="lg">
        <TextInput
          label="Project Alpha"
          readOnly
          value="https://chat.whatsapp.com/AbC123DeF456"
          rightSection={
            <Group gap="xs" wrap="nowrap">
              <Tooltip label="Copy Options">
                <ActionIcon variant="subtle">
                  <Icon icon="tabler:copy" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Generate QR Code">
                <ActionIcon variant="subtle">
                  <Icon icon="tabler:qrcode" />
                </ActionIcon>
              </Tooltip>
            </Group>
          }
        />
        <TextInput
          label="Marketing Team"
          readOnly
          value="https://chat.whatsapp.com/GhI789JkL101"
          rightSection={
            <Group gap="xs" wrap="nowrap">
              <Tooltip label="Copy Options">
                <ActionIcon variant="subtle">
                  <Icon icon="tabler:copy" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Generate QR Code">
                <ActionIcon variant="subtle">
                  <Icon icon="tabler:qrcode" />
                </ActionIcon>
              </Tooltip>
            </Group>
          }
        />
      </Stack>
    </Stack>
  </Card>
)

const FeatureMockupQRCode = () => (
  <Card withBorder radius="md" p="xl" w={400}>
    <Stack align="center" p="md">
      <Title order={4} ta="center">
        {' '}
        QR Code for "Marketing Team"{' '}
      </Title>
      <Paper p="md" mt="md" withBorder radius="md">
        <QRCodeCanvas
          value="https://chat.whatsapp.com/GhI789JkL101"
          size={200}
          level="H"
        />
      </Paper>
      <Button mt="lg" leftSection={<Icon icon="tabler:download" />}>
        {' '}
        Download Image{' '}
      </Button>
    </Stack>
  </Card>
)

const FeatureMockupHistoryAndExport = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Group justify="space-between">
        <Title order={4}>Link History & Export</Title>
        <Group>
          <Button
            variant="light"
            size="xs"
            leftSection={<Icon icon="tabler:file-type-csv" />}
          >
            Export as CSV
          </Button>
          <Button
            variant="light"
            size="xs"
            leftSection={<Icon icon="tabler:file-type-xls" />}
          >
            Export as Excel
          </Button>
        </Group>
      </Group>
      <Text c="dimmed" size="sm">
        {' '}
        Review your generated link history, export it, or revoke links as
        needed.{' '}
      </Text>
      <DataTable
        minHeight={150}
        records={[
          {
            groupName: 'Project Alpha',
            link: 'https://chat.whatsapp.com/AbC123...',
            createdAt: '2025-09-14 10:30',
          },
          {
            groupName: 'Marketing Team',
            link: 'https://chat.whatsapp.com/GhI789...',
            createdAt: '2025-09-14 10:30',
          },
          {
            groupName: 'Community Event',
            link: 'https://chat.whatsapp.com/Klm112...',
            createdAt: '2025-09-13 15:00',
          },
        ]}
        columns={[
          { accessor: 'groupName', title: 'Group Name' },
          { accessor: 'link', title: 'Invite Link' },
          { accessor: 'createdAt', title: 'Generated At' },
          {
            accessor: 'actions',
            title: 'Actions',
            textAlign: 'right',
            render: () => (
              <Group gap="xs" justify="right" wrap="nowrap">
                <ActionIcon color="blue" variant="subtle">
                  <Icon icon="tabler:copy" />
                </ActionIcon>
                <ActionIcon color="teal" variant="subtle">
                  <Icon icon="tabler:qrcode" />
                </ActionIcon>
                <ActionIcon color="red" variant="subtle">
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
      filename: 'marquee_promo_tile_features.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Select Multiple Groups (1280x800)',
      filename: 'feature_select_groups.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:list-details"
          title="Bulk Link Generation"
          description="Select as many groups as you need and generate all their invite links in a single click."
          featureComponent={<FeatureMockupSelectGroups />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: View Generated Links (1280x800)',
      filename: 'feature_generated_links.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:link"
          title="Instant Link Access"
          description="Your generated links appear instantly. Copy them with a custom message or move on to creating a QR code."
          featureComponent={<FeatureMockupGeneratedLinks />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: QR Code Generation (1280x800)',
      filename: 'feature_qr_code.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:qrcode"
          title="One-Click QR Codes"
          description="Generate and download a high-resolution QR code for any group invite, perfect for flyers and digital sharing."
          featureComponent={<FeatureMockupQRCode />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: History and Export (1280x800)',
      filename: 'feature_history_export.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:file-export"
          title="History & Export"
          description="Keep track of all generated links in your history. Export your list to CSV or Excel for record-keeping."
          featureComponent={<FeatureMockupHistoryAndExport />}
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
  const iconRef = useRef<HTMLDivElement>(null)
  const icons = [
    {
      component: <PromoIcon size={128} icon={'tabler:ticket'} />,
      ref: iconRef,
      name: 'promotional_icon.png',
    },
  ]

  const storeListingText = {
    titles: [
      'Group Link Generator for WhatsApp',
      'Bulk WhatsApp Group Link Maker',
      'WA Group Invite Link Generator',
    ],
    shortDescriptions: [
      'Generate WhatsApp group invite links in bulk, create QR codes, and export your list right from WhatsApp Web.',
      'The easiest way to get invite links for multiple WhatsApp groups at once. Includes QR code and export features.',
      'Save time managing your WhatsApp groups. Quickly generate invite links for one or many groups simultaneously.',
    ],
    longDescription: `⚙️ The Ultimate Tool for WhatsApp Group Admins

Tired of manually generating invite links for your WhatsApp groups one by one? The Group Link Generator for WhatsApp streamlines your workflow, allowing you to generate, manage, and share group invites with ease and efficiency, right from WhatsApp Web.

✨ Key Features
- **Bulk Link Generation**: Select multiple groups at once and generate all their invite links in a single click. (Pro)
- **QR Code Creation**: Instantly create and download a high-resolution QR code for any group invite, perfect for sharing online or on printed materials. (Pro)
- **Export to CSV/Excel**: Keep a record of your generated links by exporting them to a CSV or Excel file for easy management. (Pro)
- **Link History**: View a history of all the links you've created.
- **Revoke Links**: Easily revoke an old invite link directly from the history, ensuring your groups remain secure.
- **Custom Copy Message**: Create a custom message template to go along with your invite link when you copy it.

🔐 Safe & Secure
Your privacy is important. This extension operates locally in your browser and does not collect, store, or transmit any of your personal data or chat information.

🤔 Who Is This For?
- **Community Managers**: Effortlessly create and share links for multiple community groups.
- **Event Organizers**: Quickly generate invite links for event-specific WhatsApp groups.
- **Business Owners**: Onboard new team members or clients to different groups efficiently.
- **Anyone managing multiple WhatsApp groups**: Stop wasting time with repetitive tasks and manage your group invites like a pro.

🚀 Boost your productivity and take control of your WhatsApp group management today!

WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension is an independent project and has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  const justificationTexts = {
    singlePurpose: `The extension's single purpose is to allow users to generate and manage WhatsApp group invite links. All features—including selecting groups, generating links, creating QR codes, exporting lists, and viewing history—are directly tied to this core function of group invite link management within the WhatsApp Web interface.`,
    storage: `The 'storage' permission is used to locally store user settings and license information. This includes: the user's license key for Pro features, an instance ID for license management, and saved preferences like custom message templates. This data is kept on the user's device to ensure a consistent experience without needing a remote server.`,
    scripting: `Content scripts are essential to inject the extension's user interface (the link generator modal) onto the web.whatsapp.com page. They also communicate with the WhatsApp Web application's context to securely fetch the user's group list and to call the functions necessary for generating and revoking invite links, fulfilling the extension's core purpose.`,
    hostWhatsapp: `Permission for "https://web.whatsapp.com/*" is required for the extension to function. It allows the content scripts to run on WhatsApp Web, enabling the injection of its UI and interaction with the page to retrieve group data and generate invite links for the user.`,
    hostLemonSqueezy: `Permission for "https://api.lemonsqueezy.com/*" is used for secure license management. When a user activates a Pro license, the extension communicates with this API to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not involve any personal chat data.`,
  }

  const keywords = [
    'whatsapp group',
    'invite link',
    'whatsapp tool',
    'bulk generate',
    'qr code',
    'export whatsapp',
    'group admin',
    'whatsapp automation',
    'link generator',
    'whatsapp marketing',
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
