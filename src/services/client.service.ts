import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { ICreateClientDTO } from "../types/client.types";

const prisma = new PrismaClient();

@injectable()
export class ClientService {
  async create(userId: number, data: ICreateClientDTO) {
    return prisma.client.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }
  async getAll(userId: number) {
    return prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
  async getById(id: number, userId: number) {
    return prisma.client.findFirst({
      where: { id, userId },
    });
  }
  async update(id: number, data: any, userId: number) {
    const client = await prisma.client.findFirst({ where: { id, userId } });
    if (!client) throw new Error("Client not found or unauthorized");

    return prisma.client.update({
      where: { id, userId },
      data,
    });
  }
  async delete(id: number, userId: number) {
    return prisma.client.delete({
      where: { id_userId: { id, userId } },
    });
  }
}
