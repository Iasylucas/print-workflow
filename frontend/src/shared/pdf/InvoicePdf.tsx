// frontend/src/shared/pdf/InvoicePdf.tsx
import { pdf } from "@react-pdf/renderer";
import { InvoicePDFDocument } from "./components/InvoicePDFDocument";
import { sanitizeFileName } from "./pdfUtils";
import type { InvoiceDetail } from "@/features/invoices/types/invoices.types";
import type { CompanyInfo } from "@/features/company-info/types/company.types";

export const downloadInvoicePDF = async (
  invoice: InvoiceDetail,
  companyInfo: CompanyInfo,
) => {
  // 1. Créer le PDF
  const blob = await pdf(
    <InvoicePDFDocument invoice={invoice} companyInfo={companyInfo} />,
  ).toBlob();

  // 2. Télécharger
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Facture-${sanitizeFileName(invoice.number)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
