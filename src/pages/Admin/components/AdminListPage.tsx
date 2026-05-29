import type { ReactNode } from "react";

type AdminListPageProps = {
  title: string;
  description: string;
  filters: ReactNode;
  table: ReactNode;
  pagination?: ReactNode;
  textAlign?: string;
};

export default function AdminListPage({
  title,
  description,
  filters,
  table,
  pagination,
  textAlign = "",
}: AdminListPageProps) {
  return (
    <div className={`space-y-4 ${textAlign}`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">{filters}</div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {table}
        {pagination ? (
          <div className="border-t border-gray-200 px-4 py-3">{pagination}</div>
        ) : null}
      </div>
    </div>
  );
}
