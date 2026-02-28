import { Navbar } from './navbar'

const HEADLINE_LINES = [
  'We help brands create digital',
  'experiences that connect with',
  'their audience',
]

function Headline() {
  return (
    <div className="w-full px-6 pt-28 pb-10 sm:px-10 md:px-16 md:pt-32 xl:pt-7 xl:pb-6 xl:pl-[28vw] xl:pr-20 2xl:pt-7 2xl:pl-[30vw] 2xl:pr-24">
      <h1 className="max-w-162.5 text-[clamp(2rem,4.2vw,3.5rem)] font-normal leading-[1.15] tracking-[-0.05em] xl:max-w-none xl:text-[clamp(1.6rem,2.6vw,2.5rem)] xl:leading-[1.3]">
        {HEADLINE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
    </div>
  )
}

export function HeroSection() {
  return (
    <header className="w-full">
      <Navbar />
      <Headline />
    </header>
  )
}
