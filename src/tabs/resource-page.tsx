// src/tabs/resource-page.tsx
// This page provides promotional materials for the Chrome Web Store listing.
import PromoIcon from '@/components/Promo/PromoIcon'
import ScreenshotWrapper from '@/components/Promo/ScreenshotWrapper'
import { PRIMARY_ICON } from '@/constants'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  Avatar,
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
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import React, { useRef } from 'react'

// A gradient background that matches the landing page's theme.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-teal-8), var(--mantine-color-lime-8))'

// --- START: New Mockups for Label & Contact Management Feature ---

// Mockup of the main dashboard showing the list of labels.
const MockupLabelDashboard = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Contact Label Dashboard</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Manage all your contact labels in one place. Edit, filter, and organize
        with ease.{' '}
      </Text>
      <Table striped highlightOnHover withTableBorder mt="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Label</Table.Th>
            <Table.Th>Group</Table.Th>
            <Table.Th>Contacts</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Badge color="blue">New Leads</Badge>
            </Table.Td>
            <Table.Td>Sales</Table.Td>
            <Table.Td>
              <Avatar.Group spacing="sm">
                <Avatar radius="xl" size="sm" />
                <Avatar radius="xl" size="sm" />
                <Avatar radius="xl" size="sm" />
              </Avatar.Group>
            </Table.Td>
            <Table.Td>
              <Badge color="green">Visible</Badge>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Badge color="red">Urgent Follow-up</Badge>
            </Table.Td>
            <Table.Td>Sales</Table.Td>
            <Table.Td>
              <Avatar.Group spacing="sm">
                <Avatar radius="xl" size="sm" />
              </Avatar.Group>
            </Table.Td>
            <Table.Td>
              <Badge color="green">Visible</Badge>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Badge color="teal">VIP Clients</Badge>
            </Table.Td>
            <Table.Td>Clients</Table.Td>
            <Table.Td>
              <Avatar.Group spacing="sm">
                <Avatar radius="xl" size="sm" />
                <Avatar radius="xl" size="sm" />
              </Avatar.Group>
            </Table.Td>
            <Table.Td>
              <Badge color="gray">Hidden</Badge>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  </Card>
)

// Mockup showing the Pro feature for managing contacts within a label.
const MockupManageContactsPro = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Manage Contacts for "New Leads"</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Easily add or remove contacts from your labels. Import from files to
        save even more time.{' '}
      </Text>
      <Fieldset legend="Select Contacts">
        <Stack>
          <Switch checked label="John Doe" disabled />
          <Switch label="Jane Smith" disabled />
          <Switch checked label="Peter Jones" disabled />
          <Switch checked label="Sarah Miller" disabled />
        </Stack>
      </Fieldset>
      <Button variant="light" color="blue" mt="md" disabled>
        Import from File...
      </Button>
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
        Your labels and contact lists are stored locally in your browser. They
        are never seen, stored, or uploaded by us.{' '}
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
          <b>Local Storage:</b> All data is saved on your computer.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>No Data Collection:</b> Your contacts and messages are never sent
          to our servers.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>You Are in Control:</b> You have full ownership and control over
          your data.{' '}
        </List.Item>
      </List>
    </Stack>
  </Card>
)

// Mockup showcasing the Backup & Restore feature.
const MockupBackupAndRestore = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Backup & Restore Your Data</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Never lose your hard work. Securely back up all your labels and contacts
        to a file, and restore them anytime.{' '}
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
            icon="tabler:database-export"
            fontSize={60}
            color="var(--mantine-color-teal-6)"
          />
          <Text fw={500} c="teal.8">
            {' '}
            Secure Your Contact Organization{' '}
          </Text>
          <Group>
            <Button variant="outline" color="teal" size="xs">
              {' '}
              Backup Now{' '}
            </Button>
            <Button variant="outline" color="gray" size="xs">
              {' '}
              Restore from File{' '}
            </Button>
          </Group>
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
        <List.Item>One-click backup to a JSON file</List.Item>
        <List.Item>Easily restore on a new device</List.Item>
        <List.Item>Complete peace of mind </List.Item>
      </List>
    </Stack>
  </Card>
)

// Mockup emphasizing time-saving with advanced filtering.
const MockupAdvancedFiltering = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack align="center">
      <ThemeIcon
        size={60}
        radius="xl"
        variant="gradient"
        gradient={{ from: 'teal', to: 'lime' }}
      >
        <Icon icon="tabler:filter-search" fontSize={32} />
      </ThemeIcon>
      <Title order={4} mt="md">
        {' '}
        Find Contacts in Seconds{' '}
      </Title>
      <Text c="dimmed" size="sm" ta="center">
        {' '}
        Stop scrolling endlessly. Use powerful filters to instantly find the
        exact contacts or groups you need.{' '}
      </Text>
      <Grid mt="lg" gutter="md">
        <Grid.Col span={6}>
          <Card withBorder shadow="xs" p="md">
            <Stack align="center" gap="xs">
              <Icon
                icon="tabler:search-off"
                fontSize={36}
                color="var(--mantine-color-red-6)"
              />
              <Text fw={500} size="sm" ta="center">
                {' '}
                Without Filters{' '}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                {' '}
                Endless scrolling, wasted time, missed opportunities.{' '}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card withBorder shadow="xs" p="md">
            <Stack align="center" gap="xs">
              <Icon
                icon="tabler:search"
                fontSize={36}
                color="var(--mantine-color-teal-6)"
              />
              <Text fw={500} size="sm" ta="center">
                {' '}
                With Filters{' '}
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                {' '}
                Instant results, improved workflow, efficient communication.{' '}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  </Card>
)
// --- END: New Mockups ---

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
              <Icon icon={PRIMARY_ICON} fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              A Simple CRM Inside Your WhatsApp{' '}
            </Title>
            <Title order={2} c="white" fw={500} mt="md">
              {' '}
              Organize contacts with labels, filter chats instantly, and manage
              your workflow like a pro.{' '}
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
                  <Icon icon="tabler:tags" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Smart Labels{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Create color-coded labels to categorize your contacts.{' '}
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
                  <Icon icon="tabler:filter" fontSize={30} />
                </ThemeIcon>
                <Title fw={700} order={2}>
                  {' '}
                  Filter Chats{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Instantly view chats based on the labels you've applied.{' '}
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
                  <Icon icon="tabler:database-export" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Export & Backup{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Export contact lists to CSV/Excel and back up your data.{' '}
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
      filename: 'feature_label_dashboard.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:layout-dashboard"
          title="Your Contacts, Organized"
          description="Manage all your labels from a single, powerful dashboard. See contact counts, group by category, and access actions in one click."
          featureComponent={<MockupLabelDashboard />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Manage Contact Lists (1280x800)',
      filename: 'feature_contact_management_pro.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:users-plus"
          title="Build Custom Contact Lists"
          description="Easily assign contacts to your labels. Search your address book and build targeted lists for any purpose."
          featureComponent={<MockupManageContactsPro />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Backup & Restore (1280x800)',
      filename: 'feature_backup_restore.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:database-export"
          title="Export and Backup Your Data"
          description="Never lose your setup. Securely back up your labels and export your organized contact lists to CSV or Excel."
          featureComponent={<MockupBackupAndRestore />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Find Contacts Instantly (1280x800)',
      filename: 'feature_filtering.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:filter-search"
          title="Save Time with Advanced Filters"
          description="Focus on what matters. Filter your chats by labels to instantly find the conversations you need, saving you hours of searching."
          featureComponent={<MockupAdvancedFiltering />}
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
          description="This extension operates 100% locally on your computer. Your labels and contact lists are never uploaded to any server."
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
      'Label Manager for WhatsApp',
      'Simple CRM for WhatsApp Chats',
      'WhatsApp Contact Organizer',
    ],
    shortDescriptions: [
      'Organize your chats with custom labels. Filter conversations, manage contacts, and create a simple CRM inside WhatsApp Web.',
      'The essential tool for professionals. Create labels, build contact lists, and filter your chats to manage your workflow efficiently.',
      'Bring order to your WhatsApp. Use labels to categorize your contacts, making it easy to find anyone and manage your communication.',
    ],
    longDescription: `🚀 Turn Your WhatsApp into a Powerful Contact Organizer!

Tired of endless scrolling to find important chats? Label Manager for WhatsApp is the ultimate tool to add a simple, effective CRM layer directly onto WhatsApp Web, helping you save time and streamline your communication.

✨ Key Features
- 🏷️ **Smart Labeling**: Create unlimited color-coded labels and groups to categorize your contacts by project, priority, or status.
- 🔍 **Instant Filtering**: Apply labels to your chats and filter your conversation list with a single click. Focus only on what matters, when it matters.
- 👥 **Contact Management**: Easily add contacts to your labels, see at a glance who belongs to which group, and manage your lists efficiently.
- 🛡️ **100% Private & Secure**: All your labels and contact data are stored securely on your own computer. We never see, save, or have access to your information.

⭐ Pro Features
- **Unlimited Everything**: Create unlimited labels and add unlimited contacts to each label.
- **Backup & Restore**: Never lose your setup! Securely back up all your labels and contacts to a file and restore it anytime.
- **Export to CSV/Excel**: Export your organized contact lists for use in other CRM systems, marketing tools, or spreadsheets.

🤔 Who Is This For?
- 💼 **Sales Professionals**: Manage leads, track follow-ups, and segment clients without leaving WhatsApp.
- 📈 **Business Owners**: Organize customers, suppliers, and internal teams for better communication.
- 🎨 **Freelancers**: Keep track of clients and projects with dedicated labels.
- 👥 **Community Managers**: Categorize members by interest, status, or group to manage your community effectively.

🚀 Get started in seconds and take control of your WhatsApp workflow!

WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  const justificationTexts = {
    singlePurpose: `The core purpose of this extension is to provide a simple CRM-like system for WhatsApp Web by allowing users to create, manage, and apply labels to their contacts. All features—such as label creation, contact assignment, chat filtering, and data export—are directly related to this single purpose of organizing contacts and chats.`,
    storage: `The 'storage' permission is crucial for the extension to function. It is used to store all user-generated data locally and securely on their device via IndexedDB. This includes:
- The user's created labels (name, color, group, etc.).
- The association between labels and the user's contacts.
- The user's license key for unlocking Pro features.
This data is stored only on the user's computer and is never transmitted to our servers, ensuring user privacy.`,
    scripting: `The 'scripting' permission is essential for injecting the extension's user interface (UI) into the WhatsApp Web page. It allows us to add the label management dashboard and filtering controls so the user can interact with the extension in context. It is also used to read the DOM to apply filters to the chat list, fulfilling the extension's core functionality.`,
    hostWhatsapp: `The permission for "https://web.whatsapp.com/*" is the primary requirement for the extension to operate. It allows our content scripts and UI to be injected into the WhatsApp Web interface, enabling the user to manage labels and filter their chats directly on the site. The extension cannot function without access to this domain.`,
    hostLemonSqueezy: `The permission for "https://api.lemonsqueezy.com/*" is used exclusively for secure license management. When a user purchases and activates a Pro license, the extension communicates with the Lemon Squeezy API to validate the license key. This is a standard and secure practice for handling software licensing and does not transmit any of the user's personal WhatsApp data.`,
  }

  const keywords = [
    'whatsapp crm',
    'whatsapp label manager',
    'organize whatsapp contacts',
    'whatsapp contact labels',
    'whatsapp group contacts',
    'export whatsapp contacts',
    'whatsapp filter chats',
    'whatsapp contact manager',
    'whatsapp business labels',
    'whatsapp productivity',
    'whatsapp sales tool',
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
                    <Title order={4}>Scripting Permission Justification</Title>
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
