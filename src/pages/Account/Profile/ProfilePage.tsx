import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  VisibilityIcon,
  VisibilityOffIcon,
} from "../../../components/common/icons/MaterialEyeIcons";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useToast } from "../../../context/toast/ToastContext";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { useUpdateProfileMutation } from "../../../features/profile/mutations/useUpdateProfileMutation";
import { useUpdateProfilePasswordMutation } from "../../../features/profile/mutations/useUpdateProfilePasswordMutation";
import { useProfileQuery } from "../../../features/profile/queries/useProfileQuery";
import { profileToUser } from "../../../features/profile/utils/profileToUser";
import { useAppLocale } from "../../../hooks/useAppLocale";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const readOnlyInputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

const PHONE_PATTERN = /^\d{11}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function ProfilePage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { syncStoreUser } = useUserAuth();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: profile, isPending, isError, refetch } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const updatePasswordMutation = useUpdateProfilePasswordMutation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const inputDir = isFa ? "rtl" : "ltr";
  const passwordPadding = isFa ? "pl-11" : "pr-11";
  const togglePosition = isFa ? "left-2" : "right-2";

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setPhone(profile.phone ?? "");
    setEmail(profile.email);
  }, [profile]);

  const validateProfileFields = (): string | null => {
    if (!name.trim()) return t("auth.validation.nameRequired");
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) return t("auth.validation.phoneRequired");
    if (!PHONE_PATTERN.test(trimmedPhone)) return t("auth.validation.phoneInvalid");
    return null;
  };

  const validatePasswordFields = (): string | null => {
    if (!currentPassword) return t("profile.validation.currentPasswordRequired");
    if (!newPassword) return t("auth.validation.passwordRequired");
    if (!confirmNewPassword) return t("auth.validation.confirmPasswordRequired");
    if (newPassword !== confirmNewPassword) return t("auth.validation.passwordMismatch");
    if (!PASSWORD_PATTERN.test(newPassword)) return t("auth.validation.passwordRules");
    return null;
  };

  const getPasswordMismatchError = (nextNew: string, nextConfirm: string): string | null => {
    if (!nextNew && !nextConfirm) return null;
    if (nextNew !== nextConfirm) return t("auth.validation.passwordMismatch");
    return null;
  };

  const syncPasswordMatchError = (nextNew: string, nextConfirm: string) => {
    setConfirmPasswordError(getPasswordMismatchError(nextNew, nextConfirm));
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError(null);

    const validationError = validateProfileFields();
    if (validationError) {
      setProfileError(validationError);
      return;
    }

    try {
      const updated = await updateProfileMutation.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
      });
      syncStoreUser(profileToUser(updated));
      showToast(t("profile.toast.profileSaved"));
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : t("profile.error.updateProfile"));
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);

    for (const ref of [currentPasswordRef, newPasswordRef, confirmPasswordRef]) {
      if (ref.current) ref.current.type = "password";
    }
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setConfirmPasswordError(null);

    const validationError = validatePasswordFields();
    if (validationError) {
      if (newPassword !== confirmNewPassword) {
        setConfirmPasswordError(validationError);
      } else {
        setPasswordError(validationError);
      }
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setConfirmPasswordError(null);
      showToast(t("profile.toast.passwordSaved"));
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t("profile.error.updatePassword"));
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div dir={dir} className={`mx-auto max-w-2xl px-4 py-12 ${textAlign}`}>
        <p className="text-sm text-red-600" role="alert">
          {t("profile.error.load")}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-full border border-gray-900 px-5 py-2 text-sm font-medium transition hover:bg-gray-900 hover:text-white"
        >
          {t("profile.retry")}
        </button>
      </div>
    );
  }

  const renderPasswordField = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    onToggle: () => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
    options?: {
      onBlur?: () => void;
      fieldError?: string | null;
    },
  ) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type={show ? "text" : "password"}
          dir={inputDir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={options?.onBlur}
          autoComplete={id === "currentPassword" ? "current-password" : "new-password"}
          className={`${inputClass} ${passwordPadding}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className={`absolute top-1/2 -translate-y-1/2 ${togglePosition} text-gray-500 hover:text-gray-800`}
          aria-label={show ? t("auth.hidePassword") : t("auth.showPassword")}
        >
          {show ? (
            <VisibilityOffIcon className="h-5 w-5" />
          ) : (
            <VisibilityIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {options?.fieldError ? (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {options.fieldError}
        </p>
      ) : null}
    </div>
  );

  return (
    <div dir={dir} className={`mx-auto max-w-2xl px-4 py-8 sm:py-10 ${textAlign}`}>
      <h1 className="mb-8 text-2xl font-semibold text-gray-900 sm:text-3xl">
        {t("profile.title")}
      </h1>

      <div className="space-y-8">
        <section className={sectionClass} aria-labelledby="profile-info-heading">
          <h2 id="profile-info-heading" className="mb-1 text-lg font-semibold text-gray-900">
            {t("profile.sections.info")}
          </h2>
          <p className="mb-5 text-sm text-gray-500">{t("profile.sections.infoHint")}</p>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="profileName" className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("auth.name")}
              </label>
              <input
                id="profileName"
                type="text"
                dir={inputDir}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="profileEmail" className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("auth.email")}
              </label>
              <input
                id="profileEmail"
                type="email"
                value={email}
                readOnly
                tabIndex={-1}
                aria-readonly="true"
                className={readOnlyInputClass}
              />
            </div>

            <div>
              <label htmlFor="profilePhone" className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("auth.phone")}
              </label>
              <input
                id="profilePhone"
                type="tel"
                inputMode="numeric"
                dir={inputDir}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                className={inputClass}
                autoComplete="tel"
              />
            </div>

            {profileError ? (
              <p className="text-sm text-red-600" role="alert">
                {profileError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="inline-flex h-11 items-center justify-center rounded-full border border-gray-900 px-6 text-sm font-medium transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateProfileMutation.isPending
                ? t("profile.saving")
                : t("profile.saveProfile")}
            </button>
          </form>
        </section>

        <section className={sectionClass} aria-labelledby="profile-password-heading">
          <h2 id="profile-password-heading" className="mb-1 text-lg font-semibold text-gray-900">
            {t("profile.sections.password")}
          </h2>
          <p className="mb-5 text-sm text-gray-500">{t("profile.sections.passwordHint")}</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {renderPasswordField(
              "currentPassword",
              t("profile.currentPassword"),
              currentPassword,
              setCurrentPassword,
              showCurrentPassword,
              () => setShowCurrentPassword((v) => !v),
              currentPasswordRef,
            )}
            {renderPasswordField(
              "newPassword",
              t("profile.newPassword"),
              newPassword,
              (value) => {
                setNewPassword(value);
                setPasswordError(null);
                syncPasswordMatchError(value, confirmNewPassword);
              },
              showNewPassword,
              () => setShowNewPassword((v) => !v),
              newPasswordRef,
              {
                onBlur: () =>
                  syncPasswordMatchError(
                    newPasswordRef.current?.value ?? newPassword,
                    confirmPasswordRef.current?.value ?? confirmNewPassword,
                  ),
              },
            )}
            {renderPasswordField(
              "confirmNewPassword",
              t("profile.confirmNewPassword"),
              confirmNewPassword,
              (value) => {
                setConfirmNewPassword(value);
                setPasswordError(null);
                syncPasswordMatchError(newPassword, value);
              },
              showConfirmPassword,
              () => setShowConfirmPassword((v) => !v),
              confirmPasswordRef,
              {
                onBlur: () =>
                  syncPasswordMatchError(
                    newPasswordRef.current?.value ?? newPassword,
                    confirmPasswordRef.current?.value ?? confirmNewPassword,
                  ),
                fieldError: confirmPasswordError,
              },
            )}

            {passwordError ? (
              <p className="text-sm text-red-600" role="alert">
                {passwordError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              className="inline-flex h-11 items-center justify-center rounded-full border border-gray-900 px-6 text-sm font-medium transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updatePasswordMutation.isPending
                ? t("profile.changingPassword")
                : t("profile.changePassword")}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
