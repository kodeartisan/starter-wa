const plans = [
  {
    name: 'Free',
    description: 'For starters and hobbyists.',
    price: 'Free',
    isFree: true,
    placeholderPrice: null,
    link: '#',
    features: [
      '⚫ Max 5 groups',
      '⚫ Max 1 template',
      '❌ Typing effect',
      '❌ Schedule message',
      '❌ Send Image, Video, File, Location, Poll',
      '⚫ Limited features',
      '⚫ Basic support',
    ],
    tags: [],
  },
  {
    name: 'Lifetime',
    description: 'Pay once, access forever, no monthly fees.',
    placeholderPrice: '$59',
    price: '$39',
    isFree: false,
    link: 'https://extdotninja.lemonsqueezy.com/buy/554f3fc2-a924-496d-9b4e-57e21e55a59a?media=0&logo=0&desc=0&discount=0',
    features: [
      '✅ Unlimited groups',
      '✅ Unlimited templates',
      '✅ Typing effect',
      '✅ Schedule message',
      '✅ Send Image, Video, File, Location, Poll',
      '✅ No monthly fees, No subscription',
      '✅ Pay once, access forever',
    ],
  },
]

export default plans
