import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { companyInfoService } from "./company-info.service.js";
import {
  companyInfoSchema,
  companyInfoQuerySchema,
} from "./company-info.schema.js";
import { intIdParamSchema } from "@/shared/schemas/id.schema.js";

export const companyInfoController = {
  getActive: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const active = await companyInfoService.getActive();
    res.status(200).json({ success: true, data: active });
  }),

  getAllVersions: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const query = companyInfoQuerySchema.parse(req.query);
      const result = await companyInfoService.getAllVersions(query);
      res.status(200).json({ success: true, data: result });
    },
  ),

  getVersionById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = intIdParamSchema.parse(req.params);
      const version = await companyInfoService.getVersionById(id);
      res.status(200).json({ success: true, data: version });
    },
  ),

  createNewVersion: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = companyInfoSchema.parse(req.body);
      const newVersion =
        await companyInfoService.createNewVersion(validatedData);
      res.status(201).json({
        success: true,
        message: "New company info created",
        data: newVersion,
      });
    },
  ),
};
