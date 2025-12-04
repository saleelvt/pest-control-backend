import { AppError } from "../utils/AppError";

import bcrypt from "bcrypt";

export class AuthService {
  async login(email: string, password: string) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminHash) {
      throw new AppError({
        message: "Auth environment not configured.",
        statusCode: 500,
      });
    }

    if (email !== adminEmail) {
      throw new AppError({
        message: "Invalid email or password.",
        statusCode: 401,
      });
    }

    const match = await bcrypt.compare(password, adminHash);
    if (!match) {
      throw new AppError({
        message: "Invalid email or password.",
        statusCode: 401,
      });
    }
    return { email };
  }
}
