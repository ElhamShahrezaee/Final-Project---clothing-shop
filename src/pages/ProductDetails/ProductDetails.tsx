import { useParams } from "react-router-dom";
import { useAppLocale } from "../../hooks/useAppLocale";

const ProductDetails = () => {
  const { id } = useParams();
  const { isFa, dir, textAlign } = useAppLocale();

  return (
    <div dir={dir} className={`px-4 ${textAlign}`}>
      <h1 className="text-2xl font-light">
        {isFa ? "صفحه محصول" : "Product page"}
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        {isFa ? "شناسه محصول:" : "Product ID:"}{" "}
        <span className="font-mono" dir="ltr">
          {id}
        </span>
      </p>
    </div>
  );
};

export default ProductDetails;
