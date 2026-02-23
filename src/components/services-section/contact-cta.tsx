export function ContactCTA() {
  return (
    <div className="mt-20 grid grid-cols-[0.8fr_1.2fr] gap-20 max-[1000px]:grid-cols-1">
      <h3 className="relative ml-100 text-[3.5em] font-normal leading-[1.2] tracking-[-0.01em] text-white">
        Contact us
      </h3>
      <p className="ml-60 max-w-[1000px] text-[4em] font-normal leading-[1.3] text-white">
        If you&apos;re growing, we&apos;re ready to build with you.{" "}
        <a
          href="#"
          className="text-[#8a8a8a]  decoration-[#8a8a8a] underline-offset-4 transition-colors hover:text-white hover:decoration-white"
        >
          {"Let's chat!"}
        </a>
      </p>
    </div>
  );
}
