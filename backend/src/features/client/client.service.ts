//shared imports
import {
  ConflictError,
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "@/shared/error/error.js";

// constants imports
import { CLIENT_ERRORS } from "@/constants/errorMessage.js";

// feature imports
import { ClientRepository } from "./client.repository.js";
import {
  CreateClientInput,
  UpdateClientInput,
  ClientQuery,
  PaginatedClientList,
} from "./client.types.js";

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  // Create a new client
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

  // List clients with pagination, search and sorting
  async list(query: ClientQuery): Promise<PaginatedClientList> {
    return await this.clientRepository.findAll(query);
  }

  // Get a client by ID
  async getById(id: string) {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new NotFoundError(CLIENT_ERRORS.NOT_FOUND);
    return client;
  }

  // Update a client by ID
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

  // Soft delete a client by ID
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
