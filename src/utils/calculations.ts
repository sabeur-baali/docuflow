import type { LineItem } from "../types";

export function calculateTotals(
  items: LineItem[],
  discountPercent: number,
  taxPercent: number
) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const discount = (subtotal * discountPercent) / 100;
  const taxable = subtotal - discount; // tax is applied AFTER the discount
  const tax = (taxable * taxPercent) / 100;
  return { subtotal, discount, tax, total: taxable + tax };
}

export const formatMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
