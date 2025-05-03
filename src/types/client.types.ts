export interface ICreateClientDTO {
    name: string;               // Required: Client's name
    email: `${string}@${string}`; // Enforces basic email format
    phone?: string;             // Optional: Phone number
  }
  