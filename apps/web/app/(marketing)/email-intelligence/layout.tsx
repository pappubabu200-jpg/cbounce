import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Predictive Email Deliverability & Sender Reputation | CleanBounce',
  description:
    'Know if your campaign will fail before you send it. Predict bounce risk, inbox placement, and blacklist exposure with CleanBounce Email Intelligence.',
  keywords: [
    'email deliverability prediction',
    'pre-send domain health checker',
    'sender reputation intelligence',
    'bounce forecaster',
    'domain health score',
    'inbox placement',
    'blacklist exposure',
    'email intelligence',
  ],
  alternates: {
    canonical: 'https://cleanbounce.io/email-intelligence',
  },
  openGraph: {
    title: 'Predictive Email Deliverability & Sender Reputation | CleanBounce',
    description:
      'Know if your campaign will fail before you send it. Predict bounce risk, inbox placement, and blacklist exposure with CleanBounce Email Intelligence.',
    url: 'https://cleanbounce.io/email-intelligence',
    siteName: 'CleanBounce',
    type: 'website',
    images: [
      {
        url: 'https://cleanbounce.io/og/email-intelligence.png',
        width: 1200,
        height: 630,
        alt: 'CleanBounce Email Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Predictive Email Deliverability & Sender Reputation | CleanBounce',
    description:
      'Know if your campaign will fail before you send it. Predict bounce risk, inbox placement, and blacklist exposure with CleanBounce Email Intelligence.',
    images: ['https://cleanbounce.io/og/email-intelligence.png'],
  },
}

export default function EmailIntelligenceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
