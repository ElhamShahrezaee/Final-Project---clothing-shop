import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { formatStorePrice } from "../../../features/products/utils/formatStorePrice";
import { formatCount } from "../../../lib/formatCount";
import { useAppLocale } from "../../../hooks/useAppLocale";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { buildLoginPath } from "../../../lib/auth/returnUrl";
import { useCartQuery } from "../../../features/cart/queries/useCartQuery";
import { useUpdateCartItemMutation } from "../../../features/cart/mutations/useUpdateCartItemMutation";
import { useRemoveCartItemMutation } from "../../../features/cart/mutations/useRemoveCartItemMutation";
import { useClearCartMutation } from "../../../features/cart/mutations/useClearCartMutation";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

type MiniCartPopoverProps = {
  open: boolean;
  onClose: () => void;
};

export default function MiniCartPopover({ open, onClose }: MiniCartPopoverProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isFa } = useAppLocale();
  const { isAuthenticated } = useUserAuth();
  const { data: cart } = useCartQuery();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();
  const clearMutation = useClearCartMutation();

  if (!open) return null;

  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;
  const rowDirClass = isFa ? "flex-row-reverse" : "flex-row";

  const goCheckout = () => {
    onClose();
    if (isAuthenticated) {
      navigate("/cart");
      return;
    }
    if (location.pathname === "/cart") {
      navigate(buildLoginPath("/cart"));
      return;
    }
    const returnPath = `${location.pathname}${location.search}`;
    const sep = returnPath.includes("?") ? "&" : "?";
    navigate(buildLoginPath(`${returnPath}${sep}cart=1`));
  };

  return (
    <div
      role="dialog"
      aria-label={t("cart.miniCart.title")}
      dir={isFa ? "ltr" : "rtl"}
      className="absolute left-0 top-full z-50 mt-2 w-[22rem] rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
    >
      <div className={`mb-2 flex items-center justify-between ${isFa ? "flex-row-reverse" : "flex-row"}`}>
        <div className="text-sm font-semibold text-gray-900">{t("cart.miniCart.title")}</div>
        <button
          type="button"
          className="text-xs font-medium text-red-700 transition hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => clearMutation.mutate()}
          disabled={clearMutation.isPending || items.length === 0}
        >
          {t("cart.miniCart.clear")}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center text-sm text-gray-600">{t("cart.miniCart.empty")}</div>
      ) : (
        <>
          <div className="max-h-72 overflow-auto pe-1">
            {items.map((item) => {
              const img = item.product.images?.[0];
              const stock = item.product.stock ?? Infinity;
              const canInc = item.quantity < stock;

              return (
                <div key={item.id} className={`flex items-center gap-3 rounded-lg py-2 ${rowDirClass}`}>
                  {img ? (
                    <img
                      src={img}
                      alt={item.product.name}
                      className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 bg-gray-50" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">{item.product.name}</div>
                    <div className="mt-0.5 text-xs text-gray-600">{formatStorePrice(item.product.price, isFa)}</div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        const next = item.quantity - 1;
                        if (next <= 0) {
                          removeMutation.mutate({ cartItemId: item.id });
                        } else {
                          updateMutation.mutate({ cartItemId: item.id, quantity: next });
                        }
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-xl font-semibold leading-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={removeMutation.isPending || updateMutation.isPending}
                      aria-label={t("productDetails.decreaseQuantity")}
                    >
                      {item.quantity === 1 ? (
                        <DeleteOutlineOutlinedIcon fontSize="inherit" />
                      ) : (
                        "-"
                      )}
                    </button>

                    <span className="min-w-[2.5rem] text-center text-sm font-semibold text-gray-900">
                      {formatCount(item.quantity, isFa)}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateMutation.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-xl font-semibold leading-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={!canInc || updateMutation.isPending}
                      aria-label={t("productDetails.increaseQuantity")}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={goCheckout}
              className="inline-flex h-10 items-center justify-center rounded-full border border-gray-900 px-4 text-sm font-medium transition hover:bg-gray-900 hover:text-white"
            >
              {t("cart.miniCart.checkout")}
            </button>
            <div className="text-sm font-semibold text-gray-900">
              {t("cart.miniCart.total")}: {formatStorePrice(totalPrice, isFa)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
