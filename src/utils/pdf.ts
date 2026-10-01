import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { DocumentData } from "../types";
import { DOCUMENT_LABELS } from "./defaults";
import { calculateTotals, formatMoney } from "./calculations";

export function exportPdf(data: DocumentData) {
  const doc = new jsPDF();
  const { title, prefix } = DOCUMENT_LABELS[data.type];
  const totals = calculateTotals(data.items, data.discountPercent, data.taxPercent);

  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229);
  doc.text(title.toUpperCase(), 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${prefix}-${data.number}`, 14, 30);
  doc.text(`Date: ${data.date}`, 14, 35);
  doc.setFontSize(13);
  doc.setTextColor(30);
  doc.text(data.businessName, 196, 22, { align: "right" });

  // Customer
  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text("BILL TO", 14, 48);
  doc.setFontSize(10);
  doc.setTextColor(30);
  const customerLines = [
    data.customer.name,
    data.customer.email,
    ...data.customer.address.split("\n"),
  ].filter(Boolean);
  doc.text(customerLines, 14, 54);

  // Items table
  let finalY = 80;
  autoTable(doc, {
    startY: 80,
    head: [["Description", "Qty", "Unit price", "Total"]],
    body: data.items.map((i) => [
      i.description,
      String(i.quantity),
      formatMoney(i.unitPrice),
      formatMoney(i.quantity * i.unitPrice),
    ]),
    headStyles: { fillColor: [79, 70, 229] },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
    didDrawPage: (hook) => {
      finalY = hook.cursor?.y ?? finalY; // remember where the table ended
    },
  });

  // Totals
  let y = finalY + 10;
  const rows: [string, string][] = [
    ["Subtotal", formatMoney(totals.subtotal)],
    [`Discount (${data.discountPercent}%)`, `-${formatMoney(totals.discount)}`],
    [`Tax (${data.taxPercent}%)`, formatMoney(totals.tax)],
  ];
  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.text(label, 130, y);
    doc.text(value, 196, y, { align: "right" });
    y += 6;
  });
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total", 130, y + 2);
  doc.text(formatMoney(totals.total), 196, y + 2, { align: "right" });

  // Notes
  if (data.notes) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(doc.splitTextToSize(data.notes, 180), 14, y + 20);
  }

  doc.save(`${prefix}-${data.number}.pdf`);
}
