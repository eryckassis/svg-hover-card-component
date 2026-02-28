'use client'

import dynamic from 'next/dynamic'
import { ScrollToExplore } from '@/components/scroll-to-explore'

const ConnectorsScene = dynamic(
  () =>
    import('./connectors-scene').then((mod) => ({
      default: mod.ConnectorsScene,
    })),
  { ssr: false },
)

export function ConnectorsSection() {
  return (
    <section data-theme="dark" className="w-full pt-4 pb-6 px-4 sm:px-6">
      <ConnectorsScene />
      <ScrollToExplore />
    </section>
  )
}
