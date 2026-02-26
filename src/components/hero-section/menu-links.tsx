"use client";

const LINKS = [
  { label: "HOME", href: "/", active: true },
  { label: "ABOUT US", href: "/about", active: false },
  { label: "PROJECTS", href: "/projects", active: false },
  { label: "CONTACT", href: "/contact", active: false },
] as const;

const activeDot = <span className="h-2 w-2 rounded-full bg-neutral-900" />;

export function MenuLinks() {
  return (
    <div className="rounded-2xl bg-white p-8">
      <nav className="flex flex-col gap-5">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-aeonik font-normal flex items-center justify-between text-[1.625em]  tracking-wide text-neutral-900 uppercase"
          >
            <span>{link.label}</span>
            {link.active ? activeDot : null}
          </a>
        ))}
      </nav>
    </div>
  );
}
