export type IntegrationCategory = 'featured' | 'marketing' | 'ecommerce' | 'developer'

export interface Integration {
  slug: string
  name: string
  category: IntegrationCategory
  description: string
  badge?: 'Popular' | 'New' | 'Enterprise'
  setupTime: string
  docsHref: string
  color: string       // Tailwind bg-* for the icon tile
  textColor: string   // Tailwind text-* for the icon text
  initial: string     // Short letter(s) for the icon tile
}

export const INTEGRATIONS: Integration[] = [
  // ── Featured ──────────────────────────────────────────────────────────────
  {
    slug: 'google-sheets',
    name: 'Google Sheets',
    category: 'featured',
    description: 'Verify email columns directly inside any Google Sheet. Our custom Workspace add-on runs CleanBounce checks without leaving your spreadsheet.',
    badge: 'Popular',
    setupTime: '3 min setup',
    docsHref: '/integrations/google-sheets',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    initial: 'GS',
  },
  {
    slug: 'hubspot',
    name: 'HubSpot',
    category: 'featured',
    description: 'Keep your HubSpot CRM clean by verifying new contact emails in real-time. Trigger verifications via webhook or bulk-clean existing lists.',
    badge: 'Popular',
    setupTime: '5 min setup',
    docsHref: '/integrations/hubspot',
    color: 'bg-orange-50',
    textColor: 'text-orange-700',
    initial: 'HS',
  },
  {
    slug: 'salesforce',
    name: 'Salesforce',
    category: 'featured',
    description: 'Integrate CleanBounce into your Salesforce flows to automatically score and verify leads before they enter your pipeline.',
    badge: 'Enterprise',
    setupTime: '10 min setup',
    docsHref: '/integrations/salesforce',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    initial: 'SF',
  },
  {
    slug: 'zapier',
    name: 'Zapier',
    category: 'featured',
    description: 'Connect CleanBounce to 6,000+ apps via Zapier. Verify emails in any workflow — from Typeform submissions to Airtable records.',
    badge: 'Popular',
    setupTime: '2 min setup',
    docsHref: '/integrations/zapier',
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    initial: 'ZP',
  },
  {
    slug: 'make',
    name: 'Make',
    category: 'featured',
    description: 'Build powerful multi-step automations with CleanBounce in Make (formerly Integromat). No code required.',
    setupTime: '2 min setup',
    docsHref: '/integrations/make',
    color: 'bg-violet-50',
    textColor: 'text-violet-700',
    initial: 'MK',
  },

  // ── Marketing ─────────────────────────────────────────────────────────────
  {
    slug: 'mailchimp',
    name: 'Mailchimp',
    category: 'marketing',
    description: 'Export cleaned lists directly formatted for Mailchimp. Prevent suspended accounts by keeping bounce rates under 2%.',
    badge: 'Popular',
    setupTime: '5 min setup',
    docsHref: '/integrations/mailchimp',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    initial: 'MC',
  },
  {
    slug: 'klaviyo',
    name: 'Klaviyo',
    category: 'marketing',
    description: 'Sync verified email segments directly to Klaviyo lists. Protect your sender score before every campaign send.',
    badge: 'Popular',
    setupTime: '5 min setup',
    docsHref: '/integrations/klaviyo',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    initial: 'KL',
  },
  {
    slug: 'activecampaign',
    name: 'ActiveCampaign',
    category: 'marketing',
    description: 'Automatically verify contacts as they enter ActiveCampaign via webhook. Remove invalid emails from automation sequences.',
    setupTime: '5 min setup',
    docsHref: '/integrations/activecampaign',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    initial: 'AC',
  },
  {
    slug: 'convertkit',
    name: 'ConvertKit',
    category: 'marketing',
    description: 'Keep your ConvertKit subscriber list healthy. Bulk verify and re-import clean lists to protect your deliverability.',
    setupTime: '5 min setup',
    docsHref: '/integrations/convertkit',
    color: 'bg-red-50',
    textColor: 'text-red-700',
    initial: 'CK',
  },
  {
    slug: 'mailerlite',
    name: 'MailerLite',
    category: 'marketing',
    description: 'Verify subscribers before importing to MailerLite. Maintain high engagement and avoid spam folder placement.',
    setupTime: '5 min setup',
    docsHref: '/integrations/mailerlite',
    color: 'bg-teal-50',
    textColor: 'text-teal-700',
    initial: 'ML',
  },

  // ── Website & E-Commerce ──────────────────────────────────────────────────
  {
    slug: 'wordpress',
    name: 'WordPress',
    category: 'ecommerce',
    description: 'Add real-time email validation to any WordPress form with our lightweight plugin. Works with Contact Form 7, WPForms, and Elementor.',
    badge: 'Popular',
    setupTime: '3 min setup',
    docsHref: '/integrations/wordpress',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    initial: 'WP',
  },
  {
    slug: 'woocommerce',
    name: 'WooCommerce',
    category: 'ecommerce',
    description: 'Block fake customer emails during checkout. Reduce support tickets from missing order confirmations.',
    setupTime: '3 min setup',
    docsHref: '/integrations/woocommerce',
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    initial: 'WC',
  },
  {
    slug: 'shopify',
    name: 'Shopify',
    category: 'ecommerce',
    description: 'Validate customer emails at checkout via webhook. Prevent disposable emails from exploiting discount codes.',
    badge: 'Popular',
    setupTime: '5 min setup',
    docsHref: '/integrations/shopify',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    initial: 'SH',
  },
  {
    slug: 'webflow',
    name: 'Webflow',
    category: 'ecommerce',
    description: 'Add CleanBounce validation to Webflow forms via JavaScript embed. Block disposable emails before they hit your CMS.',
    badge: 'New',
    setupTime: '5 min setup',
    docsHref: '/integrations/webflow',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    initial: 'WF',
  },

  // ── Developer ─────────────────────────────────────────────────────────────
  {
    slug: 'api',
    name: 'REST API',
    category: 'developer',
    description: 'Full-featured REST API with sub-100ms response times. Verify single emails, run bulk jobs, and access LeadShield scores programmatically.',
    badge: 'Popular',
    setupTime: 'Instant',
    docsHref: '/developers',
    color: 'bg-slate-800',
    textColor: 'text-slate-100',
    initial: 'API',
  },
  {
    slug: 'webhooks',
    name: 'Webhooks',
    category: 'developer',
    description: 'Receive real-time event payloads when verification completes. Build reactive pipelines without polling our API.',
    setupTime: '10 min setup',
    docsHref: '/developers/webhooks',
    color: 'bg-slate-800',
    textColor: 'text-slate-100',
    initial: '{}',
  },
]

export const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  featured: 'Featured',
  marketing: 'Marketing',
  ecommerce: 'Website & E-Commerce',
  developer: 'Developer',
}

export const CATEGORY_ORDER: IntegrationCategory[] = [
  'featured',
  'marketing',
  'ecommerce',
  'developer',
]
