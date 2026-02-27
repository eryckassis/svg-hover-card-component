import { Navbar } from './navbar'

const HEADLINE_LINES = ['AI companies', 'deserve more than', 'agencies']

function Headline() {
  return (
    <div className="w-full px-6 pt-28 pb-10 sm:px-10 md:px-16 md:pt-32 xl:px-28 2xl:px-120 2xl:pt-36 2xl:pb-14 ">
      <h1 className="max-w-162.5 text-[clamp(2rem,4.2vw,3.5rem)] font-normal leading-[1.15] tracking-[-0.02em]">
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
