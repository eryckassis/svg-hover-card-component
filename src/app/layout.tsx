import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { SmoothScroll } from '@/components/smooth-scroll'
import { Analytics } from '@/components/analytics'
import { ScrollBar } from '@/components/scroll-bar'
import { Fluid } from '@/components/fluid'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const aeonik = localFont({
  src: [
    {
      path: '../../public/fonts/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aeonik-Medium.woff2',
      weight: '500',
      style: 'medium',
    },
  ],
  variable: '--font-aeonik',
  display: 'block',
})

export const metadata: Metadata = {
  title: 'SVG Image Hover Effect',
  description: 'interactive SVG stroke animation on hover',
}

const scrollBar = <ScrollBar width={6} trackHeight={190} />

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${aeonik.variable} antialiased`}>
        <SmoothScroll />
        <Fluid />

        {scrollBar}
        {children}
        <Analytics />
      </body>
    </html>
  )
}
