import { Request, Response } from "express";
import { auth } from "../config/auth.config";
import { AppError } from "../middlewares/error.middleware";
import {
  AuthLoginDTO,
  AuthRegisterDTO,
  AuthRequestResetDTO,
  AuthResetDTO,
} from "../DTOs/auth.dto";
import { asyncHandler } from "./controller.utils";
import {
  requireEmail,
  requireString,
} from "../utils/validation.utils";

const ensurePassword = (value: unknown, field: string) => {
  const password = requireString(value, field);
  if (password.length < 8) {
    throw new AppError(
      `${field} must be at least 8 characters long`,
      400,
      "VALIDATION_ERROR"
    );
  }
  return password;
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as AuthRegisterDTO;
  const email = requireEmail(payload.email, "email");
  const password = ensurePassword(payload.password, "password");
  const name =
    payload.name !== undefined ? requireString(payload.name, "name") : undefined;

  const data = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: name ?? email.split("@")[0],
      phone_number: "",
      role_id: 1,
      is_active: true,
    },
  });

  res.status(201).json(data);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as AuthLoginDTO;
  const email = requireEmail(payload.email, "email");
  const password = requireString(payload.password, "password");

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
      rememberMe: payload.rememberMe,
    },
    headers: req.headers as Record<string, string>,
  });

  res.json(data);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await auth.api.signOut({
    headers: req.headers as Record<string, string>,
  });
  res.status(204).send();
});

export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body as AuthRequestResetDTO;
    const email = requireEmail(payload.email, "email");

    const data = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: payload.redirectTo,
      },
    });
    res.json(data);
  }
);

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as AuthResetDTO;
  const token = requireString(payload.token, "token");
  const newPassword = ensurePassword(payload.newPassword, "newPassword");

  const data = await auth.api.resetPassword({
    body: {
      token,
      newPassword,
    },
  });
  res.json(data);
});
