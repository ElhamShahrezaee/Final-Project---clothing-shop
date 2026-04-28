import { useLocation } from "react-router-dom";

const Products = () => {
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const search = query.get("search");

  return (
    <div>
      <h1>صفحه محصولات</h1>
      {search && <p>نتیجه جستجو برای: {search}</p>}
    </div>
  );
};

export default Products;
