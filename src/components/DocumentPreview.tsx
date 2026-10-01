import type { DocumentData } from "../types";
import { DOCUMENT_LABELS } from "../utils/defaults";
import { calculateTotals, formatMoney } from "../utils/calculations";

export default function DocumentPreview({ data }: { data: DocumentData }) {
  const { title, prefix } = DOCUMENT_LABELS[data.type];
  const totals = calculateTotals(data.items, data.discountPercent, data.taxPercent);

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tight text-indigo-600">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {prefix}-{data.number}
          </p>
          <p className="text-sm text-slate-500">{data.date}</p>
        </div>
        <p className="text-lg font-semibold text-slate-800">{data.businessName}</p>
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Bill to</p>
        <p className="font-medium text-slate-800">{data.customer.name || "—"}</p>
        <p className="text-sm text-slate-600">{data.customer.email}</p>
        <p className="whitespace-pre-line text-sm text-slate-600">{data.customer.address}</p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left text-xs uppercase text-slate-500">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Unit price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-2">{item.description || "—"}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatMoney(item.unitPrice)}</td>
                <td className="py-2 text-right">{formatMoney(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 ml-auto w-full max-w-xs space-y-1 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Discount ({data.discountPercent}%)</span><span>-{formatMoney(totals.discount)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Tax ({data.taxPercent}%)</span><span>{formatMoney(totals.tax)}</span>
        </div>
        <div className="flex justify-between border-t-2 border-slate-200 pt-2 text-base font-bold text-slate-900">
          <span>Total</span><span>{formatMoney(totals.total)}</span>
        </div>
      </div>

      {data.notes && (
        <div className="mt-8 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p>
          <p className="whitespace-pre-line text-sm text-slate-600">{data.notes}</p>
        </div>
      )}
    </div>
  );
}
