import { injectable } from "inversify";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { IRegisterDTO, ILoginDTO } from "../types/auth.types";
import { prisma } from "../utils/prismaClient";
import { AppError } from "../errors/AppError";

@injectable()
export class AuthService {
  async register(data: IRegisterDTO) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email already in use", StatusCodes.CONFLICT);
    }

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
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });

    const { id, name, email } = user;

    return {
      token,
      user: { id, name, email },
    };
  }

  async logout() {
    // Stateless logout if using JWT: client should delete token.
    return { message: "User logged out (client should remove token)" };
  }

  async me(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    return user;
  }
}
