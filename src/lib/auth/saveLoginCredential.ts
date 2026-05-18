type PasswordCredentialCtor = new (data: {
  id: string;
  password: string;
}) => Credential;

function getPasswordCredentialCtor(): PasswordCredentialCtor | undefined {
  return (
    globalThis as typeof globalThis & {
      PasswordCredential?: PasswordCredentialCtor;
    }
  ).PasswordCredential;
}

/**
 * Prompts the browser (Chrome, Edge, etc.) to save login credentials after SPA login.
 * Requires a secure context (HTTPS or localhost).
 */
export async function saveLoginCredential(
  email: string,
  password: string,
): Promise<void> {
  if (!window.isSecureContext) return;

  const PasswordCredentialClass = getPasswordCredentialCtor();
  if (!("credentials" in navigator) || !PasswordCredentialClass) {
    return;
  }

  try {
    await navigator.credentials.store(
      new PasswordCredentialClass({
        id: email,
        password,
      }),
    );
  } catch {
    // User dismissed the prompt or the browser blocked storage.
  }
}
