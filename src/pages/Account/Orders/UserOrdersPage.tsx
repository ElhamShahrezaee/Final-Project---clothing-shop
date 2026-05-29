import { useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useUserOrdersQuery } from "../../../features/orders/queries/useUserOrdersQuery";
import { useAppLocale } from "../../../hooks/useAppLocale";
import OrderListItem from "./components/OrderListItem";
import UserOrdersPagination from "./components/UserOrdersPagination";

export default function UserOrdersPage() {
  const { t } = useTranslation();
  const { dir, textAlign } = useAppLocale();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isPending, isError, refetch } = useUserOrdersQuery({ page, limit });

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  return (
    <div dir={dir} className={`mx-auto max-w-3xl px-4 py-10 ${textAlign}`}>
      <h1 className="text-2xl font-semibold text-gray-900">{t("auth.account.ordersTitle")}</h1>
      <p className="mt-1 text-sm text-gray-600">{t("account.orders.subtitle")}</p>

      <div className="mt-8">
        {isPending && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-800">{t("account.orders.loadError")}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm text-red-800 hover:bg-red-100"
            >
              {t("account.orders.retry")}
            </button>
          </div>
        )}

        {!isPending && !isError && data && (
          <>
            {data.orders.length === 0 ? (
              <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                {t("account.orders.empty")}
              </p>
            ) : (
              <ul className="space-y-3">
                {data.orders.map((order) => (
                  <li key={order.id}>
                    <OrderListItem order={order} />
                  </li>
                ))}
              </ul>
            )}

            {data.pagination.total > 0 && (
              <div className="mt-6">
                <UserOrdersPagination
                  page={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  total={data.pagination.total}
                  limit={data.pagination.limit}
                  onPageChange={setPage}
                  onLimitChange={handleLimitChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
