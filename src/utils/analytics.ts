import type { DocumentType } from "../types";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

// Actif seulement en production et si l'ID existe (les tests locaux ne sont pas comptés)
const enabled = import.meta.env.PROD && Boolean(MEASUREMENT_ID);

export function initAnalytics() {
  if (!enabled) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js exige d'envoyer l'objet "arguments", pas un tableau
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function trackEvent(name: string, params: Record<string, string> = {}) {
  if (!enabled || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

// Événements: invoice_created, quotation_created, receipt_created
export function trackDocumentCreated(type: DocumentType) {
  trackEvent(`${type}_created`, { document_type: type });
}

export function trackPdfDownload(type: DocumentType) {
  trackEvent("pdf_download", { document_type: type });
}
