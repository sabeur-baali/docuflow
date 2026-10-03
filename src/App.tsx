import { useEffect, useState } from "react";
import type { DocumentData } from "./types";
import { createEmptyDocument } from "./utils/defaults";
import { exportPdf } from "./utils/pdf";
import { trackDocumentCreated, trackPdfDownload } from "./utils/analytics";
import DocumentForm from "./components/DocumentForm";
import DocumentPreview from "./components/DocumentPreview";
const STORAGE_KEY = "docuflow:draft";

function loadDraft(): DocumentData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as DocumentData;
  } catch {
    // ignore corrupted data and start fresh
  }
  return createEmptyDocument();
}

export default function App() {
  const [doc, setDoc] = useState<DocumentData>(loadDraft);
  const [view, setView] = useState<"edit" | "preview">("edit");

  // Save automatically every time the document changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
  }, [doc]);

  const startNew = () => {
    if (confirm("Start a new document? The current draft will be replaced.")) {
      setDoc(createEmptyDocument());
    }
  };
const handleDownload = () => {
  exportPdf(doc);
  trackDocumentCreated(doc.type);
  trackPdfDownload(doc.type);
};
  const tabClass = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
      active ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-xl font-bold text-indigo-600">DocuFlow</h1>
          <div className="flex gap-2">
            <button onClick={startNew}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50">
              New
            </button>
            <button onClick={handleDownload}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-4 lg:hidden">
        <div className="flex gap-2">
          <button className={tabClass(view === "edit")} onClick={() => setView("edit")}>Edit</button>
          <button className={tabClass(view === "preview")} onClick={() => setView("preview")}>Preview</button>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-2">
        <div className={view === "edit" ? "" : "hidden lg:block"}>
          <DocumentForm data={doc} onChange={setDoc} />
        </div>
        <div className={view === "preview" ? "" : "hidden lg:block"}>
          <div className="lg:sticky lg:top-20">
            <DocumentPreview data={doc} />
          </div>
        </div>
      </main>
    </div>
  );
}
