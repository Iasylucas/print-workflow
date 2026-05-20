import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { companyInfoService } from "./company-info.service.js";
import {
  companyInfoSchema,
  companyInfoQuerySchema,
} from "./company-info.schema.js";
import { intIdParamSchema } from "@/shared/schemas/id.schema.js";

export const companyInfoController = {
  // Récupérer la version active
  async getActive(req: Request, res: Response) {
    const active = await companyInfoService.getActive();
    res.status(200).json({ success: true, data: active });
  },

  // Lister les versions (historique paginé)
  async getAllVersions(req: Request, res: Response) {
    const query = companyInfoQuerySchema.parse(req.query);
    const result = await companyInfoService.getAllVersions(query);
    res.status(200).json({ success: true, ...result });
  },

  // Récupérer une version spécifique par ID
  async getVersionById(req: Request, res: Response) {
    const { id } = intIdParamSchema.parse(req.params);
    const version = await companyInfoService.getVersionById(id);
    res.status(200).json({ success: true, data: version });
  },

  // Créer une nouvelle version (objet complet envoyé par le front)
  async createNewVersion(req: Request, res: Response) {
    const validatedData = companyInfoSchema.parse(req.body);
    const newVersion = await companyInfoService.createNewVersion(validatedData);
    res.status(201).json({
      success: true,
      message: "New company info created",
      data: newVersion,
    });
  },
};

// Wrapper avec catchAsync (comme dans client)
export const companyInfoControllerWrapped = {
  getActive: catchAsync(companyInfoController.getActive),
  getAllVersions: catchAsync(companyInfoController.getAllVersions),
  getVersionById: catchAsync(companyInfoController.getVersionById),
  createNewVersion: catchAsync(companyInfoController.createNewVersion),
};
