export type DashboardStats = {
  paymentsThisMonth: number;
  paymentsPreviousMonth: number;
  paymentsDeltaPercent: number | null;
  deletedPaymentsThisMonth: number;
};

export type PaymentsTrendPoint = {
  month: string;
  label: string;
  total: number;
};

export type PaymentsTrend = {
  data: PaymentsTrendPoint[];
};
