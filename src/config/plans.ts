// src/config/plans.ts

// MODIFIED: Updated plan features to be more benefit-driven and structured for icon-based rendering.
const plans = [
  {
    name: 'Free',
    description: 'For starters and hobbyists.',
    price: 'Free',
    isFree: true,
    placeholderPrice: null,
    link: '#',
    features: [
      { text: 'Basic support', isProFeature: false },
      { text: 'Backup first 10 messages per chat', isProFeature: false },
      { text: 'Unlimited chat & media backups', isProFeature: true },
      { text: 'Priority customer support', isProFeature: true },
      { text: 'No monthly fees, no subscriptions. Ever.', isProFeature: true },
    ],
    tags: [],
  },
  {
    name: 'Lifetime',
    description: 'Pay once, access forever.',
    placeholderPrice: '$59',
    price: '$39',
    isFree: false,
    link: 'https://extdotninja.lemonsqueezy.com/buy/554f3fc2-a924-496d-9b4e-57e21e55a59a?media=0&logo=0&desc=0&discount=0',
    features: [
      { text: 'Basic support', isProFeature: false },
      { text: 'Backup first 10 messages per chat', isProFeature: false },
      { text: 'Unlimited chat & media backups', isProFeature: true },
      { text: 'Priority customer support', isProFeature: true },
      { text: 'No monthly fees, no subscriptions. Ever.', isProFeature: true },
    ],
  },
]

export default plans
