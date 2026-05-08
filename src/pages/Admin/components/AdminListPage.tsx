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
    <div className={`flex h-full min-h-0 flex-col gap-4 ${textAlign}`}>
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>

      <div className="shrink-0 rounded-xl border border-gray-200 bg-white p-4">{filters}</div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="min-h-0 flex-1 overflow-hidden">{table}</div>
        {pagination && (
          <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
            {pagination}
          </div>
        )}
      </div>
    </div>
  );
}
