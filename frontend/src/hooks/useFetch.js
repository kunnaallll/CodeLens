import { useCallback, useEffect, useState } from "react";
export function useFetch(fetcher, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refetch = useCallback(() => {
    setLoading(true); setError("");
    return fetcher().then(setData).catch((err) => setError(err.message || "Unable to load data.")).finally(() => setLoading(false));
  }, [fetcher]);
  const dependencyKey = JSON.stringify(dependencies);
  useEffect(() => {
    fetcher().then(setData).catch((err) => setError(err.message || "Unable to load data.")).finally(() => setLoading(false));
    // The caller provides the inputs that should trigger a fresh request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependencyKey]);
  return { data, loading, error, refetch };
}
