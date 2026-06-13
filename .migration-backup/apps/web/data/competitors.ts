export interface Competitor {
  id: string
  name: string
  slug: string
  themeColor: string
  heroHeadline: string
  heroSubheadline: string
  table: {
    cleanbounce: {
      speed: string
      inbound: string
      predictive: string
      accuracy: string
      pricing: string
    }
    competitor: {
      speed: string
      inbound: string
      predictive: string
      accuracy: string
      pricing: string
    }
  }
  reasons: {
    title: string
    description: string
    icon: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
}

export const COMPETITORS: Record<string, Competitor> = {
  zerobounce: {
    id: 'zerobounce',
    name: 'ZeroBounce',
    slug: 'zerobounce',
    themeColor: 'emerald',
    heroHeadline: 'The Modern ZeroBounce Alternative',
    heroSubheadline: 'ZeroBounce built their platform for a different era of email. Switch to CleanBounce to get real-time form protection, predictive email intelligence, and a flat-rate pricing model that scales with you.',
    table: {
      cleanbounce: {
        speed: '< 85ms (Edge optimized)',
        inbound: 'Yes (LeadShield™)',
        predictive: 'Yes (Bounce Forecaster)',
        accuracy: '99.5% (Deep SMTP Analysis)',
        pricing: 'Flat-rate, unexpiring credits'
      },
      competitor: {
        speed: '1-3 seconds avg',
        inbound: 'API only (Requires custom build)',
        predictive: 'No',
        accuracy: 'Varies on B2B domains',
        pricing: 'Complex tiered credits'
      }
    },
    reasons: [
      {
        title: 'Zero Friction Inbound Protection',
        description: 'ZeroBounce forces you to write custom code to protect your forms. CleanBounce LeadShield™ protects forms instantly with zero code, blocking disposables and bots in real-time.',
        icon: '🛡️'
      },
      {
        title: 'Predictive, Not Just Reactive',
        description: 'ZeroBounce tells you if an email is valid right now. CleanBounce Email Intelligence predicts if your domain reputation will cause that email to bounce tomorrow.',
        icon: '🔮'
      },
      {
        title: 'Built for B2B and SaaS',
        description: 'We prioritize deep SMTP handshakes for catch-all domains and corporate firewalls, ensuring higher accuracy on B2B lists where legacy tools return "unknown".',
        icon: '🏢'
      }
    ],
    faqs: [
      {
        question: 'How easy is it to switch from ZeroBounce?',
        answer: 'Incredibly easy. Our API is largely compatible in structure. For list cleaning, just drag and drop your CSV. For form protection, drop our LeadShield JS snippet on your site.'
      },
      {
        question: 'Do CleanBounce credits expire like ZeroBounce?',
        answer: 'No. When you buy pay-as-you-go credits on CleanBounce, they never expire. You use them when you need them.'
      }
    ]
  },
  neverbounce: {
    id: 'neverbounce',
    name: 'NeverBounce',
    slug: 'neverbounce',
    themeColor: 'blue',
    heroHeadline: 'The Faster NeverBounce Alternative',
    heroSubheadline: 'Stop waiting hours for list verification. CleanBounce delivers 10x faster verification speeds, higher B2B accuracy, and real-time form protection built right in.',
    table: {
      cleanbounce: {
        speed: '< 85ms (Edge optimized)',
        inbound: 'Yes (LeadShield™)',
        predictive: 'Yes (Bounce Forecaster)',
        accuracy: '99.5% (Deep SMTP Analysis)',
        pricing: 'Transparent flat-rate'
      },
      competitor: {
        speed: 'Slower API response',
        inbound: 'Limited Javascript widget',
        predictive: 'No',
        accuracy: 'High "Unknown" rate on B2B',
        pricing: 'Monthly sync subscriptions'
      }
    },
    reasons: [
      {
        title: 'Solve the "Unknown" Problem',
        description: 'NeverBounce struggles with corporate catch-all domains, often returning "unknown". CleanBounce uses advanced mailbox pinging to resolve 80% more B2B catch-all addresses.',
        icon: '🎯'
      },
      {
        title: 'Sub-100ms API Speeds',
        description: 'Built on edge infrastructure, the CleanBounce API verifies emails in under 85ms, ensuring your user signup flow is never interrupted or delayed.',
        icon: '⚡'
      },
      {
        title: 'Predictive Deliverability',
        description: 'Verifying the email is only half the battle. CleanBounce includes domain health monitoring and bounce forecasting to ensure you actually hit the inbox.',
        icon: '📈'
      }
    ],
    faqs: [
      {
        question: 'Can CleanBounce handle large list uploads?',
        answer: 'Yes, our bulk processing engine can handle millions of rows simultaneously, and usually completes 10x faster than legacy competitors.'
      },
      {
        question: 'Does CleanBounce integrate with HubSpot?',
        answer: 'Yes, we offer native integrations with HubSpot, Salesforce, Marketo, and 50+ other CRMs to automatically keep your database clean.'
      }
    ]
  },
  clearout: {
    id: 'clearout',
    name: 'Clearout',
    slug: 'clearout',
    themeColor: 'indigo',
    heroHeadline: 'The Complete Clearout Alternative',
    heroSubheadline: 'Move beyond basic list cleaning. CleanBounce offers a holistic email protection suite: stopping bad leads at the form, cleaning old databases, and predicting outbound success.',
    table: {
      cleanbounce: {
        speed: '< 85ms (Edge optimized)',
        inbound: 'Yes (LeadShield™)',
        predictive: 'Yes (Bounce Forecaster)',
        accuracy: '99.5% (Deep SMTP Analysis)',
        pricing: 'Flat-rate credits'
      },
      competitor: {
        speed: 'Average',
        inbound: 'Basic JS widget',
        predictive: 'No',
        accuracy: 'Standard',
        pricing: 'Tiered credits'
      }
    },
    reasons: [
      {
        title: 'Holistic Email Protection',
        description: 'Clearout is just a cleaning tool. CleanBounce is an entire protection platform, featuring LeadShield for inbound forms and Email Intelligence for outbound campaigns.',
        icon: '🛡️'
      },
      {
        title: 'Bot & Script Blocking',
        description: 'LeadShield goes beyond just checking if an email is real. It fingerprints the user behavior to block headless browsers and automation scripts.',
        icon: '🤖'
      },
      {
        title: 'Modern API Experience',
        description: 'Developers love CleanBounce. Our API is documented clearly, uses standard REST patterns, and features webhooks for bulk job completions.',
        icon: '💻'
      }
    ],
    faqs: [
      {
        question: 'How does LeadShield differ from Clearout\'s JS widget?',
        answer: 'LeadShield is a complete behavioral firewall. It doesn\'t just check the email string; it analyzes the visitor for bot signatures and checks the domain against 150k+ disposable providers instantly.'
      },
      {
        question: 'Is CleanBounce GDPR compliant?',
        answer: 'Yes. We are strictly GDPR and SOC2 compliant. Data is processed in memory and encrypted at rest.'
      }
    ]
  },
  bouncer: {
    id: 'bouncer',
    name: 'Bouncer',
    slug: 'bouncer',
    themeColor: 'purple',
    heroHeadline: 'The Enterprise Bouncer Alternative',
    heroSubheadline: 'Scale your email operations with confidence. CleanBounce provides the predictive intelligence and edge-network speed that high-volume senders demand.',
    table: {
      cleanbounce: {
        speed: '< 85ms (Edge optimized)',
        inbound: 'Yes (LeadShield™)',
        predictive: 'Yes (Bounce Forecaster)',
        accuracy: '99.5% (Deep SMTP Analysis)',
        pricing: 'Transparent flat-rate'
      },
      competitor: {
        speed: 'Average',
        inbound: 'API only',
        predictive: 'No',
        accuracy: 'High',
        pricing: 'Tiered monthly'
      }
    },
    reasons: [
      {
        title: 'Predictive Insights',
        description: 'Bouncer confirms if an inbox exists. CleanBounce predicts if your specific sending domain and IP will actually be allowed to deliver to it.',
        icon: '🔮'
      },
      {
        title: 'No Monthly Lock-in',
        description: 'Stop paying for subscriptions you don\'t fully utilize. CleanBounce offers unexpiring, pay-as-you-go credits that scale exactly with your usage.',
        icon: '💳'
      },
      {
        title: 'Global Edge Network',
        description: 'Our verification nodes are distributed globally on the edge, meaning a user in Tokyo gets their form verified just as fast as a user in New York.',
        icon: '🌍'
      }
    ],
    faqs: [
      {
        question: 'Why is CleanBounce better for outbound sales?',
        answer: 'Because of Email Intelligence. We actively monitor your outbound domains for blacklist exposure and DMARC alignment, alerting you before you burn a domain.'
      },
      {
        question: 'Can I test CleanBounce for free?',
        answer: 'Yes, every new account gets 100 free verification credits and access to the Deliverability Simulator to test domain health.'
      }
    ]
  }
}
