import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  companyInfoSelect,
  CreateCompanyInfoInput,
  CompanyInfoQuery,
  PaginatedCompanyInfoList,
} from "./company-info.types.js";

export class CompanyInfoRepository {
  // Récupérer la version active (la plus récente)
  async findActive() {
    return await prisma.companyInfo.findFirst({
      select: companyInfoSelect,
      orderBy: { id: "desc" },
    });
  }

  // Récupérer une version spécifique par ID
  async findById(id: number) {
    return await prisma.companyInfo.findUnique({
      where: { id },
      select: companyInfoSelect,
    });
  }

  // Lister les versions avec pagination, tri (uniquement createdAt) et filtres date
  async findAllVersions(
    query: CompanyInfoQuery,
  ): Promise<PaginatedCompanyInfoList> {
    const { page, limit, sortOrder, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    // Construction du filtre WHERE
    const where: Prisma.CompanyInfoWhereInput = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Exécution parallèle des deux requêtes
    const [data, total] = await Promise.all([
      prisma.companyInfo.findMany({
        where,
        select: companyInfoSelect,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      prisma.companyInfo.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
      },
    };
  }

  // Créer une nouvelle version (objet complet)
  async create(data: CreateCompanyInfoInput) {
    return await prisma.companyInfo.create({
      data,
      select: companyInfoSelect,
    });
  }
}
