import type { TFunction } from "i18next";

export type RegisterFormValues = {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const PHONE_PATTERN = /^\d{11}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validateRegisterForm(values: RegisterFormValues, t: TFunction): string | null {
  if (!values.name.trim()) return t("auth.validation.nameRequired");

  const phone = values.phone.trim();
  if (!phone) return t("auth.validation.phoneRequired");
  if (!PHONE_PATTERN.test(phone)) return t("auth.validation.phoneInvalid");

  if (!values.email.trim()) return t("auth.validation.emailRequired");

  if (!values.password) return t("auth.validation.passwordRequired");
  if (!PASSWORD_PATTERN.test(values.password)) {
    return t("auth.validation.passwordRules");
  }

  if (!values.confirmPassword) return t("auth.validation.confirmPasswordRequired");
  if (values.password !== values.confirmPassword) {
    return t("auth.validation.passwordMismatch");
  }

  return null;
}
