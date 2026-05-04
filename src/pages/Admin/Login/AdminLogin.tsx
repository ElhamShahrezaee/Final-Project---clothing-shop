import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth/useAuth";
import { useAdminLocale } from "../../../hooks/useAdminLocale";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { isFa, dir, textAlign } = useAdminLocale();
  const navigate = useNavigate();
  const location = useLocation();

  const inputDir = isFa ? "rtl" : "ltr";
  const passwordPadding = isFa ? "pl-12" : "pr-12";
  const togglePosition = isFa ? "left-0" : "right-0";

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/admin/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ورود");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir={dir}
      className={`flex min-h-screen items-center justify-center bg-gray-50 px-4 ${textAlign}`}
    >
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className={`text-2xl font-semibold text-gray-900 ${textAlign}`}>
          ورود به پنل ادمین
        </h1>
        <p className={`mt-2 text-sm text-gray-500 ${textAlign}`}>
          با حساب ادمین وارد شوید
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}
            >
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir={inputDir}
              className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 ${textAlign}`}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`mb-1.5 block text-sm font-medium text-gray-700 ${textAlign}`}
            >
              رمز عبور
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir={inputDir}
                className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 ${passwordPadding} ${textAlign}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute inset-y-0 ${togglePosition} px-3 text-xs text-gray-500 hover:text-gray-900`}
                aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
              >
                {showPassword ? "مخفی" : "نمایش"}
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
            {isSubmitting ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}
