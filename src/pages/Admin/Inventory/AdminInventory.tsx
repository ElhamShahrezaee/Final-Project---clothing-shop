import { useAdminLocale } from "../../../hooks/useAdminLocale";

export default function AdminInventory() {
  const { textAlign } = useAdminLocale();

  return (
    <div className={textAlign}>
      <h1 className="text-2xl font-semibold text-gray-900">موجودی / قیمت</h1>
      <p className="mt-2 text-sm text-gray-600">مدیریت موجودی و قیمت محصولات</p>
    </div>
  );
}

