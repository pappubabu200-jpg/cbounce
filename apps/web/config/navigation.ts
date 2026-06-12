export interface NavItem {
  label: string
  href: string
  description?: string
  badge?: string
  soon?: boolean
  iconName?: string
}

export interface NavSection {
  title: string
  description?: string
  iconName?: string
  items: NavItem[]
}

export interface ServicesCategory {
  title: string
  iconName: string
  description: string
  href?: string
  badge?: string
  items: NavItem[]
}

export interface IntegrationsCategory {
  title: string
  items: NavItem[]
}

export interface NavigationConfig {
  services: ServicesCategory[]
  solutions: NavItem[]
  integrations: IntegrationsCategory[]
  apiDropdown: NavItem[]
  resources: NavItem[]
  directLinks: NavItem[]
  ctas: {
    login: NavItem
    signup: NavItem
  }
}

export const NAVIGATION_CONFIG: NavigationConfig = {
  services: [
    {
      title: 'Email Verification',
      iconName: 'mail',
      description: 'Ensure deliverability with real-time verification.',
      href: '/features/single',
      items: [
        { label: 'Single Email Verification', href: '/features/single', description: 'Verify one email instantly in sub-100ms' },
        { label: 'Bulk Email Verification', href: '/features/bulk', description: 'Upload CSV lists and clean thousands of leads' },
        { label: 'Google Sheets Verification', href: '/features/sheets', description: 'Verify records directly within spreadsheets' },
      ],
    },
    {
      title: 'LeadShield™',
      iconName: 'shield',
      description: 'Protect your lead forms from spam, bots, and fake users.',
      href: '/leadshield',
      badge: 'Popular',
      items: [
        { label: 'Real-Time Form Protection', href: '/leadshield', description: 'Block bad signups directly at entry' },
        { label: 'Bot & Disposable Detection', href: '/features/detection', description: 'Detect disposable emails and scripts instantly' },
      ],
    },
    {
      title: 'Email Intelligence',
      iconName: 'intelligence',
      description: 'Predict bounce behavior and keep servers in peak health.',
      href: '/features/email-intelligence',
      items: [
        { label: 'Email Intelligence Hub', href: '/features/email-intelligence', description: 'Complete intelligence diagnostics dashboard' },
        { label: 'Bounce Forecaster', href: '/features/forecaster', description: 'Predict deliverability issues before sending', badge: 'New' },
        { label: 'Domain Health Score', href: '/features/domain', description: 'SPF, DKIM, DMARC validation analysis', badge: 'New' },
      ],
    },
  ],
  solutions: [
    { label: 'For Email Marketers', href: '/solutions/email-marketers', description: 'Reduce bounce rates and improve deliverability' },
    { label: 'For Sales Teams', href: '/solutions/sales-teams', description: 'Verify prospects before outreach' },
    { label: 'For SaaS Companies', href: '/solutions/saas-companies', description: 'Stop fake signups before they enter' },
    { label: 'For Agencies', href: '/solutions/agencies', description: 'Manage client list hygiene at scale' },
    { label: 'For Ecommerce', href: '/solutions/ecommerce', description: 'Clean customer lists and improve retention' },
    { label: 'For Cold Email Outreach', href: '/solutions/cold-email-outreach', description: 'Maximize inbox placement and reply rates' },
  ],
  integrations: [
    {
      title: 'Featured',
      items: [
        { label: 'Google Sheets', href: '/integrations/sheets', iconName: 'sheets' },
        { label: 'HubSpot', href: '/integrations/hubspot', iconName: 'hubspot' },
        { label: 'Salesforce', href: '/integrations/salesforce', iconName: 'salesforce' },
        { label: 'Zapier', href: '/integrations/zapier', iconName: 'zapier' },
        { label: 'Make', href: '/integrations/make', iconName: 'make' },
      ],
    },
    {
      title: 'Marketing',
      items: [
        { label: 'Mailchimp', href: '/integrations/mailchimp', iconName: 'mailchimp' },
        { label: 'Klaviyo', href: '/integrations/klaviyo', iconName: 'klaviyo' },
        { label: 'ActiveCampaign', href: '/integrations/activecampaign', iconName: 'activecampaign' },
        { label: 'ConvertKit', href: '/integrations/convertkit', iconName: 'convertkit' },
        { label: 'MailerLite', href: '/integrations/mailerlite', iconName: 'mailerlite' },
      ],
    },
    {
      title: 'Website & Ecommerce',
      items: [
        { label: 'WordPress', href: '/integrations/wordpress', iconName: 'wordpress' },
        { label: 'WooCommerce', href: '/integrations/woocommerce', iconName: 'woocommerce' },
        { label: 'Shopify', href: '/integrations/shopify', iconName: 'shopify' },
        { label: 'Webflow', href: '/integrations/webflow', iconName: 'webflow' },
      ],
    },
  ],
  apiDropdown: [
    { label: 'Overview', href: '/developers', description: 'API overview and getting started', iconName: 'book' },
    { label: 'Verification API', href: '/developers/verification', description: 'High-throughput, real-time verification endpoint', iconName: 'code' },
    { label: 'LeadShield API', href: '/developers/leadshield', description: 'Programmatic access to LeadShield™ protection', iconName: 'shield' },
    { label: 'Email Intelligence API', href: '/developers/intelligence', description: 'Bounce forecasting and domain health via API', iconName: 'intelligence' },
    { label: 'Webhooks', href: '/developers/webhooks', description: 'Real-time event delivery for verification results', iconName: 'webhooks' },
  ],
  resources: [
    { label: 'Documentation', href: '/docs', iconName: 'book' },
    { label: 'API Docs', href: '/developers', iconName: 'code' },
    { label: 'Blog', href: '/blog', iconName: 'edit' },
    { label: 'Changelog', href: '/changelog', iconName: 'history' },
    { label: 'Deliverability Guide', href: '/guides/email-deliverability', iconName: 'trending' },
    { label: 'Email Verification Guide', href: '/guides/email-verification', iconName: 'check' },
    { label: 'Compare CleanBounce', href: '/compare', iconName: 'compare' },
    { label: 'Status Page', href: '/status', iconName: 'status' },
    { label: 'Contact Us', href: '/contact', iconName: 'phone' },
  ],
  directLinks: [
    { label: 'Pricing', href: '/pricing' },
  ],
  ctas: {
    login: { label: 'Login', href: '/login' },
    signup: { label: 'Start Free →', href: '/signup' },
  },
}
