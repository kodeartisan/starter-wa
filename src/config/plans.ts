// src/config/plans.ts

// English: Define a type for plan features to include tooltips.
export interface PlanFeatureItem {
  text: string
  tooltip?: string
}

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
    // MODIFIED: Features are now objects with text and optional tooltips.
    features: [
      'Max 5 Recipients',
      'Max 1 Template',
      'Text message only',
      'Basic Anti-Blocking',
    ],
  },
  {
    name: '1 day passs',
    isFree: false,
    description: 'Ideal for testing.',
    placeholderPrice: '$90',
    price: '$3',
    priceSuffix: '/day',
    link: 'https://extdotninja.lemonsqueezy.com/buy/5a1d5366-1a7b-491e-a4db-a70f084938ca?logo=0',
    // MODIFIED: Features are now objects with text and optional tooltips.
    features: [
      'Unlimited recipients',
      'Import recipients from Excel/CSV',
      'Schedule Broadcasts',
      'Send Images, Videos, Files',
      'Unlimited Templates',
      'Advanced Anti-Blocking',
    ],
  },
  {
    name: 'Lifetime',
    isFree: false,
    description: 'Pay once, access forever, no monthly fees.',
    placeholderPrice: '$90',
    price: '$19',
    priceSuffix: '/one-time',
    link: 'https://extdotninja.lemonsqueezy.com/buy/db222543-5bb5-498c-94b3-63046cd150cf?logo=0&desc=0',
    // MODIFIED: Features are now objects with text and optional tooltips.
    features: [
      'Unlimited recipients',
      'Import recipients from Excel/CSV',
      'Schedule Broadcasts',
      'Send Images, Videos, Files',
      'Unlimited Templates',
      'Advanced Anti-Blocking',
    ],
  },
]

export default plans
