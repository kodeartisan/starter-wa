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
    description: 'For basic direct messaging needs.',
    price: '$0',
    priceSuffix: null, // <-- priceSuffix ditambahkan di sini
    link: '#',
    features: [
      'Post text-only statuses',
      'Save up to 3 drafts',
      'Manual posting only',
    ],
  },
  {
    name: 'Lifetime',
    isFree: false,
    description: 'Pay once, access all features forever.',
    placeholderPrice: '$89',
    price: '$29',
    priceSuffix: 'one-time',
    link: 'https://extdotninja.lemonsqueezy.com/buy/07900b2b-ed92-4714-b111-51f07d221c0c?logo=0',
    features: [
      'Schedule Unlimited Statuses',
      'Post Text, Images & Videos',
      'Fully Automated Posting',
      'Full Management Dashboard',
      'Priority Customer Support',
    ],
  },
]

export default plans
