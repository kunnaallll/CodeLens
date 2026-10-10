import { useCallback } from "react";
export function useToast() {
  const notify = useCallback((message, type = "info") => {
    window.dispatchEvent(new CustomEvent("codelens:toast", { detail: { message, type } }));
  }, []);
  return { success: (m) => notify(m, "success"), error: (m) => notify(m, "error"), info: (m) => notify(m, "info") };
}
