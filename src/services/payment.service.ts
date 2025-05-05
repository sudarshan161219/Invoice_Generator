import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient"; 
import { ICreatePaymentDTO } from "../types/payment.types";



@injectable()
export class PaymentService {
  async create(invoiceId: number, data: ICreatePaymentDTO) {
    return prisma.payment.create({
      data: {
        ...data,
        invoice: { connect: { id: invoiceId } },
      },
    });
  }

  async getPayments(invoiceId: number) {
    return prisma.payment.findMany({
      where: { invoiceId },
    });
  }

  async delete(paymentId: number, userId: number) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: true,
      },
    });

    if (!payment || payment.invoice.userId !== userId) {
      throw new Error("Payment not found or unauthorized");
    }

    return prisma.payment.delete({
      where: { id: paymentId },
    });
  }
}
