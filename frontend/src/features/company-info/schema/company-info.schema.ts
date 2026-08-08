// frontend/src/features/company-info/schema/company-info.schema.ts
import { z } from "zod";

// ============================================================
// 1. SCHÉMA POUR LES NUMÉROS MOBILE MONEY
// ============================================================
export const mobileMoneyNumberSchema = z.object({
  numero: z.string().min(1, "Le numéro est requis"),
  nom: z.string().optional(),
});

// ============================================================
// 2. SCHÉMA POUR LA CRÉATION D'UNE VERSION COMPANY INFO
// ============================================================
export const companyInfoSchema = z.object({
  nif: z.string().min(1, "Le NIF est requis"),
  stat: z.string().min(1, "Le STAT est requis"),
  rif: z.string().optional().nullable(),
  mainAddress: z.string().min(1, "L'adresse principale est requise"),
  mainAddressDetail: z.string().optional().nullable(),
  secondaryAddress: z.string().optional().nullable(),
  secondaryAddressDetail: z.string().optional().nullable(),
  logo: z.string().url().optional().nullable(),
  name: z.string().min(1, "Le nom est requis"),
  stamp: z.string().url().optional().nullable(),
  mobileMoneyNumbers: z.array(mobileMoneyNumberSchema).optional().nullable(),
  standardPhone: z.string().optional().nullable(),
  contactEmail: z.string().email("Email invalide").optional().nullable(),
  termsAndConditions: z.string().optional().nullable(),
  deliveryLeadTime: z.string().optional().nullable(),
  bankAccountHolder: z.string().optional().nullable(),
  bankBranch: z.string().optional().nullable(),
  bankCode: z.string().optional().nullable(),
  ribInfo: z.string().optional().nullable(),
});

// ============================================================
// 3. SCHÉMA POUR LA REQUÊTE D'HISTORIQUE
// ============================================================
export const companyInfoQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
