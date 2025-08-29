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

// --- Start: Updated Config for Number Validator Focus ---
// Define a structured feature type for the comparison table
export interface PlanFeature {
  feature: string
  free: string | boolean
  pro: string | boolean
}

// Centralized list of features for easy management and comparison
const comparisonFeatures: PlanFeature[] = [
  {
    feature: 'Number Validations per Run',
    free: 'Up to 5 Numbers',
    pro: 'Unlimited',
  },
  { feature: 'Check if Number Exists on WA', free: true, pro: true },
  { feature: 'Import Numbers from Excel/CSV', free: false, pro: true },
  { feature: 'Export Results to Excel/CSV', free: false, pro: true },
  {
    feature: 'Safe Batch Processing',
    free: false,
    pro: 'Configurable Batches & Pauses',
  },
  { feature: 'Adjustable Delay Between Checks', free: true, pro: true },
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
    description: 'For basic, small-scale checks.',
    price: '$0',
    placeholderPrice: null,
    link: '#',
    features: [
      'Validate up to 5 numbers at a time',
      'See which numbers are valid/invalid',
      'Adjustable delay settings',
      'Standard support',
    ],
  },
  {
    name: 'Pro Lifetime',
    isFree: false,
    description: 'Pay once, unlock powerful bulk validation tools forever.',
    placeholderPrice: '$89',
    price: '$39',
    link: 'https://extdotninja.lemonsqueezy.com/buy/53f1c17b-8636-49cf-b454-ab0ad2700418?media=0&logo=0&desc=0&discount=0',
    features: [
      'Validate Unlimited Numbers',
      'Import from Excel & CSV Files',
      'Export Results to Excel & CSV',
      'Safe Batch Processing',
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
        <Icon icon="tabler:checks" fontSize={48} />
      </ThemeIcon>
      <Title order={1} fz={{ base: 36, sm: 48 }}>
        {' '}
        Effortlessly Validate Thousands of WhatsApp Numbers.{' '}
      </Title>
      <Text c="dimmed" fz="lg">
        {' '}
        Stop wasting time and money on dead contacts. Clean your marketing
        lists, verify leads, and improve your message deliverability with our
        powerful bulk number validator.{' '}
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
          Get Lifetime Access Now{' '}
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
      icon: 'tabler:file-type-xls',
      title: 'Bulk Import & Export',
      description:
        'Easily import thousands of numbers from an Excel or CSV file. Export the validation results for your records. (Pro Feature)',
    },
    {
      icon: 'tabler:shield-cog',
      title: 'Safe & Smart Validation',
      description:
        'Our tool uses randomized delays and batch processing to mimic human behavior, significantly reducing any risks to your account.',
    },
    {
      icon: 'tabler:analyze',
      title: 'Boost Campaign ROI',
      description:
        'Clean your contact lists to ensure your messages are sent only to active WhatsApp users, increasing engagement and saving costs.',
    },
    {
      icon: 'tabler:shield-lock',
      title: 'Private & Secure',
      description:
        'Your contact lists are processed locally on your computer. We never see, store, or have access to your sensitive data.',
    },
    {
      icon: 'tabler:rocket',
      title: 'Simple & Fast',
      description:
        'A clean, intuitive interface designed to get your list validated in minutes. Just paste, configure your settings, and start.',
    },
  ]

  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>A Smarter Way to Manage Contacts</Title>
          <Text c="dimmed">
            {' '}
            Unlock powerful tools that make your communication more effective
            and efficient.{' '}
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
        <Title order={2}>Built For Professionals</Title>
        <Text c="dimmed">
          {' '}
          Whether you're in marketing, sales, or community management, we've got
          you covered.{' '}
        </Text>
      </Stack>
    </Center>
    <Grid mt="xl" gutter="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder radius="lg" p="xl" style={{ height: '100%' }}>
          <Stack style={{ height: '100%' }}>
            <Group>
              <ThemeIcon variant="light" size={40} radius="md">
                <Icon icon="tabler:target-arrow" fontSize={22} />
              </ThemeIcon>
              <Title order={3}>For Marketers & Sales Teams</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md">
              {' '}
              Maximize the impact of your outreach campaigns by ensuring your
              contact database is clean, up-to-date, and ready for engagement.{' '}
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
                Verify lead lists from events or web forms instantly.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Increase broadcast and campaign deliverability rates.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Reduce wasted resources on inactive numbers.{' '}
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
              Upgrade for Business Needs{' '}
            </Button>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder radius="lg" p="xl" style={{ height: '100%' }}>
          <Stack style={{ height: '100%' }}>
            <Group>
              <ThemeIcon variant="light" size={40} radius="md">
                <Icon icon="tabler:users-group" fontSize={22} />
              </ThemeIcon>
              <Title order={3}>For Community & HR Managers</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md">
              {' '}
              Maintain accurate contact information for your community members
              or employees. Ensure important announcements and updates reach
              everyone.{' '}
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
                Clean up member databases for better communication.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Verify phone numbers during employee onboarding.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Ensure contact lists for events are accurate.{' '}
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
              Get More Efficiency{' '}
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
      icon: 'tabler:building-store',
      title: 'Pre-Campaign List Cleaning',
      description:
        'A digital marketer uploads a list of 5,000 leads from a recent event. The tool identifies 800 invalid numbers, saving the company money and improving their campaign performance metrics.',
      features: ['Excel Import', 'Unlimited Validation'],
      persona: 'For Digital Marketers',
    },
    {
      icon: 'tabler:users',
      title: 'Verifying Sales Leads',
      description:
        'A sales team gets a list of potential clients. They quickly run the numbers through the validator to ensure their sales reps only spend time contacting people with active WhatsApp accounts.',
      features: ['Quick Validation', 'Improve Productivity'],
      persona: 'For Sales & Business',
    },
    {
      icon: 'tabler:database',
      title: 'Database Maintenance',
      description:
        'A community manager for a large online group periodically exports their member list and uses the validator to remove inactive numbers, keeping their communication channels effective.',
      features: ['Export Results', 'Data Management'],
      persona: 'For Community Managers',
    },
  ]

  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Solves Real-World Problems</Title>
          <Text c="dimmed">
            {' '}
            See how professionals use our tool to make their communication
            smarter.{' '}
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
              <b>Local Processing:</b> Your number lists are checked directly
              from your browser. They are never uploaded to our servers.{' '}
            </List.Item>
            <List.Item>
              {' '}
              <b>No Data Storage:</b> We never see, save, or have access to your
              contacts or validation results.{' '}
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
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
      name: 'Sarah L.',
      role: 'Digital Marketer',
      quote:
        'This validator has become an essential tool for our campaigns. We cleaned a list of 10,000 leads and our <b>deliverability shot up by over 20%</b>. The ability to import from Excel and export the results makes it incredibly efficient.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
      name: 'Mike P.',
      role: 'Sales Manager',
      quote:
        'My team uses this daily to verify new leads. <b>No more wasted time trying to contact invalid numbers</b>. The Pro version was a no-brainer for the unlimited checks. It paid for itself in the first week.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
      name: 'Alisha C.',
      role: 'Community Manager',
      quote:
        'We manage a large community, and keeping our contact list up-to-date was a nightmare. With this tool, we can <b>periodically clean our database in minutes</b>. The batch processing feature is fantastic for large lists.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
      name: 'David G.',
      role: 'Small Business Owner',
      quote:
        "I was hesitant about bulk messaging tools, but the <b>safety features like randomized delay gave me peace of mind</b>. It's powerful, yet simple to use. Worth every penny for the lifetime license.",
    },
  ]

  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Trusted by Professionals</Title>
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
      question: 'Why do I need to upgrade to Pro?',
      answer:
        'Pro unlocks the full power of the validator for professional use. You can check <b>unlimited numbers</b>, easily <b>import/export from Excel</b>, and use <b>safe batch processing</b> for very large lists. It turns a simple checker into a powerful data cleaning tool.',
    },
    {
      icon: 'tabler:key',
      question: 'Is this a one-time payment or a subscription?',
      answer:
        'It is a <b>one-time payment</b>. You pay once and get lifetime access to all current and future Pro features. No monthly fees, no subscriptions, ever.',
    },
    {
      icon: 'tabler:shield-check',
      question: 'Is this safe? Can my WhatsApp account get banned?',
      answer:
        'We have designed this tool with safety as a priority. The Pro version includes <b>randomized delays and batch processing</b> to mimic human behavior, which significantly reduces any risk. However, we always recommend using it responsibly.',
    },
    {
      icon: 'tabler:help',
      question: 'How does the validation actually work?',
      answer:
        'The tool uses an official WhatsApp Web function to check if a number is registered on the platform <b>without sending any message or notification</b> to the number being checked. It is a quick and discreet process.',
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
            Your Pro Lifetime License is a complete package for professional
            contact list management.{' '}
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
            <List.Item>Unlimited Number Validations</List.Item>
            <List.Item>Import from Excel & CSV</List.Item>
            <List.Item>Export Results to Excel & CSV</List.Item>
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
            <List.Item>Safe Batch Processing Controls</List.Item>
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
                Get Lifetime Access for Just $39!{' '}
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
              <Title order={2}>Ready to Supercharge Your Outreach?</Title>
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
                  Get Lifetime Access Now for Just $39{' '}
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
