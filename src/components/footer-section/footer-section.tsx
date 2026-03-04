import Image from 'next/image'
import { TestimonialAuthor } from './testimonial-author'
import { SectionLayout } from '../section-layout/section-layout'
import type { Feature } from '@/components/section-layout'

const HEADLINE = 'Websites built at startup speed, without the agency friction'

const FEATURES: readonly Feature[] = [
  {
    label: 'BUILT FOR AI FOUNDERS',
    description:
      'We partner with AI startups to ship production-ready websites that match the sophistication of their products.',
  },
  {
    label: 'SYSTEMS > SERVICES',
    description:
      'No hand-offs. No queues. Just proven digital systems refined across dozens of projects.',
  },
  {
    label: 'DELIVER EXACTLY WHAT YOU NEED',
    description:
      'From landing pages to full platforms, everything is built from AI-native frameworks designed to scale.',
  },
] as const

const TESTIMONIAL =
  'SuperSkills consistently delivers at the highest standard. They combine exceptional design sensibility with technical precision, clear communication, and remarkable speed. Working with them feels less like hiring an agency and more like extending our own team — they care deeply about the work and it shows in every detail.'

function Testimonial() {
  return (
    <div className="pt-24 pb-10">
      <Image
        src="/aspas.svg"
        alt=""
        width={24}
        height={18}
        aria-hidden="true"
      />

      <p className="mt-0 mb-2.5 max-w-225 font-neuemontreal text-[clamp(1.1rem,1.6vw,1.8em)] font-light leading-[1.4] text-gray-900">
        {TESTIMONIAL}
      </p>

      <TestimonialAuthor />
    </div>
  )
}

export function FooterSection() {
  return (
    <SectionLayout
      headline={HEADLINE}
      features={FEATURES}
      bg="bg-white"
      headlineColor="text-gray-900"
      labelColor="#1a1a1a"
      descriptionColor="#5F5F5F"
      lineColor="#e0e0e0"
      noFluid
    >
      <div className="ml-0 lg:ml-20 xl:ml-[41vw] flex flex-col">
        <Testimonial />
      </div>
    </SectionLayout>
  )
}
