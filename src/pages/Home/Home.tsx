import ProductList from "../../components/product/ProductList/ProductList";
import { useTranslation } from "react-i18next";
import { useAppLocale } from "../../hooks/useAppLocale";

const Home = () => {
  const { t } = useTranslation();
  const { dir, textAlign } = useAppLocale();

  return (
    <div dir={dir} className={`space-y-10 ${textAlign}`}>
      <section className="mx-auto flex h-[70vh] max-w-6xl items-end bg-black p-10 text-white">
        <div>
          <h1 className="text-5xl font-light tracking-wide">{t("home.heroTitle")}</h1>
          <p className="mt-3 text-gray-300">{t("home.heroSubtitle")}</p>
        </div>
      </section>

      <section className="w-full">
        <h2
          className={`mb-4 px-4 text-2xl font-light tracking-wide lg:px-[50px] ${textAlign}`}
        >
          {t("home.featuredTitle")}
        </h2>

        <ProductList />
      </section>
    </div>
  );
};

export default Home;
