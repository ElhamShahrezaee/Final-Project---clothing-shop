import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useTranslation } from "react-i18next";
import { formatCount } from "../../../lib/formatCount";

type CartQuantityControlProps = {
  quantity: number;
  stock: number;
  isFa: boolean;
  disabled?: boolean;
  reverseButtons?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function CartQuantityControl({
  quantity,
  stock,
  isFa,
  disabled,
  reverseButtons,
  onDecrease,
  onIncrease,
}: CartQuantityControlProps) {
  const { t } = useTranslation();
  const canIncrease = quantity < stock;

  const decreaseButton = (
    <button
      type="button"
      onClick={onDecrease}
      disabled={disabled}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 text-xl font-semibold leading-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={t("productDetails.decreaseQuantity")}
    >
      {quantity === 1 ? <DeleteOutlineOutlinedIcon fontSize="inherit" /> : "-"}
    </button>
  );

  const increaseButton = (
    <button
      type="button"
      onClick={onIncrease}
      disabled={disabled || !canIncrease}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 text-xl font-semibold leading-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={t("productDetails.increaseQuantity")}
    >
      +
    </button>
  );

  const quantityLabel = (
    <span className="min-w-[3rem] text-center text-lg font-semibold text-gray-900">
      {formatCount(quantity, isFa)}
    </span>
  );

  return (
    <div className="flex items-center justify-center gap-2">
      {reverseButtons ? (
        <>
          {increaseButton}
          {quantityLabel}
          {decreaseButton}
        </>
      ) : (
        <>
          {decreaseButton}
          {quantityLabel}
          {increaseButton}
        </>
      )}
    </div>
  );
}
