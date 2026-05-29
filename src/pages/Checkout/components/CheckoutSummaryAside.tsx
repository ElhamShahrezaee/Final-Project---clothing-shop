import { formatStorePrice } from "../../../features/products/utils/formatStorePrice";

type CheckoutSummaryAsideProps = {
  totalPrice: number;
  isFa: boolean;
  grandTotalLabel: string;
  buttonLabel: string;
  onAction: () => void;
  disabled?: boolean;
};

export default function CheckoutSummaryAside({
  totalPrice,
  isFa,
  grandTotalLabel,
  buttonLabel,
  onAction,
  disabled,
}: CheckoutSummaryAsideProps) {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-5 text-center lg:sticky lg:top-28">
      <p className="text-lg font-semibold text-gray-900">{grandTotalLabel}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">
        {formatStorePrice(totalPrice, isFa)}
      </p>
      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className="mt-6 w-full rounded-full border border-gray-900 px-4 py-3 text-sm font-medium transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </aside>
  );
}
