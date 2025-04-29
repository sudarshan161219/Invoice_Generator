import { injectable } from "inversify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IRegisterDTO, ILoginDTO } from "../types/auth.types";

@injectable()
export class AuthService {
  async register(data: IRegisterDTO) {
    const hashPassword = await bcrypt.hash(data.password, 10);

    // You’d store to DB here, using Prisma etc.

    return { message: "User registered", email: data.email };
  }

  async login(data: ILoginDTO) {
    const fakePasswordFromDb = await bcrypt.hash("secret123", 10);
    const isMatch = await bcrypt.compare(data.password, fakePasswordFromDb);

    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return { token };
  }
}
