// src/config/plans.ts

const plans = [
  {
    name: 'Free',
    description: 'For starters and hobbyists.',
    price: 'Free',
    isFree: true,
    placeholderPrice: null,
    link: '#',
    features: ['⚫ Basic support'],
    tags: [],
  },
  {
    name: 'Lifetime',
    description: 'A one-time investment for permanent peace of mind.',
    placeholderPrice: '$59',
    price: '$39',
    isFree: false,
    link: 'https://extdotninja.lemonsqueezy.com/buy/554f3fc2-a924-496d-9b4e-57e21e55a59a?media=0&logo=0&desc=0&discount=0',
    features: [
      '✅ No monthly fees, No subscription',
      '✅ Pay once, secure your chats forever', // MODIFIED: More benefit-oriented feature text.
    ],
  },
]

export default plans
