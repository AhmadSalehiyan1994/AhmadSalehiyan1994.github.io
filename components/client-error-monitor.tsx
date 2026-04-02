"use client";

import { useEffect } from "react";

export function ClientErrorMonitor() {
  useEffect(() => {
    const sendError = (payload: Record<string, unknown>) => {
      const body = JSON.stringify({
        ...payload,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      navigator.sendBeacon("/api/client-errors", body);
    };

    const onError = (event: ErrorEvent) => {
      sendError({
        type: "error",
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      sendError({
        type: "unhandledrejection",
        message:
          typeof event.reason === "string"
            ? event.reason
            : event.reason?.message || "Unhandled promise rejection",
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
