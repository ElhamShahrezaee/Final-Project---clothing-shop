import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAppLocale } from "../../hooks/useAppLocale";

type ToastItem = {
  id: number;
  message: string;
};

type ToastContextValue = {
  showToast: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { isFa, dir, textAlign } = useAppLocale();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, durationMs = DEFAULT_DURATION_MS) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className={[
          "pointer-events-none fixed bottom-6 z-[60] flex flex-col gap-2 px-4",
          isFa ? "right-0 items-end" : "left-0 items-start",
        ].join(" ")}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            dir={dir}
            className={[
              "pointer-events-auto max-w-sm rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-900 shadow-md",
              textAlign,
            ].join(" ")}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
