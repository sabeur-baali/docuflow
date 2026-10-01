export type DocumentType = "invoice" | "quotation" | "receipt";

export interface Customer {
  name: string;
  email: string;
  address: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface DocumentData {
  type: DocumentType;
  number: string;
  date: string;
  businessName: string;
  customer: Customer;
  items: LineItem[];
  discountPercent: number;
  taxPercent: number;
  notes: string;
}
