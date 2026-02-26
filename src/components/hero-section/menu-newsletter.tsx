'use client'
const ARROW_PATH =
  'M4.11 12.75a.75.75 0 0 1 0-1.5h13.978l-5.036-5.036a.75.75 0 1 1 1.06-1.06l6.316 6.315.53.53-.53.53-6.316 6.317a.75.75 0 0 1-1.06-1.061l5.035-5.035H4.109Z'

const arrowIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path fill="#000" fillRule="evenodd" d={ARROW_PATH} clipRule="evenodd" />
  </svg>
)

export function MenuNewsletter() {
  return (
    <div className="rounded-2xl bg-white p-8">
      <h3 className="text-[2.375em] font-aeonik font-normal leading-tight text-black">
        <span className="block">Subscribe to</span>
        <span className="block">our newsletter</span>
      </h3>

      <div className="mt-6">
        <form
          className="flex items-center  gap-2 rounded-[1.125rem] bg-neutral-100 px-5 py-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            name="EMAIL"
            autoComplete="email"
            placeholder="Your email"
            className=" flex-1 bg-transparent text-[1.125em] text-[#f0f1fa] outline-none  placeholder:text-neutral-400"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="flex shrink-0 -translate-x-15 items-center justify-center "
          >
            {arrowIcon}
          </button>
        </form>
      </div>
    </div>
  )
}
