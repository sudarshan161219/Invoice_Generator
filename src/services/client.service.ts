import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient";
import { ICreateClientDTO } from "../types/client.types";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError";

@injectable()
export class ClientService {
  async create(userId: number, data: ICreateClientDTO) {
    try {
      return await prisma.client.create({
        data: {
          ...data,
          user: { connect: { id: userId } },
        },
      });
    } catch (err) {
      throw new AppError("Failed to create client", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(userId: number) {
    return prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: number, userId: number) {
    const client = await prisma.client.findFirst({
      where: { id, userId },
    });

    if (!client) {
      throw new AppError("Client not found", StatusCodes.NOT_FOUND);
    }

    return client;
  }

  async update(id: number, data: any, userId: number) {
    const client = await prisma.client.findFirst({ where: { id, userId } });

    if (!client) {
      throw new AppError("Client not found or unauthorized", StatusCodes.NOT_FOUND);
    }

    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    const client = await prisma.client.findFirst({ where: { id, userId } });

    if (!client) {
      throw new AppError("Client not found or unauthorized", StatusCodes.NOT_FOUND);
    }

    return prisma.client.delete({
      where: { id },
    });
  }
}
