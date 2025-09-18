// src/tabs/landing-page.tsx
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

// --- Section Components --- //
const HeroSection = () => (
  <Center>
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
        Ubah Obrolan Grup WhatsApp Anda Menjadi PDF, Excel & Lainnya.{' '}
      </Title>
      <Text c="dimmed" size="xl">
        {' '}
        Solusi utama untuk mencadangkan dan mengonversi riwayat obrolan grup
        Anda—termasuk foto, video, dan dokumen—menjadi file yang aman dan dapat
        dicari, semuanya diproses secara pribadi di komputer Anda.{' '}
      </Text>
    </Stack>
  </Center>
)

const FeaturesSection = () => {
  const featuresData = [
    {
      icon: 'tabler:database-export',
      title: 'Cadangan Tanpa Batas',
      description:
        'Simpan riwayat lengkap obrolan grup Anda, tidak peduli seberapa besar. Amankan setiap pesan, foto, video, dan dokumen tanpa batasan.',
    },
    {
      icon: 'tabler:files',
      title: 'Berbagai Format Ekspor',
      description:
        'Ubah obrolan Anda menjadi file profesional HTML, PDF, CSV, Excel, JSON, dan TXT untuk keperluan apa pun—baik untuk arsip hukum maupun pribadi.',
    },
    {
      icon: 'tabler:shield-lock',
      title: 'Privasi & Keamanan Terjamin',
      description:
        'Data Anda tidak pernah meninggalkan komputer Anda. Semua proses pencadangan terjadi secara lokal untuk keamanan dan kerahasiaan maksimal.',
    },
    {
      icon: 'tabler:filter',
      title: 'Pemfilteran Canggih',
      description:
        'Temukan pesan yang Anda butuhkan dengan mudah. Saring ekspor Anda berdasarkan rentang tanggal khusus atau beberapa kata kunci untuk menemukan informasi penting.',
    },
    {
      icon: 'tabler:photo-video',
      title: 'Sertakan Semua Media',
      description:
        'Jangan hanya menyimpan teks. Cadangkan setiap foto, video, pesan suara, dan dokumen untuk menciptakan arsip yang lengkap dan hidup.',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Fitur Hebat di Ujung Jari Anda</Title>
          <Text c="dimmed">
            {' '}
            Buka potensi penuh data obrolan grup WhatsApp Anda.{' '}
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

// ADDED: New Case Study section to show practical, result-focused user scenarios.
const CaseStudySection = () => {
  const caseStudies = [
    {
      icon: 'tabler:gavel',
      title: 'Amankan Bukti & Laporan',
      description:
        'Seorang pengacara perlu mengarsipkan percakapan klien dari obrolan grup sebagai bukti. Dengan satu klik, ia mengekspor seluruh riwayat obrolan menjadi PDF yang rapi dan berstempel waktu untuk catatan pengadilan.',
      features: ['Ekspor PDF', 'Filter Tanggal'],
      persona: 'Untuk Profesional Hukum & Bisnis',
    },
    {
      icon: 'tabler:gift',
      title: 'Abadikan Kenangan Keluarga',
      description:
        'Seorang ibu ingin membuat buku kenangan digital dari obrolan grup keluarga selama bertahun-tahun. Ia dengan mudah mencadangkan semua pesan, foto, video, dan pesan suara yang tak ternilai.',
      features: ['Cadangan Media Tanpa Batas'],
      persona: 'Untuk Kenangan Keluarga',
    },
    {
      icon: 'tabler:search',
      title: 'Lacak Proyek dengan Mudah',
      description:
        'Seorang pekerja lepas mencari semua umpan balik dan persetujuan klien dalam obrolan grup yang panjang. Menggunakan filter kata kunci untuk "disetujui", "revisi", dan "faktur", ia menemukan setiap pesan penting dalam hitungan detik dan mengekspornya ke Excel.',
      features: ['Filter Beberapa Kata Kunci', 'Ekspor Excel'],
      persona: 'Untuk Pekerja Lepas & Manajer Proyek',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Dibuat untuk Momen Penting Anda</Title>
          <Text c="dimmed">
            {' '}
            Lihat bagaimana orang menggunakan alat kami untuk menyelesaikan
            masalah di dunia nyata.{' '}
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

const PricingSection = () => (
  <Box mt={80} id="pricing">
    <Center>
      <Stack align="center" ta="center" maw={600}>
        <Title order={2}>Harga sederhana dan transparan</Title>
        <Text c="dimmed">Pilih paket yang sempurna untuk kebutuhan Anda.</Text>
      </Stack>
    </Center>
    <Group justify="center" align="stretch" mt="xl" gap="lg">
      {plans.map((plan, index) => (
        <Paper
          key={index}
          withBorder
          radius={'lg'}
          p={46}
          style={{
            border:
              plan.name === 'Per Day'
                ? '2px solid var(--mantine-color-teal-6)'
                : undefined,
            boxShadow:
              plan.name === 'Per Day'
                ? 'var(--mantine-shadow-lg)'
                : 'var(--mantine-shadow-sm)',
            position: 'relative',
          }}
        >
          {plan.name === 'Per Day' && (
            <Badge
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange' }}
              size="lg"
              style={{
                position: 'absolute',
                top: -15,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              Paling Populer
            </Badge>
          )}
          <Stack justify="space-between" style={{ height: '100%' }}>
            <Box ta="center">
              <Title order={2}>{plan.name}</Title>
              <Text mt={4} size="sm">
                {' '}
                {plan.description}{' '}
              </Text>
            </Box>
            <Box my="lg" ta="center">
              <Box pos="relative">
                <Group gap={8} align={'baseline'} justify="center">
                  <Title order={1} fz={52}>
                    {' '}
                    {plan.price}{' '}
                  </Title>
                  {plan.priceSuffix && (
                    <Text component="span" c="dimmed" fz="xl" fw={500}>
                      {plan.priceSuffix}
                    </Text>
                  )}
                </Group>
              </Box>
            </Box>
            <Divider label="Fitur Utama" labelPosition="center" />
            <Stack gap="sm">
              {plan.features.map((feature, idx) => (
                <Group key={idx} gap="sm" wrap="nowrap" align="flex-start">
                  <ThemeIcon
                    variant="transparent"
                    color={plan.isFree ? 'gray' : 'teal'}
                    size="sm"
                    radius="xl"
                  >
                    {plan.isFree ? (
                      <Icon icon="tabler:circle-check" fontSize={16} />
                    ) : (
                      <Icon
                        icon="tabler:star-filled"
                        fontSize={16}
                        color="orange"
                      />
                    )}
                  </ThemeIcon>
                  <Text size="sm" fw={500}>
                    {feature}
                  </Text>
                </Group>
              ))}
            </Stack>
            <Box mt="xl">
              {plan.isFree ? (
                <Button size="md" variant="default" fullWidth disabled>
                  {' '}
                  Paket Anda Saat Ini{' '}
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
                    Tingkatkan ke Pro{' '}
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>
      ))}
    </Group>
    <Stack gap={4} align="center" mt="lg">
      <Group justify="center" gap={6}>
        <Icon
          icon="tabler:lock"
          fontSize={24}
          color="var(--mantine-color-gray-6)"
        />
        <Text size="md" c="dimmed" fw={500}>
          {' '}
          Pembayaran 100% Aman melalui Lemon Squeezy{' '}
        </Text>
      </Group>
    </Stack>
  </Box>
)

const FeatureComparisonTable = () => (
  <Box mt={80}>
    <Center>
      <Title order={2} ta="center" mb="xl">
        {' '}
        Perbandingan Fitur{' '}
      </Title>
    </Center>
    <Card withBorder radius="lg" p={0}>
      <Table striped highlightOnHover verticalSpacing="md" fz="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="40%">Fitur</Table.Th>
            <Table.Th ta="center">Gratis</Table.Th>
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
          <Title order={2}>Privasi Anda adalah Prioritas Utama Kami</Title>
          <Text c="dimmed" mt="md">
            {' '}
            Kami merancang ekstensi ini dengan pendekatan "mengutamakan
            privasi". Anda memiliki kendali penuh dan total atas data Anda,
            selalu.{' '}
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
              <b>Pemrosesan 100% Lokal:</b> Obrolan dan media Anda diproses
              langsung di komputer Anda.{' '}
            </List.Item>
            <List.Item>
              {' '}
              <b>Tidak Ada Unggahan Data:</b> Kami tidak pernah melihat,
              menyimpan, atau memiliki akses ke percakapan atau file Anda.{' '}
            </List.Item>
            <List.Item>
              {' '}
              <b>Anda yang Mengontrol:</b> File yang Anda ekspor hanya disimpan
              di tempat yang Anda pilih—di perangkat lokal Anda.{' '}
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
      role: 'Pemilik Usaha Kecil',
      quote:
        'Saya terus menunda untuk upgrade. Minggu lalu, ponsel saya mati total. Saya akan <b>sangat menyesal kehilangan semuanya</b> jika saya tidak mencadangkan ribuan obrolan klien dengan versi Pro beberapa hari sebelumnya. Investasi terbaik untuk ketenangan pikiran.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
      name: 'Mike P.',
      role: 'Pekerja Lepas',
      quote:
        'Saya perlu mengekspor riwayat obrolan panjang untuk laporan proyek. Fitur <b>ekspor ke Excel di Pro</b> menghemat waktu saya berjam-jam dari penyalinan manual. Pembelian satu kali yang fantastis, tanpa langganan yang mengganggu!',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
      name: 'Dr. Alisha Chen',
      role: 'Peneliti',
      quote:
        'Untuk studi saya tentang pola komunikasi, <b>ekspor JSON sangat berharga</b>. Ini menyediakan data terstruktur yang bersih dan mudah diurai serta dianalisis. Alat ini sangat kuat untuk tujuan akademis.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
      name: 'David G.',
      role: 'Sejarawan Keluarga',
      quote:
        'Saya ingin membuat kenang-kenangan dari percakapan dengan nenek saya. Kemampuan untuk mencadangkan semuanya, termasuk foto dan pesan suara, dan mengekspornya ke satu <b>PDF yang diformat dengan indah</b>, tak ternilai harganya. Ini adalah kenangan yang sekarang saya miliki selamanya.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
      name: 'Maria Rodriguez',
      role: 'Asisten Hukum',
      quote:
        'Kami memerlukan log obrolan berstempel waktu untuk sebuah kasus hukum. Versi Pro memungkinkan kami untuk memfilter berdasarkan tanggal dan mengekspor catatan yang lengkap dan dapat diverifikasi. Prosesnya <b>sederhana, aman, dan profesional</b>. Sangat direkomendasikan untuk kepatuhan hukum.',
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
      name: 'Tom B.',
      role: 'Pensiunan',
      quote:
        'Saya tidak terlalu paham teknologi, tetapi saya khawatir kehilangan foto keluarga selama bertahun-tahun di WhatsApp. Prosesnya <b>sangat sederhana</b>. Saya mengklik beberapa tombol, dan semuanya disimpan ke komputer saya. Sungguh melegakan!',
    },
  ]
  return (
    <Box mt={80}>
      <Center>
        <Stack align="center" ta="center" maw={600}>
          <Title order={2}>Dipercaya oleh Pengguna Seperti Anda</Title>
          <Text c="dimmed">
            {' '}
            Lihat apa yang dikatakan pelanggan kami yang puas tentang versi Pro.{' '}
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
        <Title order={3}>Jaminan Penuh 'Ketenangan Pikiran' 100% Kami</Title>
        <Text c="dimmed" maw={500}>
          {' '}
          Kami yakin Anda akan menyukai fitur-fitur Pro. Jika Anda tidak 100%
          puas, hubungi kami dalam waktu 7 hari setelah pembelian untuk
          pengembalian dana penuh, tanpa pertanyaan.{' '}
        </Text>
      </Stack>
    </Group>
  </Paper>
)

const FaqSection = () => {
  const faqData = [
    {
      icon: 'tabler:rocket',
      question: 'Apa manfaat utama meng-upgrade ke Pro?',
      answer:
        'Dengan Pro, Anda mendapatkan <b>Perlindungan Total</b> dengan mencadangkan semua pesan dan media tanpa batas. Anda akan membuka <b>Fitur Eksklusif</b> seperti ekspor PDF/Excel dan pemfilteran canggih. Selain itu, Anda menerima <b>Dukungan Prioritas</b>, memastikan tim kami membantu Anda terlebih dahulu.',
    },
    {
      icon: 'tabler:key',
      question: 'Apakah ini pembayaran satu kali atau langganan?',
      answer:
        'Ini adalah <b>pembayaran satu kali</b>. Anda membayar sekali dan mendapatkan akses seumur hidup ke semua fitur Pro saat ini dan di masa depan. Tidak ada biaya bulanan, tidak ada langganan, selamanya.',
    },
    {
      icon: 'tabler:shield-check',
      question: 'Apakah data saya aman?',
      answer:
        'Tentu saja. Keamanan data Anda adalah prioritas utama kami. Ekstensi ini memproses semuanya <b>secara lokal di komputer Anda</b>. Tidak ada data obrolan yang pernah dikirim ke server kami. Anda memiliki kendali 100%.',
    },
    {
      icon: 'tabler:help-octagon',
      question: 'Bagaimana cara mendapatkan kunci lisensi setelah pembelian?',
      answer:
        'Segera setelah pembelian Anda, Anda akan menerima email dari mitra pembayaran kami, <b>Lemon Squeezy</b>, yang berisi kunci lisensi Anda dan instruksi untuk mengaktifkannya.',
    },
  ]
  return (
    <Box mt={80} id="faq">
      <Center>
        <Title order={2} ta="center" mb="xl">
          {' '}
          Pertanyaan yang Sering Diajukan{' '}
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

const ContactUsSection = () => (
  <Box mt={80}>
    <Card withBorder p="xl" shadow="sm" radius="lg">
      <Group>
        <ThemeIcon size="xl" radius="md" variant="light">
          <Icon icon="tabler:mail-filled" fontSize={24} />
        </ThemeIcon>
        <Stack gap={2}>
          <Title order={4}>Masih Punya Pertanyaan?</Title>
          <Text c="dimmed" size="sm">
            {' '}
            Tim kami siap membantu. Hubungi kami untuk pertanyaan apa pun.{' '}
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
        Hak Cipta © {new Date().getFullYear()}. Semua Hak Dilindungi.{' '}
      </Text>
      <Text size="xs" c="dimmed" maw={500}>
        {' '}
        Ini adalah perangkat lunak independen dan tidak berafiliasi dengan,
        disponsori, atau didukung oleh WhatsApp LLC.{' '}
      </Text>
    </Stack>
  </Box>
)

const LandingPage = () => {
  const [notification, setNotification] = useState<{
    city: string
    country: string
  } | null>(null)

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
      <Container size="lg" py="xl">
        <Stack gap={80}>
          <HeroSection />
          <FeaturesSection />
          <FeatureComparisonTable />
          <PricingSection />
          <CaseStudySection />
          <SecuritySection />
          <TestimonialsSection />
          <FaqSection />
          <ContactUsSection />
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
                  Baru saja upgrade ke Pro!{' '}
                </Text>
                <Text size="xs" c="dimmed">
                  {' '}
                  {`Seseorang dari ${notification?.city}, ${notification?.country}`}{' '}
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
