import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/auth.service";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const authService = new AuthService();

  const user = await authService.login(email, password);

  const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || ("24h" as any),
  });

  return res.json({
    success: true,
    token,
    user,
  });
};
