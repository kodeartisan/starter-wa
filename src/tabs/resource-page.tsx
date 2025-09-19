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
  Popover,
  SegmentedControl,
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
import { DataTable } from 'mantine-datatable'
import 'mantine-datatable/styles.layer.css'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
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
              <Icon icon="tabler:users-group" fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              Group Admin Finder for WA{' '}
            </Title>
            <Title order={2} c="white" fw={500} mt="md">
              {' '}
              Instantly find and export admin lists from your WhatsApp groups to
              Excel, CSV, PDF, and more.{' '}
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
                  <Icon icon="tabler:zoom-scan" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Find Admin Lists{' '}
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
                  <Icon icon="tabler:users" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Identify Key Contacts{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Quickly identify admins & super admins.{' '}
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
                  <Icon icon="tabler:file-type-xls" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Multiple Formats{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Supports Excel, CSV, PDF, JSON & vCard.{' '}
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
      <Title order={4}>Find Group Admins in Bulk</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Save time by selecting multiple groups to find all administrators at
        once.{' '}
      </Text>
      <Paper p="lg" withBorder radius="md" mt="md">
        <Stack>
          {/* This is a simplified mockup of the MultiSelect component */}
          <Text size="sm" fw={500}>
            {' '}
            Select Group(s){' '}
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
                {' '}
                Project Alpha (5 admins){' '}
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
                {' '}
                Marketing Team (2 admins){' '}
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
                {' '}
                Community Event (12 admins){' '}
              </Badge>
            </Group>
          </Paper>
          <Text size="sm" fw={500} mt="sm">
            {' '}
            73 admins found across 3 groups.{' '}
          </Text>
        </Stack>
      </Paper>
    </Stack>
  </Card>
)

const FeatureMockupDataTable = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Preview Your Admin List</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Review the admin data in a clean table before exporting.{' '}
      </Text>
      <DataTable
        minHeight={200}
        records={[
          {
            name: 'Alice Johnson',
            number: '+12025550181',
            role: 'Super Admin',
            status: 'Saved',
            group: 'Marketing Team',
          },
          {
            name: 'Bob Williams',
            number: '+442079460992',
            role: 'Admin',
            status: 'Saved',
            group: 'Project Alpha',
          },
          {
            name: 'Charlie Brown',
            number: '+13105550134',
            role: 'Admin',
            status: 'Unsaved',
            group: 'Community Event',
          },
        ]}
        columns={[
          {
            accessor: 'name',
            title: 'Name',
            render: ({ name }) => (
              <Group gap="sm">
                <Avatar size={30} radius="xl" />
                <Text fz="sm" fw={500}>
                  {' '}
                  {name}{' '}
                </Text>
              </Group>
            ),
          },
          { accessor: 'number', title: 'Phone Number' },
          {
            accessor: 'role',
            title: 'Role',
            render: ({ role }) => (
              <Badge color={role === 'Super Admin' ? 'red' : 'teal'}>
                {role}
              </Badge>
            ),
          },
          {
            accessor: 'status',
            title: 'Status',
            render: ({ status }) => (
              <Badge
                variant="light"
                color={status === 'Saved' ? 'blue' : 'gray'}
              >
                {' '}
                {status}{' '}
              </Badge>
            ),
          },
        ]}
      />
    </Stack>
  </Card>
)
const FeatureMockupExportOptions = () => (
  <Card withBorder radius="md" p="xl" w={450}>
    <Stack align="center" p="md">
      <Title order={4} ta="center">
        {' '}
        Customize & Export Admin Data{' '}
      </Title>
      <Text c="dimmed" size="sm" ta="center">
        {' '}
        Choose your desired format and select which columns to include.{' '}
      </Text>
      <Group mt="lg">
        <Button size="sm" leftSection={<Icon icon="tabler:download" />}>
          {' '}
          Export Data{' '}
        </Button>
        <Popover width={200} position="bottom-end" withArrow shadow="md" opened>
          <Popover.Target>
            <Button
              variant="outline"
              size="sm"
              leftSection={<Icon icon="tabler:columns" />}
            >
              {' '}
              Customize Columns{' '}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Checkbox.Group
              label="Select columns to export"
              defaultValue={['name', 'number', 'role']}
            >
              <Stack mt="xs" gap="xs">
                <Checkbox value="name" label="Name" />
                <Checkbox value="number" label="Phone Number" />
                <Checkbox value="role" label="Is Admin" />
                <Checkbox value="status" label="Is My Contact" />
                <Checkbox value="group" label="Group Name" />
              </Stack>
            </Checkbox.Group>
          </Popover.Dropdown>
        </Popover>
      </Group>
      <Paper withBorder radius="md" p="lg" mt="lg">
        <Stack>
          <Text fw={500}>Export Formats</Text>
          <List spacing="sm" size="sm" icon={<span />}>
            <List.Item icon={<Icon icon="tabler:file-type-csv" />}>
              {' '}
              Export as CSV{' '}
            </List.Item>
            <List.Item icon={<Icon icon="tabler:file-type-xls" />}>
              {' '}
              Export as Excel{' '}
            </List.Item>
            <List.Item icon={<Icon icon="tabler:file-type-pdf" />}>
              {' '}
              Export as PDF{' '}
            </List.Item>
            <List.Item icon={<Icon icon="tabler:id" />}>
              {' '}
              Export as vCard (.vcf){' '}
            </List.Item>
          </List>
        </Stack>
      </Paper>
    </Stack>
  </Card>
)

const FeatureMockupOutputFile = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Group justify="space-between">
        <Title order={4}>Clean & Organized Output</Title>
        <Badge
          color="teal"
          size="lg"
          leftSection={<Icon icon="tabler:file-type-xls" />}
        >
          {' '}
          Excel File{' '}
        </Badge>
      </Group>
      <Text c="dimmed" size="sm">
        {' '}
        Get a perfectly formatted file of group admins, ready for outreach,
        coordination, or data analysis.{' '}
      </Text>
      <Table striped highlightOnHover withTableBorder mt="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>savedName</Table.Th>
            <Table.Th>phoneNumber</Table.Th>
            <Table.Th>isSuperAdmin</Table.Th>
            <Table.Th>isMyContact</Table.Th>
            <Table.Th>groupName</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Alice Johnson</Table.Td>
            <Table.Td>12025550181</Table.Td>
            <Table.Td>TRUE</Table.Td>
            <Table.Td>TRUE</Table.Td>
            <Table.Td>Marketing Team</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Bob Williams</Table.Td>
            <Table.Td>442079460992</Table.Td>
            <Table.Td>FALSE</Table.Td>
            <Table.Td>TRUE</Table.Td>
            <Table.Td>Project Alpha</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Charlie Brown</Table.Td>
            <Table.Td>13105550134</Table.Td>
            <Table.Td>FALSE</Table.Td>
            <Table.Td>FALSE</Table.Td>
            <Table.Td>Community Event</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
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
      filename: 'marquee_promo_tile_admin_finder.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Select Groups (1280x800)',
      filename: 'feature_admin_select_groups.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:list-details"
          title="Select Your Groups"
          description="Choose one or more groups to begin finding all associated admins and super admins."
          featureComponent={<FeatureMockupSelectGroups />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Preview Admin Data (1280x800)',
      filename: 'feature_admin_data_table.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:table"
          title="Preview Your Admins"
          description="Instantly see a clean, organized table of all admins found, complete with their roles and contact status."
          featureComponent={<FeatureMockupDataTable />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Export Options (1280x800)',
      filename: 'feature_admin_export_options.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:settings-cog"
          title="Customize Your Export"
          description="Choose from multiple file formats and select exactly which data columns you want to include in your final report."
          featureComponent={<FeatureMockupExportOptions />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Final Exported File (1280x800)',
      filename: 'feature_admin_output_file.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:file-check"
          title="Clean & Ready-to-Use"
          description="Your exported admin list is perfectly formatted and ready for your outreach, coordination, and networking efforts."
          featureComponent={<FeatureMockupOutputFile />}
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
      component: <PromoIcon size={128} icon={'tabler:users-group'} />,
      ref: iconRef,
      name: 'promotional_icon.png',
    },
  ]
  const storeListingText = {
    titles: [
      'Group Admin Finder for WA',
      'Find & Export WA Group Admins',
      'Export WhatsApp Admin Lists',
    ],
    shortDescriptions: [
      'Instantly find all admins from any WhatsApp group. Export admin lists to Excel, CSV, PDF & vCard in one click.',
      'The easiest way to find and download contact lists of admins and super admins from your WhatsApp groups.',
      'Save time coordinating communities. Quickly get a list of all administrators from one or many groups.',
    ],
    longDescription: `⚙️ The Ultimate Tool for Community Coordinators & Networkers

Tired of manually scrolling through long participant lists to find out who the admins are? The Group Admin Finder for WA streamlines your workflow, allowing you to instantly identify, filter, and export a clean list of all administrators from your WhatsApp groups.

✨ Key Features
- **Instant Admin Discovery**: Select any group you're in, and the tool immediately shows you a list of all its admins and super admins.
- **Bulk Group Scanning**: Select multiple groups at once to get a single, unified list of all administrators across your communities. (Pro)
- **Multiple Export Formats**: Download your admin lists as CSV, Excel (XLSX), PDF, JSON, or vCard (.vcf) files to build contact lists for outreach or coordination. (Pro)
- **Customizable Columns**: Choose exactly which data you want to export. Keep it simple with just names and numbers, or include admin status and group source.
- **Direct Messaging**: Need to contact an admin? Send them a message directly from the found list with a single click.
- **Privacy-Focused**: Your data is your own. The extension operates locally in your browser. We never collect, store, or transmit your personal data, contacts, or chat information.

🤔 Who Is This For?
- **Community Managers**: Quickly create an admin-only chat or send updates to all your community leaders at once.
- **Business Networkers**: Identify and export the contact details of key decision-makers and influencers in professional groups.
- **Event Organizers**: Easily coordinate with co-organizers by getting a list of all admins from your event groups.
- **Anyone needing to connect**: Stop wasting time searching. Find the right people to talk to, fast.

🚀 Boost your productivity and make community management simpler than ever. Stop the scroll and start connecting!

WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension is an independent project and has no relationship to WhatsApp or WhatsApp Inc.`,
  }
  const justificationTexts = {
    singlePurpose: `The extension's single purpose is to allow users to find and export administrator data from their WhatsApp groups. All features—including selecting groups, identifying admins, and exporting their contact information to various file formats—are directly tied to this core function of admin data extraction within the WhatsApp Web interface.`,
    storage: `The 'storage' permission is used to locally store user settings and license information. This includes: the user's license key for Pro features and an instance ID for license management. This data is kept on the user's device to ensure a consistent experience without needing a remote server.`,
    scripting: `Content scripts are essential to inject the extension's user interface (the admin finder modal) onto the web.whatsapp.com page. They also communicate with the WhatsApp Web application's context to securely fetch the user's group and participant lists, which is necessary to fulfill the extension's core purpose of identifying admins.`,
    hostWhatsapp: `Permission for "https://web.whatsapp.com/*" is required for the extension to function. It allows the content scripts to run on WhatsApp Web, enabling the injection of its UI and interaction with the page to retrieve group and admin data for the user to export.`,
    hostLemonSqueezy: `Permission for "https://api.lemonsqueezy.com/*" is used for secure license management. When a user activates a Pro license, the extension communicates with this API to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not involve any personal chat data.`,
  }

  const keywords = [
    'whatsapp admin finder',
    'find whatsapp admin',
    'export group admins',
    'whatsapp admin list',
    'community management tool',
    'whatsapp network',
    'contact group admins',
    'whatsapp B2B',
    'whatsapp group tool',
    'admin extractor',
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
