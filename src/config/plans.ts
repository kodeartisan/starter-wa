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
    priceSuffix: null,
    link: '#',
    features: [
      'Export up to 10 members',
      'Export only to CSV',
      'Advanced Filtering & Search',
      'Standard Support',
    ],
  },
  {
    name: 'Lifetime',
    isFree: false,
    description: 'Pay once, access forever, no monthly fees.',
    placeholderPrice: '$89',
    price: '$19',
    priceSuffix: 'one-time',
    link: 'https://extdotninja.lemonsqueezy.com/buy/b37c82a9-5119-4912-b2df-fcc72e3b5ad6?logo=0',
    features: [
      'Export Unlimited members',
      'Export to CSV, Excel, PDF, JSON & vCard',
      'Advanced Filtering & Search',
      'Priority Customer Support',
      'No monthly fees, No subscription',
      'Pay once, access forever',
    ],
  },
]

export default plans
