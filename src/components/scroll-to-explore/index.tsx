export function ScrollToExplore() {
  return (
    <div className="flex items-center justify-between  w-full px-31 py-2.5 sm:px-24 lg:px-32">
      <PlusIcon />
      <PlusIcon />
      <span className="text-[1.3em] tracking-tight font-medium uppercase text-black select-none">
        Hover to explore
      </span>
      <PlusIcon />
      <PlusIcon />
    </div>
  )
}

function PlusIcon() {
  return (
    <div className="relative w-5 h-5">
      <div className="absolute left-1/2 top-0 bottom-0 w-px  bg-black -translate-x-1/2" />
      <div className="absolute top-1/2 left-0 right-0 h-px  bg-black -translate-y-1/2" />
    </div>
  )
}
