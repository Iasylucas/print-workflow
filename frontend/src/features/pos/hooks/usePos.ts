import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../services/posApi";
import type {
  CreateBulkOrderRequest,
  updateInvoiceFromPosRequest,
} from "../types/pos.types";
import { toast } from "sonner";
import { downloadInvoicePDF } from "@/shared/pdf/InvoicePdf";
import { downloadQuotePDF } from "@/shared/pdf/QuotePdf";
import { invoicesApi } from "@/features/invoices/services/invoicesApi";
import { quotesApi } from "@/features/quotes/services/quotesApi";

export const useInvoiceForPos = (invoiceId: number | null) => {
  return useQuery({
    queryKey: ["pos", "invoice", invoiceId],
    queryFn: () => orderApi.getInvoiceForPos(invoiceId!),
    enabled: !!invoiceId,
    retry: 1,
    staleTime: 0,
  });
};

export const useInvoicePayments = (invoiceId: number | null) => {
  return useQuery({
    queryKey: ["pos", "invoice", invoiceId, "payments"],
    queryFn: () => orderApi.getInvoicePayments(invoiceId!),
    enabled: !!invoiceId,
  });
};

export const useProductsCatalog = () => {
  return useQuery({
    queryKey: ["products-catalog"],
    queryFn: () => orderApi.getProductsCatalog(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrderMutations = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const invalidateInvoice = () => {
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
  };
  const invalidateOrders = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };
  const createBulkOrderMutation = useMutation({
    mutationFn: (data: CreateBulkOrderRequest) =>
      orderApi.createBulkOrder(data),

    onSuccess: async (result) => {
      const docName = result.documentType === "INVOICE" ? "Facture" : "Devis";
      toast.success(`${docName} généré avec succès : ${result.documentNumber}`);

      invalidateInvoice();
      invalidateOrders();

      try {
        if (result.documentType === "INVOICE") {
          const invoice = await invoicesApi.getInvoiceById(result.id);
          await downloadInvoicePDF(invoice, invoice.companyInfo);
        } else {
          const quote = await quotesApi.getQuoteById(result.id);
          await downloadQuotePDF(quote, quote.companyInfo);
        }
      } catch (pdfError) {
        console.error("Erreur PDF:", pdfError);
      }

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la validation de la commande");
    },
  });

  const updateInvoiceFromPosMutation = useMutation({
    mutationFn: ({
      invoiceId,
      data,
    }: {
      invoiceId: number;
      data: updateInvoiceFromPosRequest;
    }) => orderApi.updateInvoiceFromPos(invoiceId, data),
    onSuccess: async (_, { invoiceId }) => {
      toast.success("Facture mise à jour avec succès");
      invalidateOrders();
      invalidateInvoice();
      queryClient.invalidateQueries({
        queryKey: ["pos", "invoice", invoiceId],
      });

      try {
        const invoice = await invoicesApi.getInvoiceById(invoiceId);
        await downloadInvoicePDF(invoice, invoice.companyInfo);
      } catch (pdfError) {
        console.error("Erreur lors de la génération du PDF:", pdfError);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la validation de la commande");
    },
  });

  return { createBulkOrderMutation, updateInvoiceFromPosMutation };
};
