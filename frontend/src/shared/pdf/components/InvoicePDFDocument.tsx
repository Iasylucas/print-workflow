import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type {
  InvoiceDetail,
  MobileMoney,
} from "@/features/invoices/types/invoices.types";
import type { CompanyInfo } from "@/features/company-info/types/company.types";
import { formatPrice } from "../pdfUtils";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottom: "2px solid #333",
    paddingBottom: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  info: {
    fontSize: 10,
    textAlign: "right",
  },
  addressBlock: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    width: "48%",
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 10,
  },
  clientBlock: {
    backgroundColor: "#f9f9f9",
    padding: 8,
    textAlign: "right",
    marginBottom: 15,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#333",
    color: "white",
    padding: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    padding: 6,
  },
  tableCellDes: {
    width: "40%",
    fontSize: 10,
  },
  tableCellQty: {
    width: "20%",
    fontSize: 10,
    textAlign: "right",
  },
  tableCellPrice: {
    width: "20%",
    fontSize: 10,
    textAlign: "right",
  },
  tableCellTotal: {
    width: "20%",
    fontSize: 10,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    padding: 6,
    color: "white",
  },
  totalLabel: {
    width: "80%",
    fontSize: 12,
    fontWeight: "bold",
  },
  totalValue: {
    width: "20%",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
  conditions: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 15,
  },
  mobileMoney: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  stamp: {
    alignItems: "flex-end",
    marginTop: 15,
  },
});

interface InvoicePDFDocumentProps {
  invoice: InvoiceDetail;
  companyInfo: CompanyInfo;
}

export const InvoicePDFDocument = ({
  invoice,
  companyInfo,
}: InvoicePDFDocumentProps) => {
  const totalPaid =
    invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remaining = invoice.total - totalPaid;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {companyInfo.logo ? (
            <Image
              src={companyInfo.logo}
              style={{ width: 150, height: "auto" }}
            />
          ) : (
            <Text style={styles.logo}>EWA PRINT</Text>
          )}
          <View>
            <Text style={styles.title}>FACTURE N° {invoice.number}</Text>
            <Text style={styles.info}>
              Date : {new Date(invoice.date).toLocaleDateString("fr-FR")}
            </Text>
            <Text style={styles.info}>NIF: {companyInfo.nif || "-"}</Text>
            <Text style={styles.info}>STAT: {companyInfo.stat || "-"}</Text>
            {companyInfo.rif && (
              <Text style={styles.info}>RIF: {companyInfo.rif}</Text>
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>EWA PRINT</Text>
            <Text style={styles.addressText}>
              {companyInfo.mainAddress || "-"}
            </Text>
            {companyInfo.mainAddressDetail && (
              <Text style={styles.addressText}>
                {companyInfo.mainAddressDetail}
              </Text>
            )}
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>Point de vente</Text>
            <Text style={styles.addressText}>
              {companyInfo.secondaryAddress || "-"}
            </Text>
            {companyInfo.secondaryAddressDetail && (
              <Text style={styles.addressText}>
                {companyInfo.secondaryAddressDetail}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.clientBlock}>
          <Text>
            Client : {invoice.client.firstName || ""} {invoice.client.lastName}
          </Text>
          <Text>
            Statut :{" "}
            {invoice.paymentStatus === "paid"
              ? "Payée"
              : invoice.paymentStatus === "partial"
                ? "Partielle"
                : "Non payée"}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellDes}>Désignation</Text>
            <Text style={styles.tableCellQty}>Qté</Text>
            <Text style={styles.tableCellPrice}>Prix U.</Text>
            <Text style={styles.tableCellTotal}>Total</Text>
          </View>

          {invoice.orders.map((order, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCellDes}>
                {order.designation || "-"}
              </Text>
              <Text style={styles.tableCellQty}>{order.quantity || 0}</Text>
              <Text style={styles.tableCellPrice}>
                {formatPrice(order.unitPrice)} Ar
              </Text>
              <Text style={styles.tableCellTotal}>
                {formatPrice(order.quantity * order.unitPrice)} Ar
              </Text>
            </View>
          ))}
        </View>

        <View>
          <View style={{ ...styles.totalRow, backgroundColor: "#c44545" }}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>
              {formatPrice(invoice.total)} Ar
            </Text>
          </View>
          <View style={{ ...styles.totalRow, backgroundColor: "#4a7a6c" }}>
            <Text style={styles.totalLabel}>Acompte versé</Text>
            <Text style={styles.totalValue}>
              {formatPrice(invoice.deposit)} Ar
            </Text>
          </View>
          <View style={{ ...styles.totalRow, backgroundColor: "#333333" }}>
            <Text style={styles.totalLabel}>Reste à payer</Text>
            <Text style={styles.totalValue}>{formatPrice(remaining)} Ar</Text>
          </View>
        </View>

        {companyInfo.termsAndConditions && (
          <View style={styles.conditions}>
            <Text>Conditions : {companyInfo.termsAndConditions}</Text>
          </View>
        )}

        {companyInfo.mobileMoneyNumbers &&
          companyInfo.mobileMoneyNumbers.length > 0 && (
            <View style={styles.mobileMoney}>
              <View>
                <Text style={{ fontWeight: "bold" }}>MOBILE MONEY :</Text>
                {companyInfo.mobileMoneyNumbers.map(
                  (mm: MobileMoney, idx: number) => (
                    <Text key={idx}>
                      {mm.numero} : {mm.nom}
                    </Text>
                  ),
                )}
              </View>
              <View style={{ color: "#c44545", textAlign: "right" }}>
                <Text>PAIEMENT PAR MOBILE MONEY OU VIREMENT BANCAIRE</Text>
                <Text>PAIEMENT EN ESPÈCES OU PAR CHÈQUE BARRÉ : REFUSÉ</Text>
              </View>
            </View>
          )}

        {companyInfo.deliveryLeadTime && (
          <Text style={{ marginBottom: 10 }}>
            Délai de livraison : {companyInfo.deliveryLeadTime}
          </Text>
        )}

        {(companyInfo.bankAccountHolder || companyInfo.bankBranch) && (
          <View
            style={{
              marginTop: 15,
              borderTop: "2px solid #333",
              paddingTop: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>RIB</Text>
            {companyInfo.bankAccountHolder && (
              <Text>Titulaire : {companyInfo.bankAccountHolder}</Text>
            )}
            {companyInfo.bankBranch && (
              <Text>Domiciliation : {companyInfo.bankBranch}</Text>
            )}
            {companyInfo.bankCode && (
              <Text>Code banque : {companyInfo.bankCode}</Text>
            )}
            {companyInfo.ribInfo && <Text>{companyInfo.ribInfo}</Text>}
          </View>
        )}
      </Page>
    </Document>
  );
};
