export interface SolutionData {
  slug: string;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  problem: {
    title: string;
    description: string;
    points: string[];
  };
  whyChoose: {
    title: string;
    reasons: { icon: string; title: string; desc: string }[];
  };
  solution: {
    title: string;
    description: string;
    points: string[];
  };
  features: {
    id: 'verification' | 'leadshield' | 'intelligence';
    title: string;
    description: string;
  }[];
  results: {
    metric: string;
    label: string;
  }[];
  workflow: {
    title: string;
    steps: { label: string; detail: string; color: 'blue' | 'emerald' | 'indigo' | 'slate' }[];
  };
  integrations: { name: string; category: string }[];
  faq: {
    q: string;
    a: string;
  }[];
  relatedSlugs: string[];
}

const ALL_INTEGRATIONS = {
  crm: [
    { name: 'HubSpot', category: 'CRM' },
    { name: 'Salesforce', category: 'CRM' },
  ],
  esp: [
    { name: 'Mailchimp', category: 'Email' },
    { name: 'Klaviyo', category: 'Email' },
    { name: 'ActiveCampaign', category: 'Email' },
  ],
  outbound: [
    { name: 'Instantly', category: 'Outbound' },
    { name: 'Lemlist', category: 'Outbound' },
    { name: 'Apollo', category: 'Outbound' },
  ],
  ecomm: [
    { name: 'Shopify', category: 'E-Commerce' },
    { name: 'WooCommerce', category: 'E-Commerce' },
  ],
  automation: [
    { name: 'Zapier', category: 'Automation' },
    { name: 'Make', category: 'Automation' },
  ],
  dev: [
    { name: 'REST API', category: 'Developer' },
    { name: 'Webhooks', category: 'Developer' },
  ],
};

export const SOLUTIONS: Record<string, SolutionData> = {
  'email-marketers': {
    slug: 'email-marketers',
    seo: {
      title: 'Email Deliverability Software for Marketers | CleanBounce',
      description: 'Stop bounces before they happen. Predict deliverability, clean your marketing lists, and reach the primary inbox with CleanBounce.',
    },
    hero: {
      badge: 'For Email Marketers',
      headline: 'Reach the Inbox. Not the Spam Folder.',
      subheadline: 'Protect your sender reputation and maximize campaign ROI by cleaning your lists and predicting deliverability issues before you hit send.',
      ctaText: 'Start Cleaning Lists Free',
    },
    problem: {
      title: 'The Hidden Cost of Dirty Lists',
      description: 'Email marketing platforms like Mailchimp and Klaviyo will suspend your account if your bounce rate exceeds 2%. Even worse, sending to spam traps permanently damages your domain reputation — often without warning.',
      points: [
        'High bounce rates triggering ESP account suspensions.',
        'Spam traps and honeypots secretly destroying your domain reputation.',
        'Low open rates caused by poor inbox placement.',
      ],
    },
    whyChoose: {
      title: 'Why Email Marketers Choose CleanBounce',
      reasons: [
        { icon: '⚡', title: 'Fastest Bulk Cleaning', desc: 'Process millions of rows in minutes, not hours. No queue times, no pipeline crashes.' },
        { icon: '🎯', title: 'Highest Accuracy', desc: 'Our 99.9% accuracy SLA means you\'re not throwing good money after bad sends.' },
        { icon: '📊', title: 'Pre-Send Intelligence', desc: 'Predict deliverability issues before launch. Not after your sender score tanks.' },
      ],
    },
    solution: {
      title: 'Flawless Deliverability on Every Send',
      description: 'CleanBounce removes the guesswork. We scrub your lists of invalid emails, spam traps, and role accounts, ensuring your carefully crafted campaigns actually reach human eyes.',
      points: [
        'Sub-millisecond verification prevents bad data entry at signup forms.',
        'Advanced spam trap detection protects your sending IPs.',
        'Predictive deliverability scoring guarantees inbox placement.',
      ],
    },
    features: [
      { id: 'verification', title: 'Bulk List Cleaning', description: 'Upload massive CSV lists from your ESP and scrub them in seconds with our high-throughput verification engine.' },
      { id: 'intelligence', title: 'Pre-flight Deliverability Checks', description: 'Simulate inbox placement before launching your campaign to ensure you avoid Gmail and Outlook spam filters.' },
      { id: 'leadshield', title: 'Newsletter Form Protection', description: 'Integrate LeadShield into your signup forms to block bots and disposable emails from polluting your subscriber list.' },
    ],
    results: [
      { metric: '99.9%', label: 'Delivery Rate' },
      { metric: '<0.5%', label: 'Bounce Rate' },
      { metric: '40%+', label: 'Open Rate Uplift' },
    ],
    workflow: {
      title: 'Your Email Marketing Workflow',
      steps: [
        { label: 'Upload List', detail: 'CSV from Mailchimp, Klaviyo, or any ESP', color: 'slate' },
        { label: 'CleanBounce Scans', detail: 'Invalid, disposable, spam trap detection', color: 'blue' },
        { label: 'Intelligence Report', detail: 'Deliverability score + inbox prediction', color: 'indigo' },
        { label: 'Send Campaign', detail: 'Maximum inbox placement, zero bounces', color: 'emerald' },
      ],
    },
    integrations: [
      ...ALL_INTEGRATIONS.esp,
      ...ALL_INTEGRATIONS.automation,
      ...ALL_INTEGRATIONS.dev,
    ],
    faq: [
      { q: 'Does this integrate with Mailchimp/Klaviyo?', a: 'Yes, we offer direct API integrations and seamless CSV exports formatted perfectly for major ESPs.' },
      { q: 'How accurate is the verification?', a: 'CleanBounce guarantees 99.9% accuracy. If a verified email bounces, we automatically refund the credit.' },
      { q: 'How fast is bulk verification?', a: 'Our distributed engine processes 1 million emails in under 10 minutes with no queue time.' },
    ],
    relatedSlugs: ['cold-email-outreach', 'agencies', 'saas-companies'],
  },

  'sales-teams': {
    slug: 'sales-teams',
    seo: {
      title: 'Email Verification for Sales & Revenue Teams | CleanBounce',
      description: 'Stop wasting time on fake leads. Verify B2B emails in real-time and ensure your SDRs are only prospecting real buyers.',
    },
    hero: {
      badge: 'For Sales & Revenue Teams',
      headline: 'Stop Wasting Rep Time on Fake Leads.',
      subheadline: 'Ensure your CRM is populated with highly-qualified, verified buyers. Block disposable emails and invalid domains at the entry point — before they waste a single rep hour.',
      ctaText: 'Protect Your Pipeline',
    },
    problem: {
      title: 'A Pipeline Full of Junk',
      description: 'Your sales reps are spending hours chasing leads that don\'t exist. Fake signups, disposable emails, and outdated B2B contacts are clogging your CRM and tanking your conversion rates.',
      points: [
        'SDRs wasting hours emailing invalid or fake accounts.',
        'CRM polluted with disposable "burner" email addresses.',
        'Outreach emails bouncing, harming corporate domain reputation.',
      ],
    },
    whyChoose: {
      title: 'Why Sales Teams Trust CleanBounce',
      reasons: [
        { icon: '🛡️', title: 'Block at the Gate', desc: 'Stop fake leads from entering your CRM in the first place — not after your reps waste hours on them.' },
        { icon: '🔗', title: 'Works with Your CRM', desc: 'Direct integrations with HubSpot and Salesforce keep your pipeline clean automatically.' },
        { icon: '⚡', title: 'Sub-100ms Verification', desc: 'Zero latency for your demo request forms. Real users never notice, fake leads never pass.' },
      ],
    },
    solution: {
      title: 'Only Real Buyers Enter Your CRM',
      description: 'CleanBounce acts as a bouncer for your pipeline. We verify every lead in real-time, instantly blocking disposable emails and ensuring your reps only spend time on qualified buyers.',
      points: [
        'Real-time API instantly blocks fake emails on your demo forms.',
        'Bulk verify scraped B2B contact lists before outreach.',
        'Identify and flag generic role accounts (e.g., info@, sales@).',
      ],
    },
    features: [
      { id: 'leadshield', title: 'Demo Request Protection', description: 'Prevent competitors or bots from submitting fake demo requests using LeadShield\'s real-time form widget.' },
      { id: 'verification', title: 'CRM List Verification', description: 'Clean your HubSpot or Salesforce database to remove contacts that have left their companies or churned.' },
      { id: 'intelligence', title: 'Domain Health Monitoring', description: 'Ensure your sales domain isn\'t blacklisted by major B2B spam filters like Mimecast or Proofpoint.' },
    ],
    results: [
      { metric: '0', label: 'Fake Demo Requests' },
      { metric: '25%', label: 'More Rep Selling Time' },
      { metric: '100%', label: 'CRM Accuracy' },
    ],
    workflow: {
      title: 'Protecting Your Sales Pipeline',
      steps: [
        { label: 'Demo Request Submitted', detail: 'Prospect fills out your form', color: 'slate' },
        { label: 'LeadShield™ Scans', detail: 'Real-time disposable & bot check', color: 'blue' },
        { label: 'Risk Score Assigned', detail: 'Qualified vs. Blocked decision', color: 'indigo' },
        { label: 'Clean Lead to CRM', detail: 'Only real buyers reach your reps', color: 'emerald' },
      ],
    },
    integrations: [
      ...ALL_INTEGRATIONS.crm,
      ...ALL_INTEGRATIONS.outbound,
      ...ALL_INTEGRATIONS.dev,
    ],
    faq: [
      { q: 'Can this verify strict B2B domains?', a: 'Yes, CleanBounce uses advanced SMTP handshakes to verify strict catch-all B2B domains accurately.' },
      { q: 'Do you integrate with HubSpot or Salesforce?', a: 'We offer webhooks and API endpoints that integrate seamlessly with any modern CRM.' },
      { q: 'Does it work on demo request forms?', a: 'Yes. You can embed our LeadShield widget directly on any form or use our API to validate on submission.' },
    ],
    relatedSlugs: ['cold-email-outreach', 'saas-companies', 'email-marketers'],
  },

  'saas-companies': {
    slug: 'saas-companies',
    seo: {
      title: 'Bot Protection & Email Verification for SaaS | CleanBounce',
      description: 'Protect your free trials from bot abuse, spam signups, and disposable emails with CleanBounce real-time API.',
    },
    hero: {
      badge: 'For SaaS & Startups',
      headline: 'Protect Your App from Trial Abuse.',
      subheadline: 'Block automated bots, headless browsers, and disposable emails from exhausting your server resources and polluting your database — without a single CAPTCHA.',
      ctaText: 'Secure Your App Free',
    },
    problem: {
      title: 'Bots Are Draining Your Infrastructure',
      description: 'Malicious actors and bots exploit free trials to mine resources, send spam, or scrape your app. Relying on basic CAPTCHAs disrupts UX while failing to stop sophisticated headless attacks.',
      points: [
        'Automated scripts creating thousands of fake accounts.',
        'Users bypassing limits using disposable 10-minute emails.',
        'High infrastructure costs driven by fraudulent resource usage.',
      ],
    },
    whyChoose: {
      title: 'Why SaaS Teams Pick CleanBounce',
      reasons: [
        { icon: '🤖', title: 'Invisible Bot Detection', desc: 'Our risk engine detects Puppeteer and Playwright scripts without ever showing your users a CAPTCHA.' },
        { icon: '⚡', title: 'Sub-100ms API', desc: 'Zero-latency API that sits inline with your auth flow without slowing down signups.' },
        { icon: '🧩', title: 'Simple Integration', desc: 'One API call during registration. Works with any stack — Node, Python, Go, PHP.' },
      ],
    },
    solution: {
      title: 'Frictionless Security',
      description: 'CleanBounce LeadShield™ operates invisibly in the background. We analyze risk, block disposable domains, and detect headless bots without ever showing a CAPTCHA to a legitimate user.',
      points: [
        'Sub-100ms API validation adds zero latency to your auth flow.',
        'Blocks 99% of disposable and temporary email providers globally.',
        'Invisible bot detection stops Puppeteer and Playwright scripts.',
      ],
    },
    features: [
      { id: 'leadshield', title: 'Invisible Bot Protection', description: 'Deploy our lightweight script to block automated trial signups without frustrating real users with CAPTCHAs.' },
      { id: 'verification', title: 'Real-Time Auth API', description: 'Ping our high-speed API during user registration to ensure the provided email actually exists before writing to your database.' },
      { id: 'intelligence', title: 'Transactional Email Deliverability', description: 'Ensure critical app notifications (password resets, billing alerts) don\'t land in the user\'s spam folder.' },
    ],
    results: [
      { metric: '<100ms', label: 'API Response Time' },
      { metric: '99.9%', label: 'Bot Block Rate' },
      { metric: '0', label: 'CAPTCHAs Needed' },
    ],
    workflow: {
      title: 'Protecting Your App Signup Flow',
      steps: [
        { label: 'User Registers', detail: 'Provides email in your signup form', color: 'slate' },
        { label: 'CleanBounce API', detail: 'Real-time risk assessment in <100ms', color: 'blue' },
        { label: 'Bot / Disposable?', detail: 'Automatically blocked at the gate', color: 'indigo' },
        { label: 'Real User Enters', detail: 'Clean account created in your database', color: 'emerald' },
      ],
    },
    integrations: [
      ...ALL_INTEGRATIONS.dev,
      ...ALL_INTEGRATIONS.automation,
      ...ALL_INTEGRATIONS.crm,
    ],
    faq: [
      { q: 'How fast is the verification API?', a: 'Our edge network processes verifications in under 100ms, ensuring zero noticeable latency in your sign-up flows.' },
      { q: 'Can I block specific disposable providers?', a: 'Yes, CleanBounce automatically maintains a real-time list of thousands of disposable domains, and you can add custom blocklists.' },
      { q: 'Is there an SDK available?', a: 'Yes, we provide SDKs for Node.js, Python, and PHP, plus a JavaScript snippet for frontend form validation.' },
    ],
    relatedSlugs: ['sales-teams', 'agencies', 'ecommerce'],
  },

  'agencies': {
    slug: 'agencies',
    seo: {
      title: 'Bulk Email Verification for Marketing Agencies | CleanBounce',
      description: 'Clean massive client databases securely. Get volume discounts, sub-accounts, and white-label reporting for your agency.',
    },
    hero: {
      badge: 'For Marketing Agencies',
      headline: 'Clean Toxic Client Databases Instantly.',
      subheadline: 'Inherited a messy list? Bulk verify massive databases, protect your agency\'s sender reputation, and deliver flawless campaign results to every client.',
      ctaText: 'Get Agency Pricing',
    },
    problem: {
      title: 'Inheriting Toxic Client Data',
      description: 'Clients often hand over years-old, unmaintained email lists. Sending campaigns to these toxic lists will trigger spam traps, ruin your agency\'s sending IPs, and result in terrible campaign performance.',
      points: [
        'Risking your agency\'s master sending domains on unverified client lists.',
        'Terrible campaign performance making your agency look bad.',
        'Managing multiple client lists securely without mixing data.',
      ],
    },
    whyChoose: {
      title: 'Why Agencies Rely on CleanBounce',
      reasons: [
        { icon: '🏢', title: 'Client Isolation', desc: 'Sub-accounts ensure client data is always siloed — no cross-contamination between projects.' },
        { icon: '📈', title: 'Volume Pricing', desc: 'Agency-tier discounts that scale with your throughput. Clean more lists, pay less per record.' },
        { icon: '🔒', title: 'SOC2 & GDPR Ready', desc: 'Tell your clients their data is safe. We\'re fully compliant with enterprise security standards.' },
      ],
    },
    solution: {
      title: 'Safe, Scalable List Hygiene',
      description: 'CleanBounce provides agencies with high-volume, secure bulk cleaning. Scrub millions of emails, generate detailed health reports, and guarantee client campaign success.',
      points: [
        'Process massive multi-million row CSVs without pipeline crashes.',
        'Organization sub-accounts to isolate client data securely.',
        'Volume-based pricing tailored for high-throughput agency needs.',
      ],
    },
    features: [
      { id: 'verification', title: 'Massive Bulk Verification', description: 'Upload client lists of any size. Our distributed architecture cleans lists exponentially faster than legacy tools.' },
      { id: 'intelligence', title: 'Client Deliverability Audits', description: 'Run predictive audits on client domains to show them exactly why their previous campaigns were hitting the spam folder.' },
      { id: 'leadshield', title: 'Client Form Protection', description: 'Add value to your service by installing LeadShield on your client\'s landing pages to protect their inbound lead flow.' },
    ],
    results: [
      { metric: '10x', label: 'Faster Processing' },
      { metric: '100%', label: 'Client Data Isolation' },
      { metric: '99.9%', label: 'Accuracy SLA' },
    ],
    workflow: {
      title: 'Agency Client Workflow',
      steps: [
        { label: 'Receive Client List', detail: 'Any size CSV, any ESP format', color: 'slate' },
        { label: 'Bulk Verify', detail: 'High-throughput distributed engine', color: 'blue' },
        { label: 'Deliverability Audit', detail: 'Domain health + spam trap report', color: 'indigo' },
        { label: 'Launch Campaign', detail: 'Guaranteed performance for client', color: 'emerald' },
      ],
    },
    integrations: [
      ...ALL_INTEGRATIONS.esp,
      ...ALL_INTEGRATIONS.crm,
      ...ALL_INTEGRATIONS.dev,
    ],
    faq: [
      { q: 'Do you offer sub-accounts for different clients?', a: 'Yes, our enterprise tiers support full RBAC and organization separation to keep client data siloed.' },
      { q: 'Is client data kept private?', a: 'Absolutely. We are SOC2 and GDPR compliant. Lists are encrypted at rest and automatically purged after 30 days.' },
      { q: 'Do you offer white-label reports?', a: 'Yes, on agency tiers you can generate branded deliverability audit reports to share directly with clients.' },
    ],
    relatedSlugs: ['email-marketers', 'cold-email-outreach', 'saas-companies'],
  },

  'ecommerce': {
    slug: 'ecommerce',
    seo: {
      title: 'Email Verification for E-Commerce Brands | CleanBounce',
      description: 'Stop fake orders and reduce fraud. Verify customer emails during checkout and ensure order confirmations hit the primary inbox.',
    },
    hero: {
      badge: 'For E-Commerce & Retail',
      headline: 'Ensure Order Confirmations Arrive.',
      subheadline: 'Reduce fraud, block fake checkout emails, and guarantee that shipping notifications and promo codes reach your customers\' primary inbox — every time.',
      ctaText: 'Protect Your Store',
    },
    problem: {
      title: 'Lost Revenue from Bad Data',
      description: 'When customers typo their email at checkout, they don\'t get their receipts or tracking numbers, leading to massive customer support debt. Worse, fraudsters use disposable emails to exploit promo codes.',
      points: [
        'Customer support overwhelmed by "Where is my order?" tickets.',
        'Fraudsters exploiting first-time buyer promo codes with disposable emails.',
        'Post-purchase marketing emails bouncing and ruining retention.',
      ],
    },
    whyChoose: {
      title: 'Why E-Commerce Brands Choose CleanBounce',
      reasons: [
        { icon: '🛒', title: 'Checkout-Native', desc: 'Sub-100ms API validates emails the instant a user types them — before they even click "Buy Now".' },
        { icon: '🎫', title: 'Promo Code Shield', desc: 'Block the wave of 10-minute emails that flood every discount campaign launch.' },
        { icon: '📦', title: 'Transactional Guarantee', desc: 'Ensure receipts, tracking, and shipping alerts always hit the primary inbox.' },
      ],
    },
    solution: {
      title: 'Flawless Checkout & Retention',
      description: 'CleanBounce integrates directly into your checkout flow to catch typos in real-time, block promo-code abusers using temporary emails, and ensure your post-purchase flows always deliver.',
      points: [
        'Real-time typo detection prompts users to fix their email before paying.',
        'Blocks disposable email providers from claiming discount codes.',
        'Ensures transactional emails (receipts, tracking) avoid spam filters.',
      ],
    },
    features: [
      { id: 'verification', title: 'Checkout Typo Correction', description: 'Catch common typos (like @gmil.com instead of @gmail.com) in real-time before the customer completes their purchase.' },
      { id: 'leadshield', title: 'Promo Abuse Prevention', description: 'Stop users from generating dozens of 10-minute disposable emails just to farm your "15% off first order" discount codes.' },
      { id: 'intelligence', title: 'Transactional Deliverability', description: 'Monitor your sending domain health to guarantee that vital shipping and tracking notifications never land in spam.' },
    ],
    results: [
      { metric: '95%', label: 'Fewer Email Typos' },
      { metric: '100%', label: 'Promo Abuse Blocked' },
      { metric: '30%', label: 'Support Ticket Drop' },
    ],
    workflow: {
      title: 'Securing Your Checkout Flow',
      steps: [
        { label: 'Customer at Checkout', detail: 'Types email address in form', color: 'slate' },
        { label: 'CleanBounce Validates', detail: 'Typo correction + disposable check', color: 'blue' },
        { label: 'Promo Abuse Check', detail: 'Block disposable discount exploiters', color: 'indigo' },
        { label: 'Order Confirmed', detail: 'Receipt & tracking always arrives', color: 'emerald' },
      ],
    },
    integrations: [
      ...ALL_INTEGRATIONS.ecomm,
      ...ALL_INTEGRATIONS.esp,
      ...ALL_INTEGRATIONS.dev,
    ],
    faq: [
      { q: 'Does this integrate with Shopify?', a: 'Yes, CleanBounce can be integrated into headless Shopify checkouts or via webhooks for instant order verification.' },
      { q: 'Will this slow down the checkout process?', a: 'No, our sub-100ms response time means verification happens instantly in the background without adding friction.' },
      { q: 'Can I block just disposable emails but allow all real ones?', a: 'Yes, you have full control. Set policies to block only disposable/invalid emails while accepting all real addresses.' },
    ],
    relatedSlugs: ['saas-companies', 'email-marketers', 'sales-teams'],
  },

  'cold-email-outreach': {
    slug: 'cold-email-outreach',
    seo: {
      title: 'Verify Cold Outreach Lists & Protect Sending Domains | CleanBounce',
      description: 'Never burn a domain again. Verify scraped B2B lists, resolve catch-alls, and ensure high inbox placement for your cold email outreach campaigns.',
    },
    hero: {
      badge: 'For Cold Email & Outbound',
      headline: 'Never Burn a Sending Domain Again.',
      subheadline: 'Verify scraped prospect lists, identify strict catch-all servers, and predict inbox placement before you launch your cold outreach campaigns.',
      ctaText: 'Start Verifying Prospects',
    },
    problem: {
      title: 'Bounces Destroy Outbound ROI',
      description: 'Cold email is a numbers game, but sending to scraped, unverified lists will skyrocket your bounce rate. Once your domain is flagged by Google or Microsoft, your entire infrastructure is burned.',
      points: [
        'High bounce rates causing sending domains to be blacklisted.',
        'Emails landing in spam instead of the primary inbox.',
        'Wasting money on sending software for invalid prospects.',
      ],
    },
    whyChoose: {
      title: 'Why Outbound Teams Trust CleanBounce',
      reasons: [
        { icon: '🎯', title: 'Best Catch-All Accuracy', desc: 'Other tools fail on B2B catch-all domains. Our heuristic engine accurately resolves the majority of them.' },
        { icon: '🔥', title: 'Protect Your Infrastructure', desc: 'Keep your sending domains warm and untarnished. Zero blacklist surprises mid-campaign.' },
        { icon: '📤', title: 'Outbound-Tool Ready', desc: 'Export cleaned lists formatted perfectly for Instantly, Lemlist, Apollo, and Smartlead.' },
      ],
    },
    solution: {
      title: 'Ironclad Sending Reputation',
      description: 'CleanBounce is built for high-volume outbound. We accurately resolve tricky B2B catch-all domains, remove dead prospects, and ensure your warm-up and outreach efforts are highly effective.',
      points: [
        'Advanced SMTP algorithms accurately resolve strict B2B catch-all servers.',
        'Identify and remove spam traps from scraped prospect lists.',
        'Predictive scoring helps you avoid domains with strict firewalls.',
      ],
    },
    features: [
      { id: 'verification', title: 'Catch-All Resolution', description: 'Legacy tools fail on B2B catch-all domains. CleanBounce uses advanced heuristics to accurately determine if a prospect actually exists.' },
      { id: 'intelligence', title: 'Spam Firewall Prediction', description: 'Simulate your outreach against corporate firewalls (Mimecast, Proofpoint) to predict if your email will bounce or pass.' },
      { id: 'leadshield', title: 'Lead-Gen Form Protection', description: 'If you run your own lead-gen forms, LeadShield ensures competitors aren\'t poisoning your database with fake bot submissions.' },
    ],
    results: [
      { metric: '99%', label: 'Inbox Placement' },
      { metric: '0', label: 'Burned Domains' },
      { metric: '3x', label: 'Higher Reply Rates' },
    ],
    workflow: {
      title: 'The Cold Outreach Pre-flight Checklist',
      steps: [
        { label: 'Upload Prospect List', detail: 'Scraped or purchased B2B contacts', color: 'slate' },
        { label: 'CleanBounce Verifies', detail: 'SMTP check + catch-all resolution', color: 'blue' },
        { label: 'Firewall Prediction', detail: 'Spam filter simulation per domain', color: 'indigo' },
        { label: 'Launch with Confidence', detail: 'Export to Instantly, Lemlist, Apollo', color: 'emerald' },
      ],
    },
    integrations: [
      ...ALL_INTEGRATIONS.outbound,
      ...ALL_INTEGRATIONS.crm,
      ...ALL_INTEGRATIONS.dev,
    ],
    faq: [
      { q: 'Do you work with catch-all domains?', a: 'Yes, our proprietary verification engine specializes in resolving strict B2B catch-all servers that other tools mark as "Unknown".' },
      { q: 'Can I integrate this with Instantly or Lemlist?', a: 'Yes, you can easily export our cleaned CSVs perfectly formatted for direct upload into major outbound tools.' },
      { q: 'How does spam firewall prediction work?', a: 'Our Email Intelligence engine simulates how major corporate spam filters (Mimecast, Proofpoint, Barracuda) would score your email before you send it.' },
    ],
    relatedSlugs: ['email-marketers', 'sales-teams', 'agencies'],
  },
};

export const SOLUTION_SLUGS = Object.keys(SOLUTIONS);
export const SOLUTION_LABELS: Record<string, string> = {
  'email-marketers': 'Email Marketers',
  'sales-teams': 'Sales Teams',
  'saas-companies': 'SaaS Companies',
  'agencies': 'Agencies',
  'ecommerce': 'E-Commerce',
  'cold-email-outreach': 'Cold Email Outreach',
};
