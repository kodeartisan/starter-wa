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
      'Validate up to 5 numbers at a time',
      'See which numbers are valid/invalid',
      'Adjustable delay settings',
    ],
  },
  {
    name: 'Per Day',
    isFree: false,
    description: 'Ideal for testing.',
    placeholderPrice: null,
    price: '$5',
    priceSuffix: '/Day',
    link: 'https://extdotninja.lemonsqueezy.com/buy/7aebd670-e4f7-40c9-8767-fd30390226ae?logo=0',
    features: [
      'Validate Unlimited Numbers',
      'Import from Excel & CSV Files',
      'Export Results to Excel & CSV',
      'Safe Batch Processing',
      'Priority Customer Support',
    ],
  },
  {
    name: 'Lifetime',
    isFree: false,
    description: 'Pay once, access all features forever.',
    placeholderPrice: '$89',
    price: '$27',
    priceSuffix: 'one-time',
    link: 'https://extdotninja.lemonsqueezy.com/buy/c2a57d45-f96b-42ab-b73d-73847a845fe5?logo=0',
    features: [
      'Validate Unlimited Numbers',
      'Import from Excel & CSV Files',
      'Export Results to Excel & CSV',
      'Safe Batch Processing',
      'Priority Customer Support',
    ],
  },
]

export default plans
