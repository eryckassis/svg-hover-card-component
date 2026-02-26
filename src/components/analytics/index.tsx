'use client'

import dynamic from 'next/dynamic'

const AnalyticsClient = dynamic(
  () => import('@vercel/analytics/react').then((m) => m.Analytics),
  { ssr: false },
)

export function Analytics() {
  return <AnalyticsClient />
}
