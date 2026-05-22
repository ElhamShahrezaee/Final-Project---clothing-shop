import { useState, type ReactNode } from "react";

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-5 text-left text-sm font-medium tracking-wide text-gray-900 sm:px-8 lg:px-12"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="text-lg leading-none text-gray-500" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t px-4 pb-6 pt-4 text-sm leading-relaxed text-gray-700 sm:px-8 lg:px-12">
          {children}
        </div>
      )}
    </section>
  );
}
