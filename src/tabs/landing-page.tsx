// src/tabs/landing-page.tsx
import { PRIMARY_ICON } from '@/constants'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  Accordion,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  List,
  MantineProvider,
  Paper,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  Transition,
} from '@mantine/core'
import '@mantine/core/styles.css'
import { useWindowScroll } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'

// --- Start: Updated Config for Group Admin Finder Focus ---
// Define a structured feature type for the comparison table
export interface PlanFeature {
  feature: string
  free: string | boolean
  pro: string | boolean
}

// Centralized list of features for easy management and comparison
const comparisonFeatures: PlanFeature[] = [
  { feature: 'Select a Single Group', free: true, pro: true },
  {
    feature: 'Find Admins & Super Admins',
    free: 'Up to 10 admins',
    pro: 'Unlimited',
  },
  { feature: 'Export to CSV', free: true, pro: true },
  { feature: 'Export to Excel, PDF & JSON', free: false, pro: true },
  { feature: 'Export as vCard (.vcf)', free: false, pro: true },
  { feature: 'Select Multiple Groups at Once', free: false, pro: true },
  { feature: 'Customize Export Columns', free: false, pro: true },
  { feature: 'Direct Message an Admin from the List', free: true, pro: true },
  {
    feature: 'Customer Support',
    free: 'Standard Support',
    pro: 'Priority Support',
  },
]

// Define plan objects for the pricing cards.
const plans = [
  {
    name: 'Free',
    isFree: true,
    description: 'For basic admin discovery.',
    price: '$0',
    placeholderPrice: null,
    link: '#',
    features: [
      'Select one group at a time',
      'Find all admins and super admins',
      'Export up to 10 admins to CSV',
      'Standard support',
    ],
  },
  {
    name: 'Pro Lifetime',
    isFree: false,
    description:
      'Pay once, unlock powerful tools to connect with and manage group administrators.',
    placeholderPrice: '$89',
    price: '$19',
    link: 'https://extdotninja.lemonsqueezy.com/buy/b37c82a9-5119-4912-b2df-fcc72e3b5ad6?logo=0',
    features: [
      'Find Admins from Multiple Groups at Once',
      'Unlimited Admin Exports',
      'Export to CSV, Excel, PDF, JSON & vCard',
      'Customize Export Columns',
      'Priority Customer Support',
      'All Future Updates Included',
    ],
  },
]
// --- End: Updated Config ---

const CheckIcon = () => (
  <Icon
    icon="tabler:check"
    fontSize={20}
    strokeWidth={2.5}
    color="var(--mantine-color-teal-6)"
  />
)
const CrossIcon = () => (
  <Icon
    icon="tabler:x"
    fontSize={20}
    strokeWidth={2.5}
    color="var(--mantine-color-red-6)"
  />
)

// --- Countdown Timer Logic ---
interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const calculateTimeLeft = (offerEndDate: Date): TimeLeft | null => {
  const difference = +offerEndDate - +new Date()
  if (difference <= 0) {
    return null
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

const TimeSegment: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <Stack align="center" gap={0}>
    <Text fz={32} fw={700} c="yellow.6">
      {' '}
      {String(value).padStart(2, '0')}{' '}
    </Text>
    <Text size="xs" c="dimmed">
      {' '}
      {label}{' '}
    </Text>
  </Stack>
)

const CountdownTimer: React.FC<{ offerEndDate: Date; isMini?: boolean }> = ({
  offerEndDate,
  isMini = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft(offerEndDate),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(offerEndDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [offerEndDate])

  if (!timeLeft) {
    return (
      <Text c="red.7" fw={700} size="lg">
        {' '}
        Offer has ended!{' '}
      </Text>
    )
  }

  if (isMini) {
    return (
      <Text c="white" size="sm" fw={500}>
        {' '}
        Offer Ends In: {String(timeLeft.days).padStart(2, '0')}:
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </Text>
    )
  }

  return (
    <Group justify="center" gap="lg">
      <TimeSegment value={timeLeft.days} label="DAYS" />
      <TimeSegment value={timeLeft.hours} label="HOURS" />
      <TimeSegment value={timeLeft.minutes} label="MINUTES" />
      <TimeSegment value={timeLeft.seconds} label="SECONDS" />
    </Group>
  )
}
// --- End Countdown Timer Logic ---

// --- Section Components ---
const HeroSection = () => (
  <Center p="xl" pt={80}>
    <Stack align="center" gap="xl" ta="center" maw={700}>
      <ThemeIcon
        size={80}
        radius="xl"
        variant="gradient"
        gradient={{ from: 'teal', to: 'lime' }}
      >
        <Icon icon="tabler:users-group" fontSize={48} />
      </ThemeIcon>
      <Title order={1} fz={{ base: 36, sm: 48 }}>
        {' '}
        Find and Export WhatsApp Group Admins in a Click.{' '}
      </Title>
      <Text c="dimmed" fz="lg">
        {' '}
        Stop manually searching for group admins. Select your groups and
        instantly get a clean list of all administrators and super admins, ready
        to export.{' '}
      </Text>
      <Stack align="center">
        <Button
          size="lg"
          component="a"
          href={plans.find((p) => !p.isFree)?.link}
          target="_blank"
          leftSection={<Icon icon="tabler:crown" fontSize={20} />}
          variant="gradient"
          gradient={{ from: 'teal', to: 'lime' }}
          radius="md"
        >
          {' '}
          Get Lifetime Access to Pro Features{' '}
        </Button>
        <Text size="xs" c="dimmed">
          {' '}
          Includes 30-day money-back guarantee{' '}
        </Text>
      </Stack>
    </Stack>
  </Center>
)

const FeaturesSection = () => {
  const featuresData = [
    {
      icon: 'tabler:zoom-scan',
      title: 'Instant Admin Detection',
      description:
        'Select one or multiple groups, and our tool instantly identifies and lists all admins and super admins, saving you hours of manual scrolling.',
    },
    {
      icon: 'tabler:table-export',
      title: 'Powerful Data Export',
      description:
        'Export your admin lists to CSV, Excel, PDF, JSON, or even vCard to quickly build a contact list of community leaders. (Pro Feature)',
    },
    {
      icon: 'tabler:shield-lock',
      title: 'Private & Secure',
      description:
        'Your group data is processed locally on your computer. We never see, store, or have access to your contacts, ensuring your privacy is always protected.',
    },
    {
      icon: 'tabler:users-group',
      title: 'Multi-Group Coordination',
      description:
        'Need to contact all admins across your communities? Select all relevant groups and export a unified list for easy communication and coordination.',
    },
    {
      icon: 'tabler:rocket',
      title: 'Simple & Fast',
      description:
        'A clean, intuitive interface designed to find and export admin contacts in seconds, not hours, directly within WhatsApp Web.',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Streamline Your Community Management</Title>
          <Text c="dimmed">
            {' '}
            Turn chaotic group structures into organized contact lists of key
            people.{' '}
          </Text>
        </Stack>
      </Center>
      <Grid mt="xl" gutter="xl">
        {featuresData.map((feature) => (
          <Grid.Col span={{ base: 12, md: 4 }} key={feature.title}>
            <Card withBorder radius="lg" p="xl" style={{ height: '100%' }}>
              <Group>
                <ThemeIcon variant="light" size={40} radius="md">
                  <Icon icon={feature.icon} fontSize={22} />
                </ThemeIcon>
                <Text fw={700} fz="lg">
                  {' '}
                  {feature.title}{' '}
                </Text>
              </Group>
              <Text c="dimmed" size="sm" mt="md">
                {' '}
                {feature.description}{' '}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  )
}

const UserPersonaSection = () => (
  <Box mt={80}>
    <Center>
      <Stack align="center" ta="center" maw={600}>
        <Title order={2}>Built for Networkers & Community Builders</Title>
        <Text c="dimmed">
          {' '}
          Whether you're coordinating large communities or building a network,
          we've got you covered.{' '}
        </Text>
      </Stack>
    </Center>
    <Grid mt="xl" gutter="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder radius="lg" p="xl" style={{ height: '100%' }}>
          <Stack style={{ height: '100%' }}>
            <Group>
              <ThemeIcon variant="light" size={40} radius="md">
                <Icon icon="tabler:building-community" fontSize={22} />
              </ThemeIcon>
              <Title order={3}>For Community Managers</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md">
              {' '}
              Quickly get a list of all co-admins across dozens of groups to
              streamline communication and ensure everyone is on the same page.{' '}
            </Text>
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="teal" size={20} radius="xl">
                  <Icon icon="tabler:check" fontSize={12} />
                </ThemeIcon>
              }
            >
              <List.Item>
                {' '}
                Create an admin-only coordination group in minutes.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Send updates to all group leaders simultaneously.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Keep a record of who is managing each community.{' '}
              </List.Item>
            </List>
            <Button
              component="a"
              href="#pricing"
              mt="auto"
              variant="light"
              color="teal"
            >
              {' '}
              Coordinate Your Admins{' '}
            </Button>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder radius="lg" p="xl" style={{ height: '100%' }}>
          <Stack style={{ height: '100%' }}>
            <Group>
              <ThemeIcon variant="light" size={40} radius="md">
                <Icon icon="tabler:briefcase" fontSize={22} />
              </ThemeIcon>
              <Title order={3}>For Business & Networking</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md">
              {' '}
              Extract contact details of admins from industry, partner, or
              networking groups to build valuable B2B connection lists.{' '}
            </Text>
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="teal" size={20} radius="xl">
                  <Icon icon="tabler:check" fontSize={12} />
                </ThemeIcon>
              }
            >
              <List.Item>
                {' '}
                Identify key decision-makers in communities.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Build a targeted outreach list of group leaders.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Easily import key contacts into your CRM or phone.{' '}
              </List.Item>
            </List>
            <Button
              component="a"
              href="#pricing"
              mt="auto"
              variant="light"
              color="teal"
            >
              {' '}
              Enhance Your Networking{' '}
            </Button>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  </Box>
)

const CaseStudySection = () => {
  const caseStudies = [
    {
      icon: 'tabler:network',
      title: 'Coordinating a Network',
      description:
        'A manager of a 30-group brand ambassador network needs to send a critical update. They select all 30 groups, find all admins, and export the list to create a new, private broadcast channel for leaders only.',
      features: ['Multi-Group Selection', 'Time-Saving'],
    },
    {
      icon: 'tabler:building-store',
      title: 'B2B Lead Generation',
      description:
        'A sales rep joins several industry-specific groups. They export the admin lists from each group, creating a high-quality lead list of potential business partners and decision-makers to contact.',
      features: ['vCard Export', 'Lead Generation'],
    },
    {
      icon: 'tabler:school',
      title: 'Managing School Groups',
      description:
        'A school principal needs to contact the parent-teacher admin from each class group. They quickly get a list of all admins, making it easy to schedule a meeting without searching through each group individually.',
      features: ['Efficient Communication', 'Admin Lists'],
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Solves Real-World Problems</Title>
          <Text c="dimmed">
            {' '}
            See how people use our tool to connect with the right people,
            faster.{' '}
          </Text>
        </Stack>
      </Center>
      <Grid mt="xl" gutter="xl">
        {caseStudies.map((study) => (
          <Grid.Col span={{ base: 12, md: 4 }} key={study.title}>
            <Card
              withBorder
              radius="lg"
              p="xl"
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack style={{ flexGrow: 1 }}>
                <Group>
                  <ThemeIcon variant="light" size={40} radius="md">
                    <Icon icon={study.icon} fontSize={22} />
                  </ThemeIcon>
                  <Title order={4}>{study.title}</Title>
                </Group>
                <Text c="dimmed" size="sm" mt="sm">
                  {' '}
                  {study.description}{' '}
                </Text>
              </Stack>
              <Group gap="xs" mt="lg">
                {study.features.map((feature) => (
                  <Badge key={feature} variant="light" color="teal">
                    {feature}
                  </Badge>
                ))}
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  )
}

const PricingSection: React.FC<{ offerEndDate: Date }> = ({ offerEndDate }) => (
  <Box mt={80} id="pricing">
    <Center>
      <Stack align="center" ta="center" maw={600}>
        <Title order={2}>Get a Lifetime License</Title>
        <Text c="dimmed">One single payment. All Pro features forever.</Text>
      </Stack>
    </Center>
    <Group justify="center" align="stretch" mt="xl" gap="lg">
      {plans.map((plan, index) => (
        <Paper
          key={index}
          withBorder
          w={{ base: '100%', sm: 380 }}
          radius={'lg'}
          p="xl"
          style={{
            border: !plan.isFree
              ? '2px solid var(--mantine-color-teal-6)'
              : undefined,
            boxShadow: !plan.isFree
              ? 'var(--mantine-shadow-lg)'
              : 'var(--mantine-shadow-sm)',
            position: 'relative',
          }}
        >
          <Stack justify="space-between" style={{ height: '100%' }}>
            <Box ta="center">
              <Title order={2}>{plan.name}</Title>
              <Text c="dimmed" mt={4} size="sm">
                {' '}
                {plan.description}{' '}
              </Text>
            </Box>

            <Box my="lg" ta="center">
              {!plan.isFree && (
                <Stack mb="lg">
                  <Title order={4} c="orange.7">
                    {' '}
                    LAUNCH OFFER: 56% OFF ENDS SOON!{' '}
                  </Title>
                  <CountdownTimer offerEndDate={offerEndDate} />
                  <Text size="xs" c="dimmed" mt="xs">
                    {' '}
                    Don't miss out on saving $50. Price returns to normal after
                    the timer ends.{' '}
                  </Text>
                </Stack>
              )}
              <Box pos="relative">
                <Group gap={8} align={'baseline'} justify="center">
                  {plan.placeholderPrice && (
                    <Title
                      order={3}
                      c={'dimmed'}
                      style={{ textDecorationLine: 'line-through' }}
                    >
                      {' '}
                      {plan.placeholderPrice}{' '}
                    </Title>
                  )}
                  <Title order={1} fz={52}>
                    {' '}
                    {plan.price}{' '}
                  </Title>
                </Group>
              </Box>
            </Box>

            <Divider label="Key Features" labelPosition="center" my="sm" />

            <Stack gap="sm" mb="lg">
              {plan.features.map((feature, idx) => (
                <Group key={idx} gap="sm" wrap="nowrap" align="flex-start">
                  <ThemeIcon
                    variant="light"
                    color={plan.isFree ? 'gray' : 'teal'}
                    size="sm"
                    radius="xl"
                  >
                    {plan.isFree ? (
                      <Icon icon="tabler:circle-check" fontSize={16} />
                    ) : (
                      <Icon icon="tabler:star" fontSize={16} />
                    )}
                  </ThemeIcon>
                  <Text size="sm">{feature}</Text>
                </Group>
              ))}
            </Stack>

            <Box mt="auto">
              {plan.isFree ? (
                <Button size="md" variant="default" fullWidth disabled>
                  {' '}
                  Your Current Plan{' '}
                </Button>
              ) : (
                <Stack gap="xs">
                  <Button
                    size="lg"
                    component="a"
                    href={plan.link}
                    target="_blank"
                    fullWidth
                    leftSection={<Icon icon="tabler:crown" fontSize={20} />}
                    variant="gradient"
                    gradient={{ from: 'teal', to: 'lime' }}
                  >
                    {' '}
                    Upgrade to Pro{' '}
                  </Button>
                  <Stack gap={4} align="center" mt="xs">
                    <Group justify="center" gap={6}>
                      <Icon
                        icon="tabler:lock"
                        fontSize={14}
                        color="var(--mantine-color-gray-6)"
                      />
                      <Text size="xs" c="dimmed">
                        {' '}
                        100% Secure Payment via Lemon Squeezy{' '}
                      </Text>
                    </Group>
                    <Group justify="center" gap={6}>
                      <Icon
                        icon="tabler:shield-check"
                        fontSize={14}
                        color="var(--mantine-color-gray-6)"
                      />
                      <Text size="xs" c="dimmed">
                        {' '}
                        30-Day Money-Back Guarantee{' '}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>
      ))}
    </Group>
  </Box>
)

const NoSubscriptionSection = () => (
  <Box mt={80}>
    <Center>
      <Stack align="center" ta="center" maw={600}>
        <Title order={2}>No Monthly Fees. Own It Forever.</Title>
        <Text c="dimmed">
          {' '}
          Forget recurring subscription costs. With the Pro version, you pay
          once for lifetime access to all current features and future updates.{' '}
        </Text>
        <Card withBorder p="xl" radius="lg" mt="md" w="100%">
          <Grid align="center">
            <Grid.Col span={5} ta="center">
              <Stack align="center">
                <Icon
                  icon="tabler:calendar-dollar"
                  fontSize={48}
                  color="var(--mantine-color-red-6)"
                />
                <Text fw={500}>Endless Subscriptions</Text>
                <Icon
                  icon="tabler:x"
                  fontSize={32}
                  color="var(--mantine-color-red-6)"
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={2}>
              <Center>
                <Divider orientation="vertical" />
              </Center>
            </Grid.Col>
            <Grid.Col span={5} ta="center">
              <Stack align="center">
                <Icon
                  icon="tabler:pig-money"
                  fontSize={48}
                  color="var(--mantine-color-teal-6)"
                />
                <Text fw={500}>One-Time Payment</Text>
                <Icon
                  icon="tabler:check"
                  fontSize={32}
                  color="var(--mantine-color-teal-6)"
                />
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
    </Center>
  </Box>
)

const FeatureComparisonTable = () => (
  <Box mt={80}>
    <Center>
      <Title order={2} ta="center" mb="xl">
        {' '}
        Features Comparison{' '}
      </Title>
    </Center>
    <Card withBorder radius="lg" p={0}>
      <Table striped highlightOnHover verticalSpacing="md" fz="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="40%">Feature</Table.Th>
            <Table.Th ta="center">Free</Table.Th>
            <Table.Th ta="center">Pro</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {comparisonFeatures.map((item) => (
            <Table.Tr
              key={item.feature}
              style={{
                backgroundColor:
                  item.free === false
                    ? 'var(--mantine-color-teal-0)'
                    : undefined,
              }}
            >
              <Table.Td>
                <Group gap="xs" justify="space-between">
                  <Text fw={500}>{item.feature}</Text>
                </Group>
              </Table.Td>
              <Table.Td ta="center">
                {typeof item.free === 'boolean' ? (
                  item.free ? (
                    <CheckIcon />
                  ) : (
                    <CrossIcon />
                  )
                ) : (
                  <Text size="sm">{item.free}</Text>
                )}
              </Table.Td>
              <Table.Td ta="center">
                {typeof item.pro === 'boolean' ? (
                  item.pro ? (
                    <CheckIcon />
                  ) : (
                    <CrossIcon />
                  )
                ) : (
                  <Badge color="teal" variant="light">
                    {' '}
                    {item.pro}{' '}
                  </Badge>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  </Box>
)

const SecuritySection = () => (
  <Box mt={80}>
    <Card withBorder p="xl" radius="lg" bg="gray.0">
      <Grid align="center">
        <Grid.Col span={{ base: 12, md: 2 }} ta="center">
          <ThemeIcon size={80} radius="xl" variant="light" color="teal">
            <Icon icon="tabler:shield-lock" fontSize={48} />
          </ThemeIcon>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 10 }}>
          <Title order={2}>Your Privacy is Our Top Priority</Title>
          <Text c="dimmed" mt="md">
            {' '}
            We designed this extension with a "privacy-first" approach. You have
            complete and total control over your data, always.{' '}
          </Text>
          <List
            mt="md"
            spacing="xs"
            size="sm"
            icon={
              <ThemeIcon color="teal" size={20} radius="xl">
                <Icon icon="tabler:check" fontSize={12} />
              </ThemeIcon>
            }
          >
            <List.Item>
              {' '}
              <b>Direct Actions:</b> Your data is exported directly through the
              official WhatsApp Web interface.{' '}
            </List.Item>
            <List.Item>
              {' '}
              <b>No Data Storage:</b> We never see, save, or have access to your
              groups, contacts, or conversations.{' '}
            </List.Item>
            <List.Item>
              {' '}
              <b>You Are in Control:</b> All actions happen on your own
              computer, under your control.{' '}
            </List.Item>
          </List>
        </Grid.Col>
      </Grid>
    </Card>
  </Box>
)

const TestimonialsSection = () => {
  const testimonialsData = [
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
      name: 'David G.',
      role: 'Community Network Manager',
      quote:
        'Coordinating with admins across 50+ groups was a nightmare. This tool lets me get a unified list of every admin in seconds. The <b>ability to export from multiple groups at once</b> has been a game-changer for my weekly syncs.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
      name: 'Alisha C.',
      role: 'Business Development',
      quote:
        "For my B2B outreach, I need to connect with decision-makers. Finding group admins is key. This extension's <b>vCard export is brilliant</b>—I get a ready-to-import contact list of potential partners in minutes.",
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
      name: 'Sarah L.',
      role: 'Marketing Strategist',
      quote:
        'I identify key influencers by finding the admins of major community groups. This tool saves me so much time. The Pro upgrade was a no-brainer for the <b>unlimited exports and Excel format</b>.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
      name: 'Mike P.',
      role: 'Club President',
      quote:
        'Just needed a simple way to get a contact list of all the other club admins in the district. This does it perfectly. Simple, fast, and the <b>CSV export works great</b> for my records.',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Trusted by Users Like You</Title>
          <Text c="dimmed">
            {' '}
            See what our happy customers are saying about the Pro version.{' '}
          </Text>
        </Stack>
      </Center>
      <Grid mt="xl" gutter="xl">
        {testimonialsData.map((testimonial) => (
          <Grid.Col span={{ base: 12, md: 6 }} key={testimonial.name}>
            <Card withBorder radius="lg" p="xl" style={{ height: '100%' }}>
              <Stack>
                <Text
                  c="dimmed"
                  dangerouslySetInnerHTML={{ __html: testimonial.quote }}
                />
                <Group mt="md">
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    radius="xl"
                  />
                  <div>
                    <Text fw={500}>{testimonial.name}</Text>
                    <Text size="xs" c="dimmed">
                      {' '}
                      {testimonial.role}{' '}
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  )
}

const GuaranteeSection = () => (
  <Paper
    bg="teal.0"
    radius="lg"
    p="xl"
    mt={80}
    style={{ border: '2px dashed var(--mantine-color-teal-4)' }}
  >
    <Group justify="center" align="center">
      <ThemeIcon variant="light" color="teal" size={60} radius="xl">
        <Icon icon="tabler:shield-check" fontSize={32} />
      </ThemeIcon>
      <Stack gap={0} ta={{ base: 'center', sm: 'left' }}>
        <Title order={3}>Our 100% 'Peace of Mind' Full Guarantee</Title>
        <Text c="dimmed" maw={500}>
          {' '}
          We're confident you'll love the Pro features. If you're not 100%
          satisfied, contact us within 30 days of your purchase for a full,
          no-questions-asked refund.{' '}
        </Text>
      </Stack>
    </Group>
  </Paper>
)

const FaqSection = () => {
  const faqData = [
    {
      icon: 'tabler:rocket',
      question: 'What are the main benefits of upgrading to Pro?',
      answer:
        'Pro makes finding and managing admins incredibly efficient. You can <b>select multiple groups at once</b> to get a unified list, which is a massive time-saver. You also unlock <b>all export formats (Excel, PDF, vCard)</b> and get unlimited exports.',
    },
    {
      icon: 'tabler:key',
      question: 'Is this a one-time payment or a subscription?',
      answer:
        'It is a <b>one-time payment</b>. You pay once and get lifetime access to all current and future Pro features. No monthly fees, no subscriptions, ever.',
    },
    {
      icon: 'tabler:alert-circle',
      question: "Can I find admins from a group I'm not in?",
      answer:
        'No. For security and privacy, you can only find admins from groups that you are currently a member of. The extension automatically populates a list of your available groups.',
    },
    {
      icon: 'tabler:users',
      question: 'What is the difference between an Admin and a Super Admin?',
      answer:
        'A "Super Admin" is typically the original creator of the group and has the ultimate authority, including the ability to remove other admins. An "Admin" has privileges like adding or removing members, but cannot remove a Super Admin. Our tool identifies and labels both for you.',
    },
  ]
  return (
    <Box mt={80} id="faq">
      <Center>
        <Title order={2} ta="center" mb="xl">
          {' '}
          Frequently Asked Questions{' '}
        </Title>
      </Center>
      <Accordion variant="separated" radius="lg">
        {faqData.map((item, index) => (
          <Accordion.Item key={index} value={item.question}>
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" size="lg">
                  <Icon icon={item.icon} fontSize={22} />
                </ThemeIcon>
              }
            >
              <Text fw={500}>{item.question}</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text
                c="dimmed"
                size="sm"
                lh={1.6}
                dangerouslySetInnerHTML={{
                  __html: item.answer.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
                }}
              />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  )
}

const ValueStackSection = () => (
  <Box mt={80}>
    <Card withBorder radius="lg" p="xl">
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Here's Everything You Get</Title>
          <Text c="dimmed">
            {' '}
            Your Pro Lifetime License is a complete package for powerful admin
            and community management.{' '}
          </Text>
        </Stack>
      </Center>
      <Grid mt="xl" gutter="xl">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <List
            spacing="sm"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <Icon icon="tabler:check" fontSize={14} />
              </ThemeIcon>
            }
          >
            <List.Item>Find Admins from Multiple Groups</List.Item>
            <List.Item>Unlimited Admin Exports</List.Item>
            <List.Item>Export to CSV, Excel, PDF & JSON</List.Item>
          </List>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <List
            spacing="sm"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <Icon icon="tabler:check" fontSize={14} />
              </ThemeIcon>
            }
          >
            <List.Item>Export to vCard (for Contacts app)</List.Item>
            <List.Item>Customize Export Columns</List.Item>
            <List.Item>Priority Customer Support</List.Item>
            <List.Item>30-Day Money-Back Guarantee</List.Item>
          </List>
        </Grid.Col>
      </Grid>
    </Card>
  </Box>
)

const ContactUsSection = () => (
  <Box mt={80}>
    <Card withBorder p="xl" shadow="sm" radius="lg">
      <Group>
        <ThemeIcon size="xl" radius="md" variant="light">
          <Icon icon="tabler:mail-filled" fontSize={24} />
        </ThemeIcon>
        <Stack gap={2}>
          <Title order={4}>Still Have Questions?</Title>
          <Text c="dimmed" size="sm">
            {' '}
            Our team is ready to help. Contact us for any inquiries.{' '}
          </Text>
          <Anchor
            href="mailto:extdotninja@gmail.com"
            size="sm"
            fw={500}
            target="_blank"
          >
            {' '}
            extdotninja@gmail.com{' '}
          </Anchor>
        </Stack>
      </Group>
    </Card>
  </Box>
)

const Footer = () => (
  <Box mt={80} py="xl">
    <Divider />
    <Stack align="center" ta="center" mt="xl" gap={4}>
      <Text size="sm">
        {' '}
        Copyright © {new Date().getFullYear()}. All Rights Reserved.{' '}
      </Text>
      <Text size="xs" c="dimmed" maw={500}>
        {' '}
        This is an independent software and is not affiliated with, sponsored,
        or endorsed by WhatsApp LLC.{' '}
      </Text>
    </Stack>
  </Box>
)

const StickyHeader: React.FC<{ offerEndDate: Date }> = ({ offerEndDate }) => {
  const [scroll] = useWindowScroll()

  return (
    <Transition
      mounted={scroll.y > 200}
      transition="slide-down"
      duration={300}
      timingFunction="ease"
    >
      {(styles) => (
        <Paper
          shadow="md"
          radius={0}
          p="xs"
          style={{
            ...styles,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'var(--mantine-color-dark-8)',
          }}
        >
          <Container size="md">
            <Group justify="space-between">
              <CountdownTimer offerEndDate={offerEndDate} isMini />
              <Button
                size="sm"
                component="a"
                href={plans.find((p) => !p.isFree)?.link}
                target="_blank"
                leftSection={<Icon icon="tabler:crown" fontSize={18} />}
                variant="gradient"
                gradient={{ from: 'teal', to: 'lime' }}
              >
                {' '}
                Get Lifetime Access for Just $19!{' '}
              </Button>
            </Group>
          </Container>
        </Paper>
      )}
    </Transition>
  )
}

const getOfferEndDate = (): Date => {
  const storedEndDate = localStorage.getItem('offerEndDate')
  if (storedEndDate && new Date(storedEndDate) > new Date()) {
    return new Date(storedEndDate)
  }

  const newEndDate = new Date()
  newEndDate.setDate(newEndDate.getDate() + 3)
  localStorage.setItem('offerEndDate', newEndDate.toISOString())
  return newEndDate
}

const LandingPage = () => {
  const [notification, setNotification] = useState<{
    city: string
    country: string
  } | null>(null)
  const [offerEndDate] = useState(getOfferEndDate)

  useEffect(() => {
    const locations = [
      { city: 'Torino', country: 'Italy' },
      { city: 'Shaqra', country: 'Saudi Arabia' },
      { city: 'Miami', country: 'United States' },
    ]
    let timeoutId: NodeJS.Timeout

    const scheduleNextNotification = () => {
      clearTimeout(timeoutId)
      const randomDelay = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000 // 8-15 seconds
      timeoutId = setTimeout(() => {
        const randomLocation =
          locations[Math.floor(Math.random() * locations.length)]
        setNotification(randomLocation)

        timeoutId = setTimeout(() => {
          setNotification(null)
          scheduleNextNotification()
        }, 4000) // Show for 4 seconds
      }, randomDelay)
    }

    timeoutId = setTimeout(scheduleNextNotification, 5000) // First one after 5 seconds

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <MantineProvider theme={theme}>
      <StickyHeader offerEndDate={offerEndDate} />
      <Container size="md" py="xl">
        <Stack gap={80}>
          <HeroSection />
          <FeaturesSection />
          <UserPersonaSection />
          <CaseStudySection />
          <PricingSection offerEndDate={offerEndDate} />
          <NoSubscriptionSection />
          <FeatureComparisonTable />
          <SecuritySection />
          <TestimonialsSection />
          <GuaranteeSection />
          <FaqSection />
          <ValueStackSection />
          <ContactUsSection />
          <Center mt={40}>
            <Stack align="center" gap="lg">
              <Title order={2}>
                {' '}
                Ready to Streamline Your Admin Coordination?{' '}
              </Title>
              <Text c="dimmed" size="lg">
                {' '}
                Get all Pro features for a one-time payment.{' '}
              </Text>
              <Stack align="center">
                <Button
                  size="lg"
                  component="a"
                  href={plans.find((p) => !p.isFree)?.link}
                  target="_blank"
                  leftSection={<Icon icon="tabler:crown" fontSize={20} />}
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime' }}
                  radius="md"
                >
                  {' '}
                  Get Lifetime Access Now for Just $19{' '}
                </Button>
                <Text size="xs" c="dimmed">
                  {' '}
                  30-day no-questions-asked money-back guarantee.{' '}
                </Text>
              </Stack>
            </Stack>
          </Center>
          <Footer />
        </Stack>
      </Container>
      <Transition
        mounted={!!notification}
        transition="slide-right"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <Paper
            shadow="lg"
            p="sm"
            radius="md"
            withBorder
            style={{
              ...styles,
              position: 'fixed',
              bottom: 20,
              left: 20,
              zIndex: 2000,
            }}
          >
            <Group>
              <ThemeIcon color="teal" size={36} radius="xl">
                <Icon icon="tabler:shield-check" fontSize={22} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text fw={500} size="sm">
                  {' '}
                  Just upgraded to Pro!{' '}
                </Text>
                <Text size="xs" c="dimmed">
                  {' '}
                  {`Someone from ${notification?.city}, ${notification?.country}`}{' '}
                </Text>
              </Stack>
            </Group>
          </Paper>
        )}
      </Transition>
    </MantineProvider>
  )
}

export default LandingPage
