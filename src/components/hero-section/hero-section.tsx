import { Navbar } from "./navbar";

const HEADLINE_LINES = ["AI companies", "deserve more than", "agencies"];

function Headline() {
  return (
    <div className="w-full px-120 pt-36 pb-14">
      <h1 className="max-w-[650px] text-[clamp(2.5rem,4.2vw,3.5rem)] font-normal leading-[1.15] tracking-[-0.02em]">
        {HEADLINE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
    </div>
  );
}

export function HeroSection() {
  return (
    <header className="w-full">
      <Navbar />
      <Headline />
    </header>
  );
}
