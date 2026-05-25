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
import { validateRegisterForm } from "../../features/auth/utils/validateRegisterForm";
import { useAppLocale } from "../../hooks/useAppLocale";
import { buildLoginPath, getSafeReturnUrl } from "../../lib/auth/returnUrl";
import brandLogo from "../../assets/images/Logo-ELISHA-STOR.svg.png";
import AuthLanguageToggle from "../../components/common/AuthLanguageToggle";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { register } = useUserAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAppLocale();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));
  const loginPath = buildLoginPath(returnUrl);

  const inputDir = isFa ? "rtl" : "ltr";
  const passwordPadding = isFa ? "pl-11" : "pr-11";
  const togglePosition = isFa ? "left-2" : "right-2";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const values = { name, phone, email, password, confirmPassword };
    const validationError = validateRegisterForm(values, t);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    if (passwordRef.current) passwordRef.current.type = "password";
    if (confirmPasswordRef.current) confirmPasswordRef.current.type = "password";

    try {
      const registeredUser = await register({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
      });

      const displayName = getUserDisplayName(
        registeredUser.name || name.trim(),
        t("auth.defaultUser"),
      );
      showToast(t("auth.welcomeMessage", { name: displayName }));

      if (registeredUser.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(returnUrl, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.registerError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value.replace(/\D/g, "").slice(0, 11));
  };

  return (
    <div
      dir={dir}
      className={`relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 ${textAlign}`}
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
          {t("auth.registerTitle")}
        </h1>
        <p className={`mt-2 text-sm text-gray-500 ${textAlign}`}>
          {t("auth.registerSubtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="register-name" className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}>
              {t("auth.name")}
            </label>
            <input
              id="register-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="register-phone" className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}>
              {t("auth.phone")}
            </label>
            <input
              id="register-phone"
              type="tel"
              inputMode="numeric"
              required
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              dir="ltr"
              maxLength={11}
              className={`${inputClass} text-left`}
            />
          </div>

          <div>
            <label htmlFor="register-email" className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}>
              {t("auth.email")}
            </label>
            <input
              id="register-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className={`${inputClass} text-left`}
            />
          </div>

          <div>
            <label htmlFor="register-password" className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}>
              {t("auth.password")}
            </label>
            <div className="relative flex items-center rounded-lg border border-gray-300 bg-white transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
              <input
                ref={passwordRef}
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir={inputDir}
                className={`w-full border-0 bg-transparent px-4 py-2.5 text-sm outline-none ring-0 focus:ring-0 ${passwordPadding}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute top-1/2 ${togglePosition} z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100`}
                aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="register-confirm-password"
              className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}
            >
              {t("auth.confirmPassword")}
            </label>
            <div className="relative flex items-center rounded-lg border border-gray-300 bg-white transition focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
              <input
                ref={confirmPasswordRef}
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                dir={inputDir}
                className={`w-full border-0 bg-transparent px-4 py-2.5 text-sm outline-none ring-0 focus:ring-0 ${passwordPadding}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className={`absolute top-1/2 ${togglePosition} z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100`}
                aria-label={
                  showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")
                }
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          {error && (
            <p className={`rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ${textAlign}`} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? t("auth.registerSubmitting") : t("auth.registerSubmit")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t("auth.hasAccount")}{" "}
          <Link
            to={loginPath}
            className="inline-block font-medium text-gray-900 underline-offset-2 hover:underline"
          >
            {t("auth.loginTitle")}
          </Link>
        </p>
      </div>
    </div>
  );
}
