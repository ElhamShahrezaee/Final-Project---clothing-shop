import ProductList from "../../components/product/ProductList/ProductList";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-16">
      {/* Hero (luxury style) */}
      <section className="h-[70vh] flex items-end bg-black text-white p-10">
        <div>
          <h1 className="text-5xl font-light tracking-wide">{t("home.heroTitle")}</h1>
          <p className="mt-3 text-gray-300">{t("home.heroSubtitle")}</p>
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 className="text-2xl font-light mb-8 tracking-wide">
          {t("home.featuredTitle")}
        </h2>

        <ProductList />
      </section>
    </div>
  );
};

export default Home;
