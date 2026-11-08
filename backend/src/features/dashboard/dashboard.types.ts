export type DashboardStatsOutput = {
  paymentsThisMonth: number;
  paymentsPreviousMonth: number;
  paymentsDeltaPercent: number | null;
  deletedPaymentsThisMonth: number;
};

export type PaymentsTrendPoint = {
  month: string; // "YYYY-MM"
  label: string; // "juin", "juil.", "nov."
  total: number;
};

export type PaymentsTrendOutput = {
  data: PaymentsTrendPoint[];
};