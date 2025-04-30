import { injectable } from "inversify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IRegisterDTO, ILoginDTO } from "../types/auth.types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@injectable()
export class AuthService {
  async register(data: IRegisterDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //* store to DB here, using Prisma etc.
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashedPassword },
    });

    return { message: "User registered", user };
  }

  async login(data: ILoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return { token };
  }

  async logout() {
    // Stateless logout if using JWT: client should delete token.
    return { message: "User logged out (client should remove token)" };
  }

  async me(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
