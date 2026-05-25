import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppLocale } from "../../hooks/useAppLocale";

export default function Register() {
  const { t } = useTranslation();
  const { dir, textAlign } = useAppLocale();

  return (
    <div
      dir={dir}
      className={`flex min-h-screen items-center justify-center bg-gray-50 px-4 ${textAlign}`}
    >
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">{t("auth.registerLink")}</h1>
        <p className="mt-3 text-sm text-gray-600">
          {t("auth.loginSubtitle")}
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block text-sm font-medium text-gray-900 underline-offset-2 hover:underline"
        >
          {t("auth.loginTitle")}
        </Link>
      </div>
    </div>
  );
}
