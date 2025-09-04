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
    description: 'For basic chat backup needs.',
    price: '$0',
    placeholderPrice: null,
    link: '#',
    features: [
      'Backup up to 10 messages per chat',
      'Text-only backups',
      'Export to HTML format',
      'Limited to the last 7 days',
    ],
  },
  // ADDED: New daily plan for short-term Pro access.
  {
    name: 'Pro Per Day',
    isFree: false,
    description: 'Ideal for testing.',
    placeholderPrice: '$5',
    price: '$1.99',
    link: 'https://extdotninja.lemonsqueezy.com/buy/your-daily-plan-id', // Note: Replace with your actual daily plan link
    features: [
      'Unlimited Message Backups',
      'Backup All Media Types',
      'Advanced Date & Keyword Filters',
      'Multiple Export Formats',
      'Priority Customer Support',
      'All Future Updates Included',
    ],
  },
  {
    name: 'Pro Lifetime',
    isFree: false,
    description: 'Pay once, access all features forever.',
    placeholderPrice: '$89',
    price: '$39',
    link: 'https://extdotninja.lemonsqueezy.com/buy/7f1401c0-fd00-4898-af64-15a869f9fb12?logo=0',
    features: [
      'Unlimited Message Backups',
      'Backup All Media Types',
      'Advanced Date & Keyword Filters',
      'Multiple Export Formats',
      'Priority Customer Support',
      'All Future Updates Included',
    ],
  },
]

export default plans
