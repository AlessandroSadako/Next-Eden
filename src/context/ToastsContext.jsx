import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastsContext = createContext({
  notify: (_msg) => {},
  success: (_text) => {},
  info: (_text) => {},
  error: (_text) => {},
});

export function ToastsProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (msg) => {
      const id = Math.random().toString(36).slice(2);
      const toast = {
        id,
        type: msg.type || "info",
        text: msg.text || String(msg) || "",
        timeout: msg.timeout ?? 2500,
      };
      setToasts((list) => [...list, toast]);
      if (toast.timeout > 0) {
        setTimeout(() => remove(id), toast.timeout);
      }
    },
    [remove]
  );

  const success = useCallback(
    (text, timeout) => notify({ type: "success", text, timeout }),
    [notify]
  );
  const info = useCallback(
    (text, timeout) => notify({ type: "info", text, timeout }),
    [notify]
  );
  const error = useCallback(
    (text, timeout) => notify({ type: "error", text, timeout }),
    [notify]
  );

  const value = useMemo(
    () => ({ notify, success, info, error }),
    [notify, success, info, error]
  );

  return (
    <ToastsContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastsContext.Provider>
  );
}

export const useToasts = () => useContext(ToastsContext);

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="toasts-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-eden toast-eden--${t.type}`}
          role="status"
        >
          <div className="toast-eden__icon" aria-hidden>
            {t.type === "success" && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l12-12-1.5-1.5z" />
              </svg>
            )}
            {t.type === "info" && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11 17h2v-6h-2v6zm0-8h2V7h-2v2z" />
              </svg>
            )}
            {t.type === "error" && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            )}
          </div>
          <div className="toast-eden__text">{t.text}</div>
          <button
            className="toast-eden__close"
            onClick={() => onClose(t.id)}
            aria-label="Chiudi notifica"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
