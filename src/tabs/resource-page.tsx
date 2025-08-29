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
  Fieldset,
  Grid,
  Group,
  List,
  MantineProvider,
  NumberInput,
  Paper,
  Radio,
  Select,
  Stack,
  Switch,
  Table,
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

// English: Overriding the primary icon to better represent the Number Validator feature.
const VALIDATOR_ICON = 'tabler:checks'

// --- START: New Mockups for Number Validator Feature ---
// Mockup of the main validator interface.
const MockupValidatorSimple = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Bulk Number Validator</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Paste your numbers and get instant results.{' '}
      </Text>
      <Textarea
        label="1. Paste Numbers Here"
        placeholder="6281234567890
6289876543210
1234567890 (Invalid)
..."
        minRows={4}
        disabled
      />
      <Group justify="flex-end">
        <Button
          mt="md"
          size="md"
          leftSection={<Icon icon="tabler:player-play" />}
        >
          {' '}
          Start Validation{' '}
        </Button>
      </Group>
    </Stack>
  </Card>
)

// Mockup showing the Pro feature of importing from Excel and batching.
const MockupValidatorProFeatures = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Powerful Tools</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Handle large lists with ease and safety.{' '}
      </Text>
      <Tabs defaultValue="import" variant="pills" mt="xs">
        <Tabs.List grow>
          <Tabs.Tab value="import" color="teal">
            {' '}
            Import from Excel{' '}
          </Tabs.Tab>
          <Tabs.Tab value="batching">Batch Processing</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="import" pt="md">
          <Center
            p="xl"
            style={{
              border: '2px dashed var(--mantine-color-gray-3)',
              borderRadius: 'var(--mantine-radius-md)',
            }}
          >
            <Stack align="center">
              <Icon
                icon="tabler:file-type-xls"
                fontSize={48}
                color="var(--mantine-color-gray-5)"
              />
              <Text c="dimmed">contacts_list.xlsx</Text>
            </Stack>
          </Center>
        </Tabs.Panel>
        <Tabs.Panel value="batching" pt="md">
          <Stack>
            <Switch
              checked
              label="Process numbers in batches"
              description="For large lists, this pauses validation periodically."
              disabled
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
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
        Your contact lists are processed locally and are never seen, stored, or
        uploaded by us.{' '}
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
          <b>No Data Storage:</b> Your lists and results are never saved by us.{' '}
        </List.Item>
        <List.Item>
          {' '}
          <b>You Are in Control:</b> All actions happen on your own computer.{' '}
        </List.Item>
      </List>
    </Stack>
  </Card>
)
// --- END: Original Mockups ---

// ++ START: New, more accurate mockups for PageNumberValidator.tsx
// Mockup for the detailed results table
const MockupValidatorResultsTable = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Clear & Actionable Results</Title>
      <Text c="dimmed" size="sm">
        Review validation status and start chats with valid numbers directly.
      </Text>
      <Table striped highlightOnHover withTableBorder mt="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Phone Number</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th ta="right">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>6281234567890</Table.Td>
            <Table.Td>
              <Badge color="green">Valid</Badge>
            </Table.Td>
            <Table.Td ta="right">
              <Icon
                icon="tabler:brand-whatsapp"
                color="var(--mantine-color-blue-6)"
              />
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>1234567890</Table.Td>
            <Table.Td>
              <Badge color="red">Invalid</Badge>
            </Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>6289876543210</Table.Td>
            <Table.Td>
              <Badge color="green">Valid</Badge>
            </Table.Td>
            <Table.Td ta="right">
              <Icon
                icon="tabler:brand-whatsapp"
                color="var(--mantine-color-blue-6)"
              />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  </Card>
)

// Mockup for the safety settings
const MockupValidatorSettings = () => (
  <Card withBorder radius="md" p="xl" w={620}>
    <Stack>
      <Title order={4}>Safe Validation Settings</Title>
      <Text c="dimmed" size="sm">
        Customize delays and batching to validate large lists safely.
      </Text>
      <Fieldset legend="Randomized Delay">
        <Group grow>
          <NumberInput label="Min Delay (sec)" value={2} disabled />
          <NumberInput label="Max Delay (sec)" value={5} disabled />
        </Group>
      </Fieldset>
      <Fieldset
        legend={
          <Group gap="xs">
            <Text>Batch Processing</Text>
          </Group>
        }
      >
        <Switch checked label="Process numbers in batches" disabled />
        <Group grow mt="md">
          <NumberInput label="Batch Size" value={50} disabled />
          <NumberInput label="Pause Duration (min)" value={1} disabled />
        </Group>
      </Fieldset>
    </Stack>
  </Card>
)
// ++ END: New Mockups

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
              <Icon icon={VALIDATOR_ICON} fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              The Smartest Way to Validate WhatsApp Numbers{' '}
            </Title>
            <Title order={2} c="white" fw={500} mt="md">
              Improve campaign ROI, and stop wasting messages on inactive
              numbers. The essential tool for marketers and sales teams.
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
                  <Icon icon="tabler:file-import" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Bulk Import/Export{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                {' '}
                Handle thousands of numbers from Excel & CSV.{' '}
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
                  <Icon icon="tabler:shield-cog" fontSize={30} />
                </ThemeIcon>
                <Title fw={700} order={2}>
                  Safe Validation
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                Use smart delays and batching to protect your account.
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
                  <Icon icon="tabler:analyze" fontSize={30} />
                </ThemeIcon>
                <Title order={2} fw={700}>
                  {' '}
                  Improve ROI{' '}
                </Title>
              </Group>
              <Text size="xl" c="gray.7" fw={500} mt="xs">
                Increase deliverability by messaging only valid users.
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
      title: 'Feature Screenshot: Simple Interface (1280x800)',
      filename: 'feature_simple_interface.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:mouse"
          title="Clean & Intuitive Interface"
          description="Just paste your list of numbers, adjust the safe settings, and click start. It's that simple to clean your contact lists."
          featureComponent={<MockupValidatorSimple />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Pro Tools for Large Lists (1280x800)',
      filename: 'feature_pro_tools.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:file-import"
          title="Handle Large Lists Like a Pro"
          description="Import thousands of numbers directly from an Excel file and use smart batch processing to validate large lists safely and efficiently."
          featureComponent={<MockupValidatorProFeatures />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Detailed Results (1280x800)',
      filename: 'feature_detailed_results.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:table-export"
          title="Export Actionable Results"
          description="Get a clear, color-coded summary of valid and invalid numbers. Export the results to a CSV or Excel file for your marketing campaigns."
          featureComponent={<MockupValidatorResultsTable />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Safety Settings (1280x800)',
      filename: 'feature_safety_settings.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:shield-cog"
          title="Validate with Confidence"
          description="Use randomized delays and batch processing to mimic human behavior. This approach significantly reduces risks when checking large numbers of contacts."
          featureComponent={<MockupValidatorSettings />}
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
          description="This extension operates 100% locally on your computer. Your contact lists and validation results are never uploaded to any server, ensuring complete privacy."
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
      component: <PromoIcon size={128} icon={VALIDATOR_ICON} />,
      ref: iconRef,
      name: 'promotional_icon.png',
    },
  ]

  const storeListingText = {
    titles: [
      'Bulk Number Validator for WhatsApp',
      'Check & Verify WA Numbers',
      'WhatsApp Number Cleaner & Filter',
    ],
    shortDescriptions: [
      'Safely validate thousands of WhatsApp numbers in bulk. Clean your contact lists, improve marketing ROI, and stop messaging dead numbers.',
      'The essential tool for marketers. Check if numbers are on WhatsApp, import from Excel, and export cleaned lists for your campaigns.',
      'Quickly verify your contact lists. Our number validator checks for active WhatsApp accounts without sending a single message.',
    ],
    longDescription: `📈 Stop Wasting Time & Money on Bad Numbers!

Tired of your WhatsApp marketing campaigns having low deliverability? WhatsDirect - WA Direct Chats for WhatsApp is the ultimate tool for cleaning your contact lists and ensuring your messages reach real, active users.

✨ Key Features
- 🚀 Bulk Number Validation: Check thousands of numbers at once. Just copy-paste your list or import it from a file.
- 📁 Excel & CSV Support (Pro): Easily import your contact lists from Excel or CSV files and export the clean results for your CRM or marketing platform.
- 🛡️ Safe & Smart Checking: Uses randomized delays and batch processing (Pro) to mimic human behavior, keeping your account safe.
- 📊 Clear Results: Instantly see which numbers are "Valid" and "Invalid" on WhatsApp.
- 🔒 100% Private & Secure: The validation process runs entirely on your computer. Your contact lists are never uploaded, seen, or stored by us.

🤔 Who Is This For?
- 💼 Digital Marketers: Clean your database before a major campaign to maximize ROI and engagement.
- 📈 Sales Teams: Verify leads from conferences, web forms, or purchased lists to ensure your reps are contacting valid prospects.
- 👥 Community Managers: Keep your member contact lists up-to-date and accurate.
- 👩‍💼 Anyone who manages large lists of contacts and needs to ensure they are reachable on WhatsApp.

🚀 Get started in seconds and take control of your contact data quality!

WhatsApp is a trademark of WhatsApp Inc., registered in the U.S. and other countries. This extension has no relationship to WhatsApp or WhatsApp Inc.`,
  }

  const justificationTexts = {
    singlePurpose: `The core purpose of this extension is to allow users to validate a list of phone numbers to check for the existence of active WhatsApp accounts. All features, such as number input fields, Excel import/export, and delay settings, are directly related to this single purpose of cleaning and verifying contact lists for more effective communication.`,
    storage: `The 'storage' permission is used to store essential user settings and license information locally on the user's device. This includes:
- The user's license key to unlock Pro features.
- An instance ID for license activation management.
- User preferences, such as custom delay and batch processing settings.
This data is stored only on the user's computer and is crucial for providing a persistent and personalized experience without requiring a remote server or user accounts.`,
    scripting: `Content scripts are essential for the extension's functionality. They are used exclusively on web.whatsapp.com to:
1. Inject the user interface (the main modal for validating numbers) onto the page, allowing users to interact with the extension directly within the WhatsApp Web environment.
2. Communicate with the WhatsApp Web application's JavaScript context to securely check numbers. This process is handled locally and is necessary to fulfill the extension's core purpose.`,
    hostWhatsapp: `The permission for "https://web.whatsapp.com/*" is required to allow the extension's content scripts to run on WhatsApp Web. The extension needs to access the DOM and interact with the page to inject its UI and perform the validation checks on the user's behalf. The extension's functionality is entirely dependent on its ability to operate on this specific domain.`,
    hostLemonSqueezy: `The permission for "https://api.lemonsqueezy.com/*" is used to securely communicate with the Lemon Squeezy API for license validation and management. When a user activates a Pro license, the extension sends a request to this domain to verify, activate, or deactivate the license key. This is a standard and secure method for handling software licensing and does not transmit any personal chat data or contact lists.`,
  }

  const keywords = [
    'whatsapp validator',
    'whatsapp number checker',
    'bulk whatsapp verify',
    'clean whatsapp list',
    'whatsapp marketing',
    'wa number check',
    'whatsapp filter',
    'whatsapp verifier',
    'check whatsapp number',
    'validate numbers',
    'whatsapp contacts cleaner',
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
