export interface ICreatePaymentDTO {
    amount: number;
    method: string;
    note?: string;
  }