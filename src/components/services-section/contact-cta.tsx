export function ContactCTA() {
  return (
    <div className="mt-10 lg:mt-14 xl:mt-20 grid grid-cols-1 min-[1000px]:grid-cols-2 xl:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-14 xl:gap-20">
      <h3 className="relative ml-0 2xl:ml-20 text-[clamp(2rem,3.5vw,3.5em)] font-normal leading-[1.1] tracking-[-0.01em] text-white">
        Contact us
      </h3>
      <p className="ml-0 xl:ml-10 2xl:ml-10 max-w-[1000px] text-[clamp(1.6rem,3.2vw,4em)] font-normal leading-[1.3] text-white">
        If you&apos;re growing, we&apos;re ready to build with you.{' '}
        <a
          href="#"
          className="text-[#8a8a8a]  decoration-[#8a8a8a] underline-offset-4 transition-colors hover:text-white hover:decoration-white"
        >
          {"Let's chat!"}
        </a>
      </p>
    </div>
  )
}
