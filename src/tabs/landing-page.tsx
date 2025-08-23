import plans, { features as comparisonFeatures } from '@/config/plans'
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

// --- Countdown Timer Logic --- //
// English: Define TimeLeft interface for type safety.
interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// English: Calculate the time remaining until the offer ends.
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

// --- End Countdown Timer Logic --- //

// --- Section Components --- //
const HeroSection = () => (
  <Center p="xl" pt={80}>
    <Stack align="center" gap="xl" ta="center" maw={700}>
      <ThemeIcon
        size={80}
        radius="xl"
        variant="gradient"
        gradient={{ from: 'teal', to: 'lime' }}
      >
        <Icon icon="tabler:message-2-down" fontSize={48} />
      </ThemeIcon>
      <Title order={1} fz={{ base: 36, sm: 48 }}>
        {' '}
        Archive & Export Your WhatsApp Chats into Secure Files.{' '}
      </Title>
      <Text c="dimmed" fz="lg">
        {' '}
        A one-time payment solution to back up and convert your WhatsApp history
        into PDF, Excel, CSV, and more—all processed securely on your own
        computer.{' '}
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
      icon: 'tabler:database-export',
      title: 'Unlimited Backups',
      description:
        'Save everything. Back up unlimited messages, photos, videos, and documents from any chat.',
    },
    {
      icon: 'tabler:files',
      title: 'Multiple Formats',
      description:
        'Convert your chats into professional PDF, CSV, Excel, JSON, and TXT files for any purpose.',
    },
    {
      icon: 'tabler:shield-lock',
      title: 'Private & Secure',
      description:
        'Your data never leaves your computer. All backups are processed and stored locally for maximum security.',
    },
    {
      icon: 'tabler:filter',
      title: 'Advanced Filtering',
      description:
        'Easily find what you need. Filter your exports by custom date ranges or multiple keywords.',
    },
    {
      icon: 'tabler:device-mobile-message',
      title: 'Media Included',
      description:
        'Don’t just save text. The Pro version allows you to include all media types in your backups.',
    },
    {
      icon: 'tabler:headset',
      title: 'Priority Support',
      description:
        'Get help when you need it. Pro users get priority access to our dedicated support team.',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Powerful Features at Your Fingertips</Title>
          <Text c="dimmed">
            {' '}
            Unlock the full potential of your WhatsApp data with the Pro
            version.{' '}
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

// English: New section to address specific user needs.
const UserPersonaSection = () => (
  <Box mt={80}>
    <Center>
      <Stack align="center" ta="center" maw={600}>
        <Title order={2}>Built For Everyone</Title>
        <Text c="dimmed">
          {' '}
          Whether for work or personal memories, we've got you covered.{' '}
        </Text>
      </Stack>
    </Center>
    <Grid mt="xl" gutter="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder radius="lg" p="xl" style={{ height: '100%' }}>
          {/* English: Use a Stack with 100% height to allow the button to be pushed to the bottom. */}
          <Stack style={{ height: '100%' }}>
            <Group>
              <ThemeIcon variant="light" size={40} radius="md">
                <Icon icon="tabler:briefcase" fontSize={22} />
              </ThemeIcon>
              <Title order={3}>For Professionals & Business</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md">
              {' '}
              Effortlessly manage client communications, generate reports, and
              maintain legal records.{' '}
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
                Export client chats to Excel/CSV for reporting.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Backup unlimited project data without risk of loss.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Use keyword filters to find specific agreements or details.{' '}
              </List.Item>
            </List>
            {/* ADDED: Contextual CTA for professionals that links to the pricing section. */}
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
          {/* English: Use a Stack with 100% height to allow the button to be pushed to the bottom. */}
          <Stack style={{ height: '100%' }}>
            <Group>
              <ThemeIcon variant="light" size={40} radius="md">
                <Icon icon="tabler:heart" fontSize={22} />
              </ThemeIcon>
              <Title order={3}>For Personal Use</Title>
            </Group>
            <Text c="dimmed" size="sm" mt="md">
              {' '}
              Securely save precious conversations with loved ones, from family
              chats to special moments.{' '}
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
                Save conversations as a readable PDF, complete with photos.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Backup all your media so you never lose a precious memory.{' '}
              </List.Item>
              <List.Item>
                {' '}
                Keep a permanent, private archive of your most important chats.{' '}
              </List.Item>
            </List>
            {/* ADDED: Contextual CTA for personal users that links to the pricing section. */}
            <Button
              component="a"
              href="#pricing"
              mt="auto"
              variant="light"
              color="teal"
            >
              {' '}
              Secure Your Precious Memories{' '}
            </Button>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  </Box>
)

// ADDED: New Case Study section to show practical, result-focused user scenarios.
const CaseStudySection = () => {
  const caseStudies = [
    {
      icon: 'tabler:gavel',
      title: 'Secure Evidence & Reports',
      description:
        'A lawyer needs to archive client conversations as evidence. With one click, she exports the entire chat history into a clean, time-stamped PDF for court records.',
      features: ['PDF Export', 'Date Filtering'],
      persona: 'For Legal & Business Professionals',
    },
    {
      icon: 'tabler:gift',
      title: 'Preserve Family Memories',
      description:
        'A mother wants to create a digital scrapbook from years of family group chats. She easily backs up all priceless messages, photos, videos, and voice notes.',
      features: ['Unlimited Media Backups'],
      persona: 'For Family Memories',
    },
    {
      icon: 'tabler:search',
      title: 'Track Projects with Ease',
      description:
        "A freelancer searches for all client feedback and approvals in a long chat. Using keyword filters for 'approved,' 'revision,' and 'invoice,' he finds every key message in seconds and exports it to Excel.",
      features: ['Multiple Keyword Filtering', 'Excel Export'],
      persona: 'For Freelancers & Project Managers',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Built for Your Important Moments</Title>
          <Text c="dimmed">
            {' '}
            See how people use our tool to solve real-world problems.{' '}
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
  // ADDED: Added an ID for anchor links from the persona section.
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
              {/* MODIFIED: Wrapped price in a Box with relative positioning to place the savings badge. */}
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
                  {/* MODIFIED: Enhanced trust signals below the purchase button for clarity. */}
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

// ADDED: New section to highlight the "one-time payment" value proposition.
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
              <b>100% Local Processing:</b> Your chats and media are processed
              directly on your computer.{' '}
            </List.Item>
            <List.Item>
              {' '}
              <b>No Data Uploads:</b> We never see, save, or have access to your
              conversations or files.{' '}
            </List.Item>
            <List.Item>
              {' '}
              <b>You Are in Control:</b> Your exported files are saved only
              where you choose—on your local device.{' '}
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
      role: 'Small Business Owner',
      quote:
        'I kept putting off the upgrade. Last week, my phone died completely. I would have <b>deeply regretted losing everything</b> if I hadn’t backed up thousands of client chats with the Pro version a few days prior. The best investment for peace of mind.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
      name: 'Mike P.',
      role: 'Freelancer',
      quote:
        'I needed to export a long chat history for a project report. The <b>Excel export feature in Pro</b> saved me hours of manual copy-pasting. A fantastic one-time purchase, no annoying subscriptions!',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
      name: 'Dr. Alisha Chen',
      role: 'Researcher',
      quote:
        'For my study on communication patterns, the <b>JSON export was invaluable</b>. It provided clean, structured data that was easy to parse and analyze. This tool is surprisingly powerful for academic purposes.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
      name: 'David G.',
      role: 'Family Historian',
      quote:
        'I wanted to create a keepsake of conversations with my grandmother. The ability to back up everything, including photos and voice notes, and export it to a single <b>beautifully formatted PDF</b>, is priceless. These are memories I now have forever.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
      name: 'Maria Rodriguez',
      role: 'Legal Assistant',
      quote:
        'We required timestamped chat logs for a legal case. The Pro version allowed us to filter by date and export a complete, verifiable record. It was <b>straightforward, secure, and professional</b>. Highly recommended for legal compliance.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
      name: 'Tom B.',
      role: 'Retiree',
      quote:
        "I'm not very tech-savvy, but I was worried about losing years of family photos on WhatsApp. The process was <b>incredibly simple</b>. I clicked a few buttons, and everything was saved to my computer. A huge relief!",
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
                {/* ADDED: 5-star rating for immediate social proof. */}
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

// MODIFIED: Guarantee section redesigned to be more visually convincing.
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
        "With Pro, you get <b>Total Protection</b> by backing up all messages and media without limits. You'll unlock <b>Exclusive Features</b> like PDF/Excel exports and advanced filtering. Plus, you receive <b>Priority Support</b>, ensuring our team assists you first.",
    },
    {
      icon: 'tabler:key',
      question: 'Is this a one-time payment or a subscription?',
      answer:
        'It is a <b>one-time payment</b>. You pay once and get lifetime access to all current and future Pro features. No monthly fees, no subscriptions, ever.',
    },
    {
      icon: 'tabler:shield-check',
      question: 'Is my data secure?',
      answer:
        'Absolutely. Your data security is our top priority. The extension processes everything <b>locally on your computer</b>. No chat data is ever sent to our servers. You have 100% control.',
    },
    {
      icon: 'tabler:help-octagon',
      question: 'How do I get my license key after purchase?',
      answer:
        'Immediately after your purchase, you will receive an email from our payment partner, <b>Lemon Squeezy</b>, containing your license key and instructions to activate it.',
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
            Your Pro Lifetime License is a complete package for total peace of
            mind.{' '}
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
            <List.Item>Unlimited Message & Media Backups</List.Item>
            <List.Item>Export to All Formats (PDF, Excel, etc.)</List.Item>
            <List.Item>Advanced Date & Keyword Filtering</List.Item>
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
            <List.Item>Priority Customer Support</List.Item>
            <List.Item>All Future Updates Included</List.Item>
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

// ADDED: A simple, clean footer for copyright and disclaimers.
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

// MODIFIED: Sticky header CTA optimized for conversion.
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
              {/* MODIFIED: Button text is more specific and value-oriented. */}
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

// English: Get the offer end date from local storage, or create a new one if it doesn't exist or is in the past.
const getOfferEndDate = (): Date => {
  const storedEndDate = localStorage.getItem('offerEndDate')

  // English: If a valid end date is stored, use it.
  if (storedEndDate && new Date(storedEndDate) > new Date()) {
    return new Date(storedEndDate)
  }

  // English: Otherwise, create a new end date 3 days from now and store it.
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
  // English: Get the persistent offer end date. It will be created and stored on the first visit.
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
              <Title order={2}>Ready to Secure Your Chats?</Title>
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
          {/* ADDED: Footer component at the end of the page content. */}
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
