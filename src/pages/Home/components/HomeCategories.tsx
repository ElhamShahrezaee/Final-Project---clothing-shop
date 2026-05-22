import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppLocale } from "../../../hooks/useAppLocale";

const CATEGORIES = [
  { category: "کفش", image: "/images/categories/shoe.jpg", labelKey: "shoes" },
  { category: "کیف", image: "/images/categories/kifs.jpg", labelKey: "bags" },
  { category: "لباس", image: "/images/categories/cloth.jpg", labelKey: "clothes" },
  {
    category: "اکسسوری",
    image: "/images/categories/accessories.jpg",
    labelKey: "accessories",
  },
] as const;

export default function HomeCategories() {
  const { t } = useTranslation();
  const { dir, textAlign } = useAppLocale();

  return (
    <section dir={dir} className="w-full py-10">
      <h2
        className={`mb-6 px-4 text-2xl font-light tracking-wide lg:px-[50px] ${textAlign}`}
      >
        {t("home.categoriesTitle")}
      </h2>

      <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 lg:px-[50px]">
        {CATEGORIES.map((category) => (
          <Link
            key={category.category}
            to={`/products?category=${encodeURIComponent(category.category)}`}
            className="group flex flex-col items-center"
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
              <img
                src={category.image}
                alt={t(`home.categories.${category.labelKey}`)}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <span className="mt-3 w-full text-center text-sm font-medium tracking-wide text-gray-900 sm:text-base">
              {t(`home.categories.${category.labelKey}`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
