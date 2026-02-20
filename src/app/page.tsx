import { SvgHoverCard } from "@/components/svg-hover-card/svg-hover-card";
import { LogoMark } from "@/components/logo-mark";
import type { CardData } from "@/components/svg-hover-card/type";
import type { Logo } from "@/components/logo-mark";

const PARTNER_LOGOS: LOGO[] = [
  { src: "/webflow.svg", alt: "Webflow" },
  { src: "/morrow.svg", alt: "Expo" },
  { src: "/healt.svg", alt: "Modern Health" },
  { src: "/morrow.svg", alt: "Mindsparkle Mag" },
  { src: "/salsh.svg", alt: "Walsh" },
  { src: "/cut.svg", alt: "The Cut" },
  { src: "/mmc.svg", alt: "MMC" },
  { src: "/selfie.svg", alt: "Selfie" },
];

const cards: CardData[] = [
  {
    id: "card-1",
    title: "",
    imageSrc: "/img12.jpg",
    strokeColor: "#64BEF6",
    strokeColorSecondary: "#EAEBEC",
    logoSrc: "/webflow.svg",
    logoAlt: "Webflow",
    externalUrl: "https://webflow.com",
    headline: "+5K/mo",
    description:
      "Built Webflow's Startup + Classroom pages, generating 5K+ new signups every month (2023).",
    tags: ["Webflow", "Branding"],
  },
  {
    id: "card-2",
    title: "",
    imageSrc: "/img5.png",
    strokeColor: "#FF954F",
    strokeColorSecondary: "#EAEBEC",
    logoSrc: "/selfie.svg",
    logoAlt: "Selfie",
    externalUrl: "https://iselfie.ai/sa",
    headline: "3X",
    description:
      "Partnered with Expa to turn complex product ideas into a fast, interactive site — launched 3× faster for iSelfie (2025).",
    tags: ["Webflow"],
  },
  {
    id: "card-3",
    title: "",
    imageSrc: "/img3.jpg",
    strokeColor: "#87D85C",
    strokeColorSecondary: "#EAEBEC",
    logoSrc: "/healt.svg",
    logoAlt: "Health",
    externalUrl: "https://www.modernhealth.com/",
    headline: "48%",
    description:
      "Built a scalable Webflow site that speed up launches by 48% (2020-2025)",
    tags: ["Webflow", "Branding", "Site maintenace"],
  },
  {
    id: "card-4",
    title: "",
    videoSrc: "/img4.mp4",
    strokeColor: "#FF6598",
    strokeColorSecondary: "#EAEBEC",
    logoSrc: "/mmc.svg",
    logoAlt: "Health",
    externalUrl: "https://www.modernhealth.com/",
    headline: "6X",
    description:
      "Faster launch and higher brand awareness through advanced Webflow interactions and Lottie motion",
    tags: ["Webflow", "Branding"],
  },
  {
    id: "card-5",
    title: "",
    videoSrc: "/vidio.mp4",
    strokeColor: "#F6F3F7",
    strokeColorSecondary: "#EAEBEC",
    logoSrc: "/morrow.svg",
    logoAlt: "Health",
    externalUrl: "https://www.modernhealth.com/",
    headline: "80%",
    description:
      "Optmize workflows, boosting team efficiency and cutting dev bottlenecks by 80%",
    tags: ["Partnership"],
  },
  {
    id: "card-6",
    title: "",
    videoSrc: "/ruby.mp4",
    strokeColor: "#64BEF6",
    strokeColorSecondary: "#EAEBEC",
    logoSrc: "/morrow.svg",
    logoAlt: "Branding",
    externalUrl: "https://www.rubi.earth/",
    headline: "7X",
    description:
      "built Webflow + custom animations, delivering 7x faster while keeping pixel-perfect design ",
    tags: ["Branding", "Webflow"],
  },
  {
    id: "card-7",
    title: "",
    videoSrc: "/red.mp4",
    strokeColor: "#031C73",
    strokeColorSecondary: "#EAEBEC",
    logoSrc: "/salsh.svg",
    logoAlt: "Branding",
    externalUrl: "https://andwalsh.com/",
    headline: "6/12",
    description:
      "Streamlined dev workflow and shipped 6 projects in under a year ",
    tags: ["Partnership"],
  },
  {
    id: "card-8",
    title: "",
    videoSrc: "/yellow.avif",
    strokeColor: "#ffe320",
    strokeColorSecondary: "#EAEBEC",
    logoSrc: "/cut.svg",
    logoAlt: "Branding",
    externalUrl: "https://thecut.co/",
    headline: "62%",
    description:
      "By migrating to Webflow, The Cut accelerated their website updates,r educing bottlenecks and saving 62% of their dev resources ",
    tags: ["Branding", "Partnership"],
  },
];

export default function Home() {
  const rows = cards.reduce<CardData[][]>((acc, card, i) => {
    if (i % 2 === 0) acc.push([]);
    acc[acc.length - 1].push(card);
    return acc;
  }, []);

  return (
    <>
      <header className="w-full py-60 px-8 flex justify-center items-center text-center">
        <h1 className="text-[clamp(3rem,5vw,7rem)] font-medium leading-[1.25] tracking-[-0.05rem]">
          The Hover State
        </h1>
      </header>

      <LogoMark logos={PARTNER_LOGOS} speed={50} />

      {rows.map((row, i) => (
        <div
          key={i}
          className="w-full px-2 mb-2 flex gap-2 max-[1000px]:flex-col"
        >
          {row.map((card) => (
            <SvgHoverCard key={card.id} {...card} />
          ))}
        </div>
      ))}

      <footer className="w-full py-60 px-8 flex justify-center items-center text-center">
        <h1 className="text-[clamp(3rem,5vw,7rem)] font-medium leading-[1.25] tracking-[-0.05rem]">
          End of Interaction
        </h1>
      </footer>
    </>
  );
}
