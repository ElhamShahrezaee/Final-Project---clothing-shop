import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  VisibilityIcon,
  VisibilityOffIcon,
} from "../../components/common/icons/MaterialEyeIcons";
import { useUserAuth } from "../../context/auth/useUserAuth";
import { useToast } from "../../context/toast/ToastContext";
import { getUserDisplayName } from "../../features/auth/utils/getUserDisplayName";
import { useAppLocale } from "../../hooks/useAppLocale";
import { buildRegisterPath, getSafeReturnUrl } from "../../lib/auth/returnUrl";
import { saveLoginCredential } from "../../lib/auth/saveLoginCredential";
import brandLogo from "../../assets/images/Logo-ELISHA-STOR.svg.png";
import AuthLanguageToggle from "../../components/common/AuthLanguageToggle";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useUserAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAppLocale();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));
  const registerPath = buildRegisterPath(returnUrl);

  const inputDir = isFa ? "rtl" : "ltr";
  const passwordPadding = isFa ? "pl-11" : "pr-11";
  const togglePosition = isFa ? "left-2" : "right-2";

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
      const loggedInUser = await login(trimmedEmail, password);
      await saveLoginCredential(trimmedEmail, password);

      const displayName = getUserDisplayName(
        loggedInUser.name,
        t("auth.defaultUser"),
      );
      showToast(t("auth.welcomeMessage", { name: displayName }));

      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(returnUrl, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir={dir}
      className={`relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 ${textAlign}`}
    >
      <AuthLanguageToggle />

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
          {t("auth.loginTitle")}
        </h1>
        <p className={`mt-2 text-sm text-gray-500 ${textAlign}`}>
          {t("auth.loginSubtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="user-email"
              className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}
            >
              {t("auth.email")}
            </label>
            <input
              id="user-email"
              name="username"
              type="email"
              inputMode="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-left"
            />
          </div>

          <div>
            <label
              htmlFor="user-password"
              className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}
            >
              {t("auth.password")}
            </label>
            <div className="relative flex items-center rounded-lg border border-gray-300 bg-white transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
              <input
                ref={passwordRef}
                id="user-password"
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
                  showPassword ? t("auth.hidePassword") : t("auth.showPassword")
                }
                aria-pressed={showPassword}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
            {isSubmitting ? t("auth.submitting") : t("auth.submit")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link
            to={registerPath}
            className="inline-block font-medium text-gray-900 underline-offset-2 hover:underline"
          >
            {t("auth.registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
