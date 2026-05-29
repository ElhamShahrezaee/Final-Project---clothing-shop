import { useTranslation } from "react-i18next";
import Spinner from "../common/Spinner/Spinner";
import { useProfileQuery } from "../../features/profile/queries/useProfileQuery";
import { getSelectedShippingAddress } from "../../lib/checkout/shippingAddressStorage";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-5 sm:p-6";

export default function ShippingAddressDisplay() {
  const { t } = useTranslation();
  const { data: profile, isPending } = useProfileQuery();

  if (isPending) {
    return (
      <div className="flex min-h-[8rem] items-center justify-center rounded-xl border border-gray-200 bg-white">
        <Spinner size="md" />
      </div>
    );
  }

  const shipping = getSelectedShippingAddress(profile);

  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold text-gray-900">{t("cart.checkout.shippingAddress")}</h2>
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        {shipping ? (
          <div className="space-y-1 text-sm text-gray-800">
            <p className="font-medium text-gray-900">{shipping.name}</p>
            <p>{shipping.phone}</p>
            <p className="whitespace-pre-wrap">{shipping.address}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">{t("cart.checkout.noAddress")}</p>
        )}
      </div>
    </section>
  );
}
