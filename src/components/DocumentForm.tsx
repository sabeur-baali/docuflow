import type { DocumentData, DocumentType, LineItem } from "../types";
import { DOCUMENT_LABELS, newItem } from "../utils/defaults";
import { formatMoney } from "../utils/calculations";

interface Props {
  data: DocumentData;
  onChange: (data: DocumentData) => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";
const labelClass = "mb-1 block text-xs font-medium text-slate-600";
const cardClass = "rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200";

export default function DocumentForm({ data, onChange }: Props) {
  // Update one top-level field of the document
  const update = <K extends keyof DocumentData>(key: K, value: DocumentData[K]) =>
    onChange({ ...data, [key]: value });

  // Update one line item (found by its id)
  const updateItem = (id: string, patch: Partial<LineItem>) =>
    update(
      "items",
      data.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );

  const removeItem = (id: string) =>
    update("items", data.items.filter((item) => item.id !== id));

  return (
    <div className="space-y-6">
      {/* Document details */}
      <section className={cardClass}>
        <h2 className="mb-4 font-semibold text-slate-800">Document details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Type</label>
            <select
              className={inputClass}
              value={data.type}
              onChange={(e) => update("type", e.target.value as DocumentType)}
            >
              {(Object.keys(DOCUMENT_LABELS) as DocumentType[]).map((t) => (
                <option key={t} value={t}>
                  {DOCUMENT_LABELS[t].title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Number</label>
            <input className={inputClass} value={data.number}
              onChange={(e) => update("number", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" className={inputClass} value={data.date}
              onChange={(e) => update("date", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Your business name</label>
            <input className={inputClass} value={data.businessName}
              onChange={(e) => update("businessName", e.target.value)} />
          </div>
        </div>
      </section>

      {/* Customer */}
      <section className={cardClass}>
        <h2 className="mb-4 font-semibold text-slate-800">Customer</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} value={data.customer.name}
              onChange={(e) => update("customer", { ...data.customer, name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={data.customer.email}
              onChange={(e) => update("customer", { ...data.customer, email: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea rows={2} className={inputClass} value={data.customer.address}
              onChange={(e) => update("customer", { ...data.customer, address: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Items */}
      <section className={cardClass}>
        <h2 className="mb-4 font-semibold text-slate-800">Products / Services</h2>
        <div className="space-y-4">
          {data.items.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-3">
              <label className={labelClass}>Description</label>
              <input className={inputClass} value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })} />
              <div className="mt-3 grid grid-cols-3 items-end gap-3">
                <div>
                  <label className={labelClass}>Qty</label>
                  <input type="number" min={0} className={inputClass} value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelClass}>Unit price</label>
                  <input type="number" min={0} step="0.01" className={inputClass} value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelClass}>Total</label>
                  <p className="py-2 text-sm font-medium text-slate-800">
                    {formatMoney(item.quantity * item.unitPrice)}
                  </p>
                </div>
              </div>
              {data.items.length > 1 && (
                <button onClick={() => removeItem(item.id)}
                  className="mt-2 text-xs text-red-600 hover:underline">
                  Remove item
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => update("items", [...data.items, newItem()])}
          className="mt-4 rounded-lg border border-dashed border-indigo-400 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        >
          + Add item
        </button>
      </section>

      {/* Discount, tax, notes */}
      <section className={cardClass}>
        <h2 className="mb-4 font-semibold text-slate-800">Discount, tax & notes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Discount (%)</label>
            <input type="number" min={0} max={100} className={inputClass} value={data.discountPercent}
              onChange={(e) => update("discountPercent", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Tax (%)</label>
            <input type="number" min={0} className={inputClass} value={data.taxPercent}
              onChange={(e) => update("taxPercent", Number(e.target.value))} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Notes</label>
            <textarea rows={3} className={inputClass} value={data.notes}
              onChange={(e) => update("notes", e.target.value)} />
          </div>
        </div>
      </section>
    </div>
  );
}
