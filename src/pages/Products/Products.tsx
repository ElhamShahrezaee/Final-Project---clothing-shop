import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductList from "../../components/product/ProductList/ProductList";
import { useAppLocale } from "../../hooks/useAppLocale";

const Products = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { dir, textAlign } = useAppLocale();

  const query = new URLSearchParams(location.search);
  const search = query.get("search");

  return (
    <div dir={dir} className={textAlign}>
      <div className="px-4 lg:px-[50px]">
        <h1>{t("products.title")}</h1>
        {search && (
          <p>
            {t("products.searchResultFor")} {search}
          </p>
        )}
      </div>

      <div className="mt-4">
        <ProductList search={search} />
      </div>
    </div>
  );
};

export default Products;
