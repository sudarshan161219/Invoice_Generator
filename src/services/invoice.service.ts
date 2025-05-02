import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { ICreateInvoiceDTO } from "../types/invoice.types";

const prisma = new PrismaClient();

@injectable()
export class InvoiceService {
  async create(userId: number, clientId: number, data: ICreateInvoiceDTO) {
    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        user: { connect: { id: userId } },
        client: { connect: { id: clientId } },
      },
    });

    return invoice;
  }

  async getAll(userId: number) {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: number, userId: number) {
    return prisma.invoice.findFirst({
      where: { id, userId },
    });
  }

  //* todo ---> strictly type data
  async update(id: number, data: any, userId: number) {
    const invoice = await prisma.invoice.findFirst({ where: { id, userId } });

    if (!invoice) throw new Error("Invoice not found or unauthorized");

    return prisma.invoice.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: number, userId: number) {
    return prisma.invoice.deleteMany({
      where: { id, userId },
    });
  }
}
