import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppLocale } from "../../../hooks/useAppLocale";

const NEW_COLLECTION_IMAGE = "/images/categories/newcollection.png";

export default function HomeNewCollectionBanner() {
  const { t } = useTranslation();
  const { dir, textAlign } = useAppLocale();
  const searchQuery = t("home.newCollectionSearch");

  return (
    <section dir={dir} className="w-full">
      <h2
        className={`mb-4 px-4 text-2xl font-light tracking-wide lg:px-[50px] ${textAlign}`}
      >
        {t("home.newCollectionTitle")}
      </h2>

      <Link
        to={`/products?search=${encodeURIComponent(searchQuery)}`}
        className="block w-full overflow-hidden"
        aria-label={searchQuery}
      >
        <div className="h-[50vh] min-h-[280px] max-h-[420px] sm:h-[calc(100dvh-6.5rem)] sm:max-h-none sm:min-h-0">
          <img
            src={NEW_COLLECTION_IMAGE}
            alt={searchQuery}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </Link>
    </section>
  );
}
