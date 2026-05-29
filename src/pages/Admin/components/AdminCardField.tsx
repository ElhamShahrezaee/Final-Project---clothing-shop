import type { ReactNode } from "react";

type AdminCardFieldProps = {
  label: string;
  children: ReactNode;
  valueDir?: "ltr" | "rtl";
};

export default function AdminCardField({ label, children, valueDir }: AdminCardFieldProps) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span
        className="min-w-0 text-end font-medium text-gray-900"
        dir={valueDir}
      >
        {children}
      </span>
    </div>
  );
}
