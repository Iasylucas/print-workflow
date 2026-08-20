import {
  ConflictError,
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "@/shared/error/error.js";
import { CLIENT_ERRORS } from "./client.constants.js";
import { ClientRepository } from "./client.repository.js";
import {
  CreateClientInput,
  UpdateClientInput,
  ClientQuery,
  PaginatedClientList,
} from "./client.types.js";

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(data: CreateClientInput) {
    if (data.email) {
      const existing = await this.clientRepository.findByEmail(data.email);
      if (existing) throw new ConflictError(CLIENT_ERRORS.EMAIL_EXISTS);
    }

    try {
      const client = await this.clientRepository.create(data);
      return client;
    } catch (error) {
      throw new InternalServerError(CLIENT_ERRORS.FAILED_CREATION);
    }
  }

  async list(query: ClientQuery): Promise<PaginatedClientList> {
    return await this.clientRepository.findAll(query);
  }

  async getById(id: string) {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new NotFoundError(CLIENT_ERRORS.NOT_FOUND);
    return client;
  }

  async update(id: string, data: UpdateClientInput) {
    if (Object.keys(data).length === 0) {
      throw new BadRequestError(
        "At least one field must be provided for update",
      );
    }

    const [client, emailExists] = await Promise.all([
      this.clientRepository.findById(id),
      data.email
        ? this.clientRepository.findByEmail(data.email)
        : Promise.resolve(null),
    ]);

    if (!client) throw new NotFoundError(CLIENT_ERRORS.NOT_FOUND);
    if (emailExists && emailExists.id !== id)
      throw new ConflictError(CLIENT_ERRORS.EMAIL_EXISTS);

    try {
      return await this.clientRepository.update(id, data);
    } catch (error) {
      throw new InternalServerError(CLIENT_ERRORS.FAILED_UPDATE);
    }
  }

  async remove(id: string) {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new NotFoundError(CLIENT_ERRORS.NOT_FOUND);

    try {
      await this.clientRepository.delete(id);
      return;
    } catch (error) {
      throw new InternalServerError(CLIENT_ERRORS.FAILED_DELETE);
    }
  }
}

export const clientService = new ClientService(new ClientRepository());
