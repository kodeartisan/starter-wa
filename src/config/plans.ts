// src/config/plans.ts

// MODIFIED: Updated plan features to be more benefit-driven and added priority support.
const plans = [
  {
    name: 'Free',
    description: 'For starters and hobbyists.',
    price: 'Free',
    isFree: true,
    placeholderPrice: null,
    link: '#',
    features: ['⚫ Basic support', '⚫ Backup first 10 messages per chat'],
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
      '✅ Unlimited chat & media backups.',
      '✅ Priority customer support.',
      '✅ No monthly fees, no subscriptions. Ever.',
    ],
  },
]

export default plans
