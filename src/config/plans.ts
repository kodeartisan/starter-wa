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
      {
        text: 'Max 5 Recipients',
        tooltip: 'Send a broadcast to a maximum of 5 contacts at a time.',
      },
      {
        text: 'Max 1 Template',
        tooltip: 'Save one message template for quick reuse.',
      },
      {
        text: 'Text message only',
        tooltip: 'Only text-based messages can be sent.',
      },
      {
        text: 'Basic Anti-Blocking',
        tooltip: 'Includes a simple message delay to reduce risk.',
      },
    ],
  },
  {
    name: 'Lifetime',
    isFree: false,
    description: 'Pay once, access forever, no monthly fees.',
    placeholderPrice: '$90',
    price: '$19',
    priceSuffix: 'one-time',
    link: 'https://extdotninja.lemonsqueezy.com/buy/db222543-5bb5-498c-94b3-63046cd150cf?logo=0&desc=0',
    // MODIFIED: Features are now objects with text and optional tooltips.
    features: [
      {
        text: 'Unlimited recipients',
        tooltip:
          'Send broadcasts to as many contacts as you need with no limitations.',
      },
      {
        text: 'Import recipients from Excel/CSV',
        tooltip: 'Quickly import your contact lists from Excel or CSV files.',
      },
      {
        text: 'Schedule Broadcasts',
        tooltip:
          'Plan your campaigns in advance by scheduling messages for a future date and time.',
      },
      {
        text: 'Send All Media Types (Images, Videos, Files)',
        tooltip:
          'Engage your audience by sending images, videos, and documents.',
      },
      {
        text: 'Save Unlimited Message Templates',
        tooltip:
          'Create and save an endless number of message templates to streamline your workflow.',
      },
      {
        text: 'Advanced Anti-Blocking',
        tooltip:
          'Protect your account with features like batch sending, smart pauses during non-working hours, and warm-up mode.',
      },
      {
        text: 'Export result to Excel/CSV',
        tooltip:
          'Download detailed reports of your broadcast campaigns for analysis.',
      },
    ],
  },
]

export default plans
