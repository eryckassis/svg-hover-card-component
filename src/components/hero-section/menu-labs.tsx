"use client";

// rendering-hoist-jsx: Lucy SVG paths hoisted (from Lusion)
const LUCY_STROKE_PATH =
  "M20.128 29.65C18.584 31.217 16.532 32 13.972 32c-2.56 0-4.612-.783-6.156-2.35C6.272 28.05 5.5 26 5.5 23.5c0-2.5.772-4.533 2.316-6.1 1.544-1.6 3.596-2.4 6.156-2.4 2.56 0 4.612.8 6.156 2.4C21.71 18.967 22.5 21 22.5 23.5c0 2.5-.79 4.55-2.372 6.15Z";

const LUCY_FILL_PATH =
  "M23.5 4.25a3.25 3.25 0 1 0-6.5 0 3.25 3.25 0 0 0 6.5 0ZM11 4.25a3.25 3.25 0 1 0-6.5 0 3.25 3.25 0 0 0 6.5 0Z";

// rendering-hoist-jsx: external arrow path hoisted
const EXTERNAL_ARROW_PATH = "M4 20 20 4m0 0v14.096M20 4H5.904";

const lucyIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="38"
    fill="none"
    viewBox="0 0 28 38"
  >
    <path stroke="#fff" strokeWidth="5" d={LUCY_STROKE_PATH} />
    <path fill="#fff" d={LUCY_FILL_PATH} />
  </svg>
);

const externalArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d={EXTERNAL_ARROW_PATH}
    />
  </svg>
);

export function MenuLabs() {
  return (
    <a
      href="https://labs.lusion.co/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-2xl bg-black px-6 py-5"
    >
      <div className="flex items-center gap-4">
        {/* Lucy icon */}
        <div className="flex h-10 w-10 items-center justify-center">
          {lucyIcon}
        </div>

        {/* Labs text */}
        <span className="text-[1.625em] font-aeonik font-normal tracking-wide text-white uppercase">
          Labs
        </span>
      </div>

      {/* External arrow */}
      {externalArrow}
    </a>
  );
}
