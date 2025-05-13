import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient";
import { ICreatePaymentDTO } from "../types/payment.types";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError";

@injectable()
export class PaymentService {
  async create(invoiceId: number, data: ICreatePaymentDTO) {
    console.log(invoiceId);
    try {
      return await prisma.payment.create({
        data: {
          ...data,
          invoice: { connect: { id: invoiceId } },
        },
      });
    } catch (err) {
      throw new AppError(
        "Failed to create payment",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPayments(invoiceId: number) {
    try {
      return await prisma.payment.findMany({
        where: { invoiceId },
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      throw new AppError(
        "Failed to fetch payments",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    paymentId: number,
    userId: number,
    data: { note?: string; method?: string }
  ) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: true },
    });

    if (!payment || payment.invoice.userId !== userId) {
      throw new AppError(
        "Payment not found or unauthorized",
        StatusCodes.UNAUTHORIZED
      );
    }

    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        note: data.note,
        method: data.method,
      },
    });
  }

  async delete(paymentId: number, userId: number) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: true },
    });

    if (!payment || payment.invoice.userId !== userId) {
      throw new AppError(
        "Payment not found or unauthorized",
        StatusCodes.NOT_FOUND
      );
    }

    try {
      return await prisma.payment.delete({
        where: { id: paymentId },
      });
    } catch (err) {
      throw new AppError(
        "Failed to delete payment",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
