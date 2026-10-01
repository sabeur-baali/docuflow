import type { DocumentData, DocumentType, LineItem } from "../types";

export const DOCUMENT_LABELS: Record<DocumentType, { title: string; prefix: string }> = {
  invoice: { title: "Invoice", prefix: "INV" },
  quotation: { title: "Quotation", prefix: "QUO" },
  receipt: { title: "Receipt", prefix: "REC" },
};

export const newItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0,
});

export const createEmptyDocument = (): DocumentData => ({
  type: "invoice",
  number: "0001",
  date: new Date().toISOString().slice(0, 10),
  businessName: "Your Business Name",
  customer: { name: "", email: "", address: "" },
  items: [newItem()],
  discountPercent: 0,
  taxPercent: 0,
  notes: "",
});
