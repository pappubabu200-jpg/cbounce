import { SOLUTIONS, SOLUTION_SLUGS } from '@/data/solutions'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import SolutionPageClient from './SolutionPageClient'

interface PageProps {
  params: { solution: string }
}

export function generateStaticParams() {
  return SOLUTION_SLUGS.map((slug) => ({ solution: slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = SOLUTIONS[params.solution]
  if (!data) return {}

  return {
    title: data.seo.title,
    description: data.seo.description,
    alternates: {
      canonical: `https://cleanbounce.ai/solutions/${data.slug}`,
    },
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url: `/solutions/${data.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.seo.title,
      description: data.seo.description,
    },
  }
}

export default function SolutionPage({ params }: PageProps) {
  const data = SOLUTIONS[params.solution]
  if (!data) notFound()

  return <SolutionPageClient data={data} />
}
