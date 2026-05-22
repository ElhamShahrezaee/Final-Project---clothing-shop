import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  VisibilityIcon,
  VisibilityOffIcon,
} from "../../../components/common/icons/MaterialEyeIcons";
import { useAuth } from "../../../context/auth/useAuth";
import { useAdminLocale } from "../../../hooks/useAdminLocale";
import { saveLoginCredential } from "../../../lib/auth/saveLoginCredential";
import brandLogo from "../../../assets/images/Logo-ELISHA-STOR.svg.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAdminLocale();
  const navigate = useNavigate();
  const location = useLocation();

  const inputDir = isFa ? "rtl" : "ltr";
  const passwordPadding = isFa ? "pl-11" : "pr-11";
  const togglePosition = isFa ? "left-2" : "right-2";

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/admin/dashboard";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedEmail = email.trim();
    const passwordInput = passwordRef.current;
    if (passwordInput) {
      passwordInput.type = "password";
    }

    try {
      await login(trimmedEmail, password);
      await saveLoginCredential(trimmedEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.login.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir={dir}
      className={`flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 ${textAlign}`}
    >
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-8 flex shrink-0 items-center"
        aria-label={t("app.brand")}
      >
        <img
          src={brandLogo}
          alt={t("app.brand")}
          className="h-24 w-auto max-w-[min(90vw,28rem)] object-contain sm:h-32 sm:max-w-[32rem]"
        />
      </button>

      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className={`text-2xl font-semibold text-gray-900 ${textAlign}`}>
          {t("admin.login.title")}
        </h1>
        <p className={`mt-2 text-sm text-gray-500 ${textAlign}`}>
          {t("admin.login.subtitle")}
        </p>

        <form
          id="admin-login-form"
          name="admin-login"
          method="post"
          action="/admin/login"
          autoComplete="on"
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}
            >
              {t("admin.login.email")}
            </label>
            <input
              id="email"
              name="username"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-left`}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}
            >
              {t("admin.login.password")}
            </label>
            <div
              className={`relative flex items-center rounded-lg border border-gray-300 bg-white transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 ${textAlign}`}
            >
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir={inputDir}
                className={`w-full border-0 bg-transparent px-4 py-2.5 text-sm outline-none ring-0 focus:ring-0 ${passwordPadding}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute top-1/2 ${togglePosition} z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900`}
                aria-label={
                  showPassword ? t("admin.login.hidePassword") : t("admin.login.showPassword")
                }
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              className={`rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ${textAlign}`}
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? t("admin.login.submitting") : t("admin.login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
