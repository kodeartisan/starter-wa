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

// --- Start: New Config for Label & Contact Manager ---

// Define a structured feature type for the comparison table
export interface PlanFeature {
  feature: string
  free: string | boolean
  pro: string | boolean
}

// Centralized list of features for easy management and comparison
const comparisonFeatures: PlanFeature[] = [
  { feature: 'Create Labels', free: 'Up to 3 labels', pro: 'Unlimited' },
  { feature: 'Contacts per Label', free: 'Up to 5 contacts', pro: 'Unlimited' },
  {
    feature: 'Advanced Filtering (by Group, Color)',
    free: true,
    pro: true,
  },
  {
    feature: 'Export Contacts to CSV/Excel',
    free: false,
    pro: true,
  },
  {
    feature: 'Backup & Restore All Labels',
    free: false,
    pro: true,
  },
  { feature: 'Search & Organization Tools', free: true, pro: true },
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
    description: 'For basic contact organization.',
    price: '$0',
    placeholderPrice: null,
    link: '#',
    features: [
      'Create up to 3 labels',
      'Add up to 5 contacts per label',
      'Basic filtering',
      'Standard support',
    ],
  },
  {
    name: 'Pro Lifetime',
    isFree: false,
    description: 'Pay once, unlock powerful CRM features forever.',
    placeholderPrice: '$89',
    price: '$39',
    link: 'https://extdotninja.lemonsqueezy.com/buy/7a81472f-2102-4e24-aba0-508a8cbc8da1?logo=0', // NOTE: This is a placeholder link for the new product
    features: [
      'Unlimited Labels',
      'Unlimited Contacts per Label',
      'Export Contacts (CSV/Excel)',
      'Backup & Restore Your Data',
      'Priority Customer Support',
      'All Future Updates Included',
    ],
  },
]
// --- End: New Config ---

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
        <Icon icon={PRIMARY_ICON} fontSize={48} />
      </ThemeIcon>
      <Title order={1} fz={{ base: 36, sm: 48 }}>
        {' '}
        Organize Your WhatsApp Contacts with Smart Labels{' '}
      </Title>
      <Text c="dimmed" fz="lg">
        {' '}
        Stop scrolling endlessly. Create custom labels, filter chats, and manage
        your contacts like a pro. A simple CRM right inside WhatsApp.{' '}
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
          Get Lifetime Access{' '}
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
      icon: 'tabler:tags',
      title: 'Smart Labeling',
      description:
        'Create unlimited color-coded labels and groups. Organize contacts by project, priority, or status—whatever fits your workflow.',
    },
    {
      icon: 'tabler:filter',
      title: 'Advanced Filtering',
      description:
        'Instantly filter your chat list by one or more labels. Focus on the right conversations and never lose track of important contacts.',
    },
    {
      icon: 'tabler:database-export',
      title: 'Backup & Export',
      description:
        'Never lose your organized contacts. Pro users can back up all labels to a file and export contact lists to CSV or Excel for use in other tools.',
    },
    {
      icon: 'tabler:shield-check',
      title: '100% Private',
      description:
        'Your labels and contact lists are stored securely on your own computer. We never see, save, or have access to your data.',
    },
    {
      icon: 'tabler:users-group',
      title: 'Bulk Management',
      description:
        'Easily add or remove contacts from labels, import contacts from a file, and manage your lists with powerful, time-saving tools.',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>A Smarter Way to Manage Your Contacts</Title>
          <Text c="dimmed">
            {' '}
            Unlock powerful CRM-like tools that make your communication more
            effective and efficient.{' '}
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
          Whether you're in sales, marketing, or community management, we've got
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
              <Title order={3}>For Sales & Business</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md">
              {' '}
              Manage your sales funnel directly in WhatsApp. Label contacts as
              "Leads," "Follow-Up," or "Clients" to streamline communication.{' '}
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
              <List.Item> Track leads and prospects efficiently </List.Item>
              <List.Item> Segment customers for targeted broadcasts </List.Item>
              <List.Item> Export contact lists for your CRM </List.Item>
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
              <Title order={3}>For Community Managers</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md">
              {' '}
              Organize members of your groups, clubs, or events. Use labels to
              manage volunteers, attendees, VIPs, or different interest groups.{' '}
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
              <List.Item> Easily categorize group members </List.Item>
              <List.Item> Filter and contact specific segments </List.Item>
              <List.Item> Keep your community organized </List.Item>
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
      title: 'E-Commerce Store',
      description:
        "A boutique owner uses labels to segment customers into 'New Orders,' 'VIPs,' and 'Feedback Requested.' This helps her send targeted follow-ups and promotions, leading to a 20% increase in repeat business.",
      features: ['Contact Segmentation', 'Targeted Outreach'],
    },
    {
      icon: 'tabler:home-cog',
      title: 'Real Estate Agent',
      description:
        "An agent labels contacts by 'Hot Leads,' 'Past Clients,' and 'Rentals.' With one click, she can filter her list to send new property updates, saving hours of manual work.",
      features: ['Lead Management', 'Time-Saving Filters'],
    },
    {
      icon: 'tabler:play-football',
      title: 'Online Coach',
      description:
        "A fitness coach organizes clients into 'Beginner,' 'Advanced,' and 'Meal Plan' groups. This makes it easy to send relevant tips and check in with specific client segments.",
      features: ['Client Organization', 'Personalized Communication'],
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Solves Real-World Problems</Title>
          <Text c="dimmed">
            {' '}
            See how professionals use our tool to organize their communication.{' '}
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
              <b>Local Storage:</b> All your labels and contact data are stored
              directly in your browser. They are never uploaded to our servers.{' '}
            </List.Item>
            <List.Item>
              {' '}
              <b>No Data Access:</b> We never see, save, or have access to your
              contacts or chat history.{' '}
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
      role: 'Sales Manager',
      quote:
        'This tool is a game-changer for my team. We manage all our leads with labels like "Hot," "Warm," and "Cold." The ability to <b>filter our chats instantly</b> has made us so much more efficient. The backup feature gives me peace of mind.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
      name: 'Mike P.',
      role: 'Event Organizer',
      quote:
        'I use it to organize attendees for my workshops. Creating labels for "Paid," "Unpaid," and "VIPs" is a breeze. Being able to <b>export the contact lists to Excel</b> is a massive time-saver for my records.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
      name: 'Alisha C.',
      role: 'Community Manager',
      quote:
        'Finally, a simple CRM for WhatsApp! I manage several community groups, and this lets me tag members by interest. It makes sending targeted messages so easy. The <b>UI is clean and very intuitive</b>.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
      name: 'David G.',
      role: 'Freelancer',
      quote:
        "As a freelancer, keeping track of clients is crucial. I use labels for each project. It's so much better than scrolling through hundreds of chats. <b>Worth every penny for the lifetime license</b>.",
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
        'Pro unlocks the most powerful features for professionals. You get <b>unlimited labels and contacts</b>, which is essential for active users. Plus, you gain access to critical data tools like <b>exporting to CSV/Excel</b> and <b>backing up your entire setup</b>.',
    },
    {
      icon: 'tabler:key',
      question: 'Is this a one-time payment or a subscription?',
      answer:
        'It is a <b>one-time payment</b>. You pay once and get lifetime access to all current and future Pro features. No monthly fees, no subscriptions, ever.',
    },
    {
      icon: 'tabler:shield-check',
      question: 'Is this safe to use for my WhatsApp account?',
      answer:
        'Yes. The extension is designed to be safe and private. All your data is stored locally on your computer. It simply adds an organizational layer on top of the official WhatsApp Web interface.',
    },
    {
      icon: 'tabler:help',
      question: 'Where is my data stored?',
      answer:
        "All your labels and contact associations are stored <b>100% locally in your browser's secure storage</b> on your own computer. Your data is never sent to our servers, ensuring complete privacy and control.",
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
            contact management on WhatsApp.{' '}
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
            <List.Item>Unlimited Label Creation</List.Item>
            <List.Item>Unlimited Contacts Per Label</List.Item>
            <List.Item>Advanced Filtering and Search</List.Item>
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
            <List.Item>Export Contacts to CSV & Excel</List.Item>
            <List.Item>Full Data Backup & Restore</List.Item>
            <List.Item>Priority Customer Support</List.Item>
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
              <Title order={2}>Ready to Supercharge Your Workflow?</Title>
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
