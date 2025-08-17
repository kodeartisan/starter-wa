// src/tabs/landing-page.tsx
import plans, { features as comparisonFeatures } from '@/config/plans'
import theme from '@/libs/theme'
import {
  Accordion,
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
  Image,
  MantineProvider,
  Paper,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import '@mantine/core/styles.css'
import {
  IconArrowRight,
  IconBriefcase,
  IconCertificate,
  IconCheck,
  IconCircleCheck,
  IconClockHour4,
  IconCrown,
  IconHelpOctagon,
  IconHomeHeart,
  IconKey,
  IconLock,
  IconMessageCircle,
  IconRocket,
  IconSchool,
  IconShieldCheck,
  IconShieldLock,
  IconSparkles,
  IconStar,
  IconThumbUp,
  IconUser,
  IconUsersGroup,
  IconWorldQuestion,
  IconX,
} from '@tabler/icons-react'
// ADDED: Imported useState and useEffect for the countdown timer functionality.
import React, { useEffect, useState } from 'react'
import { When } from 'react-if'

// Helper component for checkmark icons
const CheckIcon = () => (
  <IconCheck size={20} stroke={2.5} color="var(--mantine-color-teal-6)" />
)
const CrossIcon = () => (
  <IconX size={20} stroke={2.5} color="var(--mantine-color-red-6)" />
)

// --- Section Components --- //

// 1. Hero Section: Headline and Sub-headline
const HeroSection = () => (
  <Center p="xl">
    <Stack align="center" gap="xl" ta="center" maw={700}>
      <Badge
        variant="light"
        color="teal"
        size="lg"
        leftSection={<IconSparkles size={16} />}
      >
        {' '}
        Unlock The Full Power{' '}
      </Badge>
      <ThemeIcon
        size={80}
        radius="xl"
        variant="gradient"
        gradient={{ from: 'teal', to: 'lime' }}
      >
        <IconShieldLock size={48} />
      </ThemeIcon>
      <Title order={1} fz={{ base: 36, sm: 48 }}>
        {' '}
        Never Lose a WhatsApp Memory Again{' '}
      </Title>
      <Text c="dimmed" fz="lg">
        {' '}
        Upgrade to Pro to get unlimited backups of all your chats and media.
        Secure your conversations, export in any format, and enjoy peace of mind
        with a simple one-time payment.{' '}
      </Text>
    </Stack>
  </Center>
)
const SocialProofSection = () => (
  <Center>
    <Paper withBorder p="md" radius="lg" shadow="sm">
      <Group>
        <Stack align="center" gap={4}>
          <Group gap="xs">
            <IconStar
              color="var(--mantine-color-yellow-6)"
              fill="var(--mantine-color-yellow-6)"
            />
            <Text fw={700} fz="lg">
              {' '}
              4.9 / 5.0{' '}
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            {' '}
            Rating on Web Store{' '}
          </Text>
        </Stack>
        <Divider orientation="vertical" />
        <Stack align="center" gap={4}>
          <Group gap="xs">
            <IconUsersGroup color="var(--mantine-color-teal-6)" />
            <Text fw={700} fz="lg">
              {' '}
              10,000+{' '}
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            {' '}
            Happy Users Worldwide{' '}
          </Text>
        </Stack>
      </Group>
    </Paper>
  </Center>
)

// 2. Pricing Section
const PricingSection = () => (
  <Group justify="center" align="stretch" mt="xl">
    {plans.map((plan, index) => (
      <Card
        key={index}
        withBorder
        w={{ base: '100%', sm: 380 }}
        radius={'lg'}
        p="lg"
        style={{
          border: !plan.isFree
            ? '2px solid var(--mantine-color-teal-6)'
            : undefined,
          boxShadow: !plan.isFree
            ? 'var(--mantine-shadow-lg)'
            : 'var(--mantine-shadow-sm)',
        }}
      >
        <Stack justify="space-between" style={{ height: '100%' }}>
          {/* Card Header */}
          <Box>
            <Group justify="space-between">
              <Title order={3}>{plan.name}</Title>
              {!plan.isFree && (
                <Badge color="blue" variant="light" size="sm">
                  {' '}
                  ONE-TIME PAYMENT{' '}
                </Badge>
              )}
            </Group>
            <Text c="dimmed" mt={4}>
              {' '}
              {plan.description}{' '}
            </Text>
          </Box>
          {/* Price */}
          <Box my="lg">
            <Group gap={8} align={'baseline'}>
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
              <Title order={1} fz={48}>
                {' '}
                {plan.price}{' '}
              </Title>
              {!plan.isFree && (
                <Text c="dimmed" fz="xl" fw={500} pb={5}>
                  {' '}
                  / Lifetime{' '}
                </Text>
              )}
            </Group>
            {/* MODIFIED: Removed urgency elements. The pricing card now focuses only on the price. */}
            {!plan.isFree && (
              <Text c="dimmed" size="sm" mt="xs">
                One-time payment. No hidden fees.
              </Text>
            )}
          </Box>
          {/* Features List */}
          <Stack gap="sm" mb="lg">
            {plan.features.map((feature, idx) => (
              <Group key={idx} gap="sm" wrap="nowrap" align="flex-start">
                <IconCircleCheck
                  color={'var(--mantine-color-teal-6)'}
                  size={20}
                  style={{ minWidth: 20, marginTop: 3 }}
                />
                <Text size="sm">{feature}</Text>
              </Group>
            ))}
          </Stack>
          {/* Action Button */}
          <Box mt="auto">
            {plan.isFree ? (
              <Button size="md" variant="default" fullWidth disabled>
                {' '}
                Your Current Plan{' '}
              </Button>
            ) : (
              <Stack gap="xs">
                <Button
                  size="md"
                  component="a"
                  href={plan.link}
                  target="_blank"
                  fullWidth
                  leftSection={<IconCrown size={18} />}
                >
                  {' '}
                  Upgrade to Pro{' '}
                </Button>
                <Group justify="center" gap={6}>
                  <IconLock size={14} color="var(--mantine-color-gray-6)" />
                  <Text size="xs" c="dimmed">
                    {' '}
                    Secure Transaction via Lemon Squeezy{' '}
                  </Text>
                </Group>
              </Stack>
            )}
          </Box>
        </Stack>
      </Card>
    ))}
  </Group>
)

// ADDED: A new, separate section dedicated to creating urgency.
const LimitedOfferSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  // This state holds the number of licenses available at the discount price.
  const [licensesLeft] = useState(75) // Static value for demonstration purposes.

  useEffect(() => {
    // Set a fixed expiration date for the offer, for example, 3 days from the moment the user loads the page.
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 3)

    // Set up an interval to update the countdown every second.
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = expirationDate.getTime() - now

      // If the countdown is over, clear the interval and set time to zero.
      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        // Calculate remaining days, hours, minutes, and seconds.
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    // Cleanup function to clear the interval when the component is unmounted, preventing memory leaks.
    return () => clearInterval(timer)
  }, [])

  return (
    <Box>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Grab The Lifetime Deal!</Title>
          <Text c="dimmed">
            This special launch price is for a limited time only. Once the timer
            hits zero, the price will go up forever.
          </Text>
        </Stack>
      </Center>
      <Group justify="center" mt="lg">
        <Paper
          withBorder
          p="lg"
          radius="md"
          shadow="sm"
          w={{ base: '100%', sm: 400 }}
        >
          <Stack gap="xs" align="center">
            <Group gap="xs">
              <IconClockHour4 size={24} color="var(--mantine-color-orange-9)" />
              <Text c="orange.9" fw={700} size="lg">
                Offer Ends In:
              </Text>
            </Group>
            <Text
              c="orange.9"
              fz={32}
              fw={700}
              style={{ fontFamily: 'monospace' }}
            >
              {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
            </Text>
            <Badge color="red" variant="filled" size="lg" mt="sm">
              {`Only ${licensesLeft} licenses left at this price!`}
            </Badge>
          </Stack>
        </Paper>
      </Group>
    </Box>
  )
}

const PersonasSection = () => {
  const personas = [
    {
      icon: IconBriefcase,
      title: 'For Small Business Owners',
      description:
        'Secure all client conversations and transaction evidence without limits. Never risk losing critical business data.',
    },
    {
      icon: IconSchool,
      title: 'For Students',
      description:
        'Never lose important lecture notes or group project discussions shared on WhatsApp. Keep your academic work safe.',
    },
    {
      icon: IconHomeHeart,
      title: 'For Family Memories',
      description:
        "Save every precious photo, video, and message from your loved ones forever. Protect your family's digital history.",
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Perfect For Every Aspect of Your Life</Title>
          <Text c="dimmed">
            {' '}
            Whether for work, study, or personal memories, Pro has you covered.{' '}
          </Text>
        </Stack>
      </Center>
      <Grid mt="xl">
        {personas.map((persona) => (
          <Grid.Col span={{ base: 12, md: 4 }} key={persona.title}>
            <Card withBorder radius="lg" p="xl" style={{ height: '100%' }}>
              <Stack align="center" ta="center">
                <ThemeIcon size={50} radius="xl" variant="light" color="teal">
                  <persona.icon size={24} />
                </ThemeIcon>
                <Text fw={700} fz="lg" mt="md">
                  {' '}
                  {persona.title}{' '}
                </Text>
                <Text c="dimmed" size="sm">
                  {' '}
                  {persona.description}{' '}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  )
}

// 3. Feature Comparison Table
const FeatureComparisonTable = () => (
  <Box mt={80}>
    <Center>
      <Title order={2} ta="center" mb="xl">
        {' '}
        Feature Comparison: Free vs. Pro{' '}
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
            <Table.Tr key={item.feature}>
              <Table.Td fw={500}>{item.feature}</Table.Td>
              <Table.Td ta="center">
                {' '}
                {typeof item.free === 'boolean' ? (
                  item.free ? (
                    <CheckIcon />
                  ) : (
                    <CrossIcon />
                  )
                ) : (
                  <Text size="sm">{item.free}</Text>
                )}{' '}
              </Table.Td>
              <Table.Td ta="center">
                {' '}
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
                )}{' '}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  </Box>
)
const testimonialsData = [
  {
    name: 'Sarah L.',
    role: 'Small Business Owner',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    quote:
      'This tool is a lifesaver! I was terrified of losing years of client conversations. The Pro version let me <b>back up everything in minutes</b>. The peace of mind is priceless.',
  },
  {
    name: 'Mike P.',
    role: 'Freelancer',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    quote:
      'I needed to export a long chat history for a project report. The <b>Excel export feature in Pro</b> saved me hours of manual copy-pasting. A fantastic one-time purchase, no annoying subscriptions!',
  },
  {
    name: 'Jessica T.',
    role: 'University Student',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    quote:
      "I accidentally deleted a whole chat with important study notes. Thanks to my backup, I recovered everything. I recommend the <b>Lifetime plan to all my friends</b>. It's a must-have.",
  },
]
const TestimonialsSection = () => (
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
    <Grid mt="xl">
      {testimonialsData.map((testimonial) => (
        <Grid.Col span={{ base: 12, md: 4 }} key={testimonial.name}>
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
// 5. Guarantee Section
const GuaranteeSection = () => (
  <Paper bg="teal.0" radius="lg" p="xl" mt={80}>
    <Group justify="center" align="center">
      <ThemeIcon variant="light" color="teal" size={60} radius="xl">
        <IconCertificate size={32} />
      </ThemeIcon>
      <Stack gap={0} ta={{ base: 'center', sm: 'left' }}>
        <Title order={3}>100% Satisfaction Guarantee or Your Money Back</Title>
        <Text c="dimmed" maw={500}>
          {' '}
          We're confident you'll love the Pro features. If you're not 100%
          satisfied for any reason, contact us within 30 days of your purchase
          for a full, no-questions-asked refund.{' '}
        </Text>
      </Stack>
    </Group>
  </Paper>
)
const faqData = [
  {
    icon: IconRocket,
    question: 'What are the main benefits of upgrading to Pro?',
    answer:
      "With Pro, you get <b>Total Protection</b> by backing up all messages and media without limits. You'll unlock <b>Exclusive Features</b> like PDF/Excel exports and advanced filtering. Plus, you receive <b>Priority Support</b>, ensuring our team assists you first.",
  },
  {
    icon: IconKey,
    question: 'Is this a one-time payment or a subscription?',
    answer:
      'It is a <b>one-time payment</b>. You pay once and get lifetime access to all current and future Pro features. No monthly fees, no subscriptions, ever.',
  },
  {
    icon: IconShieldCheck,
    question: 'Is my data secure?',
    answer:
      'Absolutely. Your data security is our top priority. The extension processes everything <b>locally on your computer</b>. No chat data is ever sent to our servers. You have 100% control.',
  },
  {
    icon: IconHelpOctagon,
    question: 'How do I get my license key after purchase?',
    answer:
      'Immediately after your purchase, you will receive an email from our payment partner, <b>Lemon Squeezy</b>, containing your license key and instructions to activate it.',
  },
  {
    icon: IconCircleCheck,
    question: 'What if I change computers? Will I lose my license?',
    answer:
      "Not at all. Your license is yours forever. You can easily <b>deactivate the license</b> on your old device from the Profile menu and then <b>reactivate it on your new computer</b>. It's flexible and designed to move with you.",
  },
]
const FaqSection = () => (
  <Box mt={80}>
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
                <item.icon size={22} />
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
// 7. Data Privacy Section
const PrivacySection = () => (
  <Card withBorder radius="lg" p="xl" mt={80} shadow="sm">
    <Group wrap="nowrap" gap="xl">
      <ThemeIcon color="teal" size={60} radius="xl" variant="light">
        <IconShieldCheck size={32} />
      </ThemeIcon>
      <div>
        <Title order={3}>Your Privacy is Guaranteed</Title>
        <Text mt={4} c="dimmed">
          {' '}
          We take your privacy seriously. All your data, including chats and
          media, is processed and stored exclusively on your own computer.
          Nothing is ever uploaded to our servers. You maintain 100% control and
          ownership of your data at all times.{' '}
        </Text>
      </div>
    </Group>
  </Card>
)
// 8. After Purchase Section
const AfterPurchaseSection = () => {
  const steps = [
    {
      icon: IconLock,
      title: '1. Secure Payment',
      description:
        'Complete your purchase through our secure payment partner, Lemon Squeezy.',
    },
    {
      icon: IconKey,
      title: '2. Get Your Key',
      description:
        'Check your email for your unique lifetime license key, delivered instantly.',
    },
    {
      icon: IconRocket,
      title: '3. Activate & Enjoy',
      description:
        'Open the extension, enter your key, and immediately unlock all Pro features!',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Title order={2} ta="center" mb="xl">
          {' '}
          What Happens After You Buy?{' '}
        </Title>
      </Center>
      <Grid>
        {steps.map((step, index) => (
          <Grid.Col span={{ base: 12, sm: 4 }} key={step.title}>
            <Stack align="center" ta="center">
              <ThemeIcon size={50} radius="xl" variant="light">
                <step.icon size={24} />
              </ThemeIcon>
              <Text fw={700} fz="lg">
                {' '}
                {step.title}{' '}
              </Text>
              <Text c="dimmed" size="sm">
                {' '}
                {step.description}{' '}
              </Text>
            </Stack>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  )
}

// --- Main Page Component ---
const LandingPage = () => {
  return (
    <MantineProvider theme={theme}>
      <Container size="md" py="xl">
        <Stack gap={80}>
          <HeroSection />
          <SocialProofSection />
          <PricingSection />
          {/* ADDED: The new section for the countdown timer and scarcity message. */}
          <LimitedOfferSection />
          <PersonasSection />
          <FeatureComparisonTable />
          <TestimonialsSection />
          <GuaranteeSection />
          <FaqSection />
          <PrivacySection />
          <AfterPurchaseSection />
          {/* Final CTA */}
          <Center mt={40}>
            <Stack align="center" gap="lg">
              <Title order={2}>Ready to Secure Your Chats?</Title>
              <Button
                size="lg"
                component="a"
                href={plans.find((p) => !p.isFree)?.link}
                target="_blank"
                leftSection={<IconCrown size={20} />}
              >
                {' '}
                Get Lifetime Access Now{' '}
              </Button>
            </Stack>
          </Center>
        </Stack>
      </Container>
    </MantineProvider>
  )
}
export default LandingPage
