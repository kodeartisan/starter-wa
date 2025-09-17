// src/config/plans.ts
// English: Define a structured feature type for the comparison table
export interface PlanFeature {
  feature: string
  free: string | boolean
  pro: string | boolean
}

// English: Centralized list of features for easy management and comparison
export const features: PlanFeature[] = [
  {
    feature: 'Message Backups',
    free: 'Up to 10 messages',
    pro: 'Unlimited',
  },
  {
    feature: 'Backup Media (Images, Videos, Docs)',
    free: false,
    pro: true,
  },
  {
    feature: 'Advanced Date Range Filtering',
    free: 'Last 7 days only',
    pro: true,
  },
  {
    feature: 'Multiple Keyword Filtering',
    free: '1 keyword', // MODIFIED: Changed from `false` to specify the limit.
    pro: 'Unlimited', // MODIFIED: Changed from `true` to be more descriptive.
  },
  {
    feature: 'Export to Multiple Formats',
    free: 'HTML only',
    pro: 'PDF, CSV, Excel, JSON, TXT',
  },
  {
    feature: 'Customer Support',
    free: 'Standard Support',
    pro: 'Priority Support',
  },
]

// English: Define plan objects for the pricing cards.
// This array structure allows for easy side-by-side comparison in the UI.
const plans = [
  {
    name: 'Free',
    isFree: true,
    description: 'For basic needs.',
    price: '$0',
    priceSuffix: null, // <-- priceSuffix ditambahkan di sini
    link: '#',
    features: [
      'Revoke Links',
      'Max 2 Groups',
      'Last 5 Links Generation History',
      'Standard Support',
    ],
  },
  {
    name: 'Per Day',
    isFree: false,
    description: 'Ideal for testing.',
    placeholderPrice: null,
    price: '$5',
    priceSuffix: '/Day',
    link: 'https://extdotninja.lemonsqueezy.com/buy/49bf5c46-9e9b-465b-add0-10bc5903ad69?logo=0',
    features: [
      'Revoke Links',
      'Unlimited Groups',
      'Generate & Download QR Codes ',
      'Export to CSV/Excel',
      'Unlimited Links Generation History',
      'Priority Support',
    ],
  },
  {
    name: 'Lifetime',
    isFree: false,
    description: 'Pay once, access all features forever.',
    placeholderPrice: '$89',
    price: '$27',
    priceSuffix: 'one-time',
    link: 'https://extdotninja.lemonsqueezy.com/buy/4425cfd5-045c-4b39-ad48-35966feca009?logo=0',
    features: [
      'Revoke Links',
      'Multiple Groups',
      'Generate & Download QR Codes ',
      'Export to CSV/Excel',
      'Unlimited Links Generation History',
      'Priority Support',
    ],
  },
]

export default plans
