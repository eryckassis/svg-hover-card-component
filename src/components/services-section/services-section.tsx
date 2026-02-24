import { SectionLayout } from "../section-layout/section-layout";
import type { Feature } from "@/components/section-layout";
import { ContactCTA } from "./contact-cta";

const HEADLINE = "Built for founders who need things done right";

const SERVICES: readonly Feature = [
  {
    label: "WEBFLOW DEVELOPMENT",
    description:
      "High-performance sites for tech and AI startups that need to move fast and look legit.",
  },
  {
    label: "FRAMER DEVELOPMENT",
    description:
      "Interactive, motion-driven builds that help complex AI products feel simple and easy to understand.",
  },
  {
    label: "LANDING PAGE SPRINTS",
    description:
      "Go from idea → live page in days. Perfect for AI tools launching features, waitlists, or experiments.",
  },
  {
    label: "SITE MAINTENANCE & ITERATION",
    description:
      "We act as your product site team — shipping new pages, updates, tests, and improvements without slowing you down.",
  },
  {
    label: "BRAND & VISUAL SYSTEMS",
    description:
      "Branding and design systems built for startups who need Series-B polish on a Seed-stage budget.",
  },
];

export function ServicesSection() {
  return (
    <SectionLayout
      headline={HEADLINE}
      features={SERVICES}
      bg="bg-[#0e0e0e]"
      headlineColor="text-white"
      labelColor="#999"
      descriptionColor="#888"
      lineColor="#333"
      className="rounded-[40px]"
      theme="dark"
    >
      <ContactCTA />
    </SectionLayout>
  );
}
