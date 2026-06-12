import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real-Time Form Protection & Bot Detection | LeadShield™ by CleanBounce',
  description:
    'LeadShield™ blocks disposable emails, spam signups, bots, and fake leads before they enter your CRM. Real-time form protection with risk scoring and bot detection.',
  keywords: [
    'real-time form protection',
    'disposable email blocker',
    'bot detection',
    'fake lead prevention',
    'lead quality scoring',
  ],
  alternates: {
    canonical: 'https://cleanbounce.ai/leadshield',
  },
  openGraph: {
    title: 'Real-Time Form Protection & Bot Detection | LeadShield™ by CleanBounce',
    description:
      'LeadShield™ blocks disposable emails, spam signups, bots, and fake leads before they enter your CRM. Real-time form protection with risk scoring and bot detection.',
    url: 'https://cleanbounce.ai/leadshield',
    siteName: 'CleanBounce',
    type: 'website',
    images: [
      {
        url: 'https://cleanbounce.io/og/leadshield.png',
        width: 1200,
        height: 630,
        alt: 'LeadShield™ — Real-Time Form Protection by CleanBounce',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real-Time Form Protection & Bot Detection | LeadShield™ by CleanBounce',
    description:
      'LeadShield™ blocks disposable emails, spam signups, bots, and fake leads before they enter your CRM. Real-time form protection with risk scoring and bot detection.',
    images: ['https://cleanbounce.io/og/leadshield.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function LeadShieldLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
