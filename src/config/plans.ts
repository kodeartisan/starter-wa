// src/config/plans.ts

// Define a more structured feature type for the comparison table
export interface PlanFeature {
  feature: string
  free: string | boolean
  pro: string | boolean
}

// Centralized list of features for easy management and comparison
export const features: PlanFeature[] = [
  {
    feature: 'Backup Message Limit',
    free: 'First 10 per chat',
    pro: true, // Using 'true' represents "Unlimited" or "Included"
  },
  {
    feature: 'Backup Media (Images, Videos, Docs)',
    free: false, // Using 'false' represents "Not Included"
    pro: true,
  },
  {
    feature: 'Advanced Date Range Filtering',
    free: 'Last 7 Days Only',
    pro: true,
  },
  {
    feature: 'Keyword Filtering',
    free: true,
    pro: true,
  },
  {
    feature: 'Export to HTML, TXT, JSON',
    free: true,
    pro: true,
  },
  {
    feature: 'Export to PDF, CSV, Excel (XLSX)',
    free: false,
    pro: true,
  },
  {
    feature: 'Customer Support',
    free: 'Standard Support',
    pro: 'Priority Support',
  },
  {
    feature: 'Future Pro Updates',
    free: false,
    pro: true,
  },
  {
    feature: 'Pricing Model',
    free: 'Completely Free',
    pro: 'One-Time Payment',
  },
]

// Simplified plan definitions
const plans = [
  {
    name: 'Free',
    description: 'For starters and hobbyists.',
    price: 'Free',
    isFree: true,
    placeholderPrice: null,
    link: '#',
    // This feature list is for the pricing card display
    features: [
      'Backup first 10 messages per chat',
      'Basic export formats (HTML, TXT)',
      'Standard support',
    ],
  },
  {
    name: 'Lifetime',
    description: 'Pay once, access forever.',
    placeholderPrice: '$59',
    price: '$39',
    isFree: false,
    link: 'https://extdotninja.lemonsqueezy.com/buy/554f3fc2-a924-496d-9b4e-57e21e55a59a?media=0&logo=0&desc=0&discount=0',
    // This feature list is for the pricing card display
    features: [
      'Unlimited chat & media backups',
      'All export formats (PDF, CSV, Excel)',
      'Priority customer support',
      'All future Pro updates',
      'No subscriptions. Ever.',
    ],
  },
]

export default plans
