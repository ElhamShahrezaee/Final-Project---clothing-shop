import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductList from "../../components/product/ProductList/ProductList";

const Products = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const query = new URLSearchParams(location.search);
  const search = query.get("search");

  return (
    <div>
      <h1>{t("products.title")}</h1>
      {search && (
        <p>
          {t("products.searchResultFor")} {search}
        </p>
      )}

      <div className="mt-6">
        <ProductList search={search} />
      </div>
    </div>
  );
};

export default Products;
