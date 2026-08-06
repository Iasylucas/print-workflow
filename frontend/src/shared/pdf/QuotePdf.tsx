import { pdf } from "@react-pdf/renderer";
import { QuotePDFDocument } from "./components/QuotePDFDocument";
import { sanitizeFileName } from "./pdfUtils";
import type { QuoteDetail } from "@/features/quotes/types/quotes.types";
import type { CompanyInfo } from "@/features/company-info/types/company.types";

export const downloadQuotePDF = async (
  quote: QuoteDetail,
  companyInfo: CompanyInfo,
) => {
  const blob = await pdf(
    <QuotePDFDocument quote={quote} companyInfo={companyInfo} />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Devis-${sanitizeFileName(quote.number)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
