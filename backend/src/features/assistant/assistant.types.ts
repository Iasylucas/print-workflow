import { z } from "zod";
import { assistantQuerySchema } from "./assistant.schema.js";

export type AssistantQuery = z.infer<typeof assistantQuerySchema>;

export type AssistantResponse = {
  answer: string;
};

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: z.ZodTypeAny;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
};

export type OpenAIToolFormat = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

// ============================================================
// TYPES DE RÉPONSE POUR CHAQUE TOOL
// ============================================================

// Invoices
export type InvoiceListItem = {
  id: number;
  number: string;
  date: Date;
  clientId: string;
  client: { firstName: string; lastName: string; phone?: string };
  total: number;
  deposit: number;
  isDelivered: boolean;
  paymentStatus: string;
  createdAt: Date;
};

export type InvoicesListResponse = {
  data: InvoiceListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type InvoiceDetailResponse = {
  id: number;
  number: string;
  date: Date;
  client: { firstName: string; lastName: string; phone?: string };
  total: number;
  deposit: number;
  deliveryPlace?: string;
  expectedDeliveryDate?: Date;
  isDelivered: boolean;
  paymentStatus: string;
  companyInfo?: { nif: string; stat: string; mainAddress: string };
  createdBy: { firstName: string; lastName: string };
  createdAt: Date;
  orders?: Array<{
    id: number;
    reference: string;
    designation: string;
    status: string;
  }>;
};

// Quotes
export type QuoteListItem = {
  id: number;
  number: string;
  date: Date;
  clientId: string;
  client: { firstName: string; lastName: string };
  total: number;
  status: string;
  createdAt: Date;
};

export type QuotesListResponse = {
  data: QuoteListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type QuoteDetailResponse = {
  id: number;
  number: string;
  date: Date;
  client: { firstName: string; lastName: string };
  total: number;
  status: string;
  companyInfoId?: number;
  createdBy: { firstName: string; lastName: string };
  createdAt: Date;
  orders?: Array<{
    id: number;
    reference: string;
    designation: string;
    status: string;
  }>;
};

// Orders
export type OrderListItem = {
  id: number;
  reference: string;
  designation: string;
  label?: string;
  dimensions?: string;
  clientId: string;
  client: { firstName: string; lastName: string };
  productId?: number;
  product?: { name: string };
  quantity: number;
  unitPrice: number;
  status: string;
  invoiceId?: number;
  quoteId?: number;
  createdAt: Date;
};

export type OrdersListResponse = {
  data: OrderListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type OrderDetailResponse = {
  id: number;
  reference: string;
  designation: string;
  label?: string;
  dimensions?: string;
  status: string;
  quantity: number;
  unitPrice: number;
  client: { firstName: string; lastName: string };
  product?: { name: string };
  files?: Array<{ id: number; url: string; category: string }>;
  notes?: Array<{ id: number; text: string; user: { firstName: string; lastName: string } }>;
  invoice?: { number: string };
  quote?: { number: string };
  createdAt: Date;
  statusHistory?: Array<{ fromStatus?: string; toStatus: string; createdAt: Date; changedBy: { firstName: string; lastName: string } }>;
};

// Clients
export type ClientListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
};

export type ClientsListResponse = {
  data: ClientListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type ClientDetailResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt?: Date;
};

// Products
export type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
};

export type ProductsListResponse = {
  data: ProductListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type ProductDetailResponse = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt?: Date;
  variants?: Array<{
    id: number;
    name: string;
    // pricingRules optionnel pour la lecture
  }>;
};

// CompanyInfo
export type CompanyInfoResponse = {
  id: number;
  nif: string;
  stat: string;
  rif?: string;
  mainAddress: string;
  mainAddressDetail?: string;
  secondaryAddress?: string;
  secondaryAddressDetail?: string;
  logo?: string;
  name: string;
  stamp?: string;
  mobileMoneyNumbers?: string[];
  standardPhone?: string;
  contactEmail?: string;
  termsAndConditions?: string;
  deliveryLeadTime?: string;
  bankAccountHolder?: string;
  bankBranch?: string;
  bankCode?: string;
  ribInfo?: string;
  createdAt: Date;
};

// OrderStatusHistory
export type OrderStatusHistoryListItem = {
  id: number;
  orderId: number;
  fromStatus?: string;
  toStatus: string;
  changedBy: { firstName: string; lastName: string };
  createdAt: Date;
};

export type OrderStatusHistoryListResponse = {
  data: OrderStatusHistoryListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type OrderStatusHistoryDetailResponse = {
  id: number;
  orderId: number;
  fromStatus?: string;
  toStatus: string;
  changedBy: { firstName: string; lastName: string };
  createdAt: Date;
};

// PaymentAuditLog
export type PaymentAuditLogListItem = {
  id: string;
  action: string;
  user: { firstName: string; lastName: string };
  oldData?: any;
  newData?: any;
  reason?: string;
  createdAt: Date;
};

export type PaymentAuditLogListResponse = {
  data: PaymentAuditLogListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    sortBy: string;
    sortOrder: string;
  };
};

export type PaymentAuditLogDetailResponse = {
  id: string;
  action: string;
  user: { firstName: string; lastName: string };
  oldData?: any;
  newData?: any;
  reason?: string;
  createdAt: Date;
  payment?: { id: number; amount: number; invoice: { number: string } };
};

// Users (safe, no password)
export type UserListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  phone?: string;
  address?: string;
  createdAt: Date;
};

export type UsersListResponse = {
  data: UserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type UserDetailResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt?: Date;
};
