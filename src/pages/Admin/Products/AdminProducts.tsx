import { useAdminLocale } from "../../../hooks/useAdminLocale";

export default function AdminProducts() {
  const { textAlign } = useAdminLocale();

  return (
    <div className={textAlign}>
      <h1 className="text-2xl font-semibold text-gray-900">محصولات</h1>
      <p className="mt-2 text-sm text-gray-600">مدیریت محصولات فروشگاه</p>
    </div>
  );
}
