import { Request, Response } from "express";
import { idParamSchema } from "@/shared/schemas/id.schema.js";
import { catchAsync } from "@/utils/catchAsync.js";
import { clientService } from "./client.service.js";
import {
  createClientSchema,
  updateClientSchema,
  clientQuerySchema,
} from "./client.schema.js";

export const clientController = {
  // Create a new client
  create: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validated = createClientSchema.parse(req.body);
    const client = await clientService.create(validated);

    res
      .status(201)
      .json({ success: true, message: "Client created", data: { client } });
  }),

  // List clients with pagination, search and sorting
  list: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const query = clientQuerySchema.parse(req.query);
    const result = await clientService.list(query);

    res.status(200).json({ success: true, data: result });
  }),

  // Get a client by ID
  getById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const client = await clientService.getById(id);

    res.status(200).json({ success: true, data: { client } });
  }),

  // Update a client by ID
  update: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const validated = updateClientSchema.parse(req.body);
    const client = await clientService.update(id, validated);

    res
      .status(200)
      .json({ success: true, message: "Client updated", data: { client } });
  }),

  // Soft delete a client by ID
  remove: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    await clientService.remove(id);

    res.status(200).json({ success: true, message: "Client deleted" });
  }),
};
