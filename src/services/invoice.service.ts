import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient";
import { ICreateInvoiceDTO } from "../types/invoice.types";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError";

@injectable()
export class InvoiceService {
  async create(userId: number, clientId: number, data: ICreateInvoiceDTO) {
    try {
      const invoice = await prisma.invoice.create({
        data: {
          ...data,
          dueDate: new Date(data.dueDate),
          user: { connect: { id: userId } },
          client: { connect: { id: clientId } },
        },
      });

      return invoice;
    } catch (err) {
      throw new AppError("Failed to create invoice", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(userId: number) {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: number, userId: number) {
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      throw new AppError("Invoice not found", StatusCodes.NOT_FOUND);
    }

    return invoice;
  }

  async update(id: number, data: Partial<ICreateInvoiceDTO>, userId: number) {
    const invoice = await prisma.invoice.findFirst({ where: { id, userId } });

    if (!invoice) {
      throw new AppError("Invoice not found or unauthorized", StatusCodes.NOT_FOUND);
    }

    return prisma.invoice.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    const invoice = await prisma.invoice.findFirst({ where: { id, userId } });

    if (!invoice) {
      throw new AppError("Invoice not found or unauthorized", StatusCodes.NOT_FOUND);
    }

    return prisma.invoice.delete({
      where: { id },
    });
  }
}
