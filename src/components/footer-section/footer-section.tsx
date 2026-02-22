import Image from "next/image";
import { TestimonialAuthor } from "./testimonial-author";
const HEADLINE = "Websites built at startup speed, without the agency friction";

const FEATURES = [
  {
    label: "BUILT FOR AI FOUNDERS",
    description:
      "We partner with AI startups to ship production-ready websites that match the sophistication of their products.",
  },
  {
    label: "SYSTEMS > SERVICES",
    description:
      "No hand-offs. No queues. Just proven digital systems refined across dozens of projects.",
  },
  {
    label: "DELIVER EXACTLY WHAT YOU NEED",
    description:
      "From landing pages to full platforms, everything is built from AI-native frameworks designed to scale.",
  },
] as const;

const TESTIMONIAL =
  "SuperSkills consistently delivers at the highest standard. They combine exceptional design sensibility with technical precision, clear communication, and remarkable speed. Working with them feels less like hiring an agency and more like extending our own team — they care deeply about the work and it shows in every detail.";

function FeatureList() {
  return (
    <div className="ml-50 flex flex-col">
      {FEATURES.map((feature) => (
        <div key={feature.label}>
          <div className="flex items-start gap-[8vw] pb-8 pt-13">
            <span className="w-[300px] shrink-0 pt-0.5 font-mono text-[0.82em] font-normal uppercase leading-[1.1] tracking-[0.01em] text-[#1a1a1a]">
              {feature.label}
            </span>
            <p className="max-w-[350px] text-[1.2em] font-normal leading-[1.65] text-[#5F5F5F]">
              {feature.description}
            </p>
          </div>
          <div className="h-px max-w-[855px] bg-[#e0e0e0]" />
        </div>
      ))}
    </div>
  );
}

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

      <p className="mt-0 mb-2.5 max-w-[900px] font-neuemontreal text-[1.8em] font-light leading-[1.4] text-gray-900">
        {TESTIMONIAL}
      </p>

      <TestimonialAuthor />
    </div>
  );
}

export function FooterSection() {
  return (
    <section className="w-full bg-white px-16 pt-28 pb-16 max-[1000px]:px-6">
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-20 max-[1000px]:grid-cols-1">
        <h2 className="relative mt-0 mb-0 ml-90 max-w-[18ch] text-[3.2em] font-normal leading-[1.2] tracking-[-0.01em] text-gray-900">
          {HEADLINE}
        </h2>
        <FeatureList />
      </div>
      <div className="ml-300 flex flex-col">
        <Testimonial />
      </div>
    </section>
  );
}
