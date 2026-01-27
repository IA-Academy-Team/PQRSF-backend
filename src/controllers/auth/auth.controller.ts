import { Request, Response } from "express";
import { auth } from "../../config/auth.config";
import { AppError } from "../../middlewares/error.middleware";
import { asyncHandler } from "../../utils/controller.utils";
import {
  requireEmail,
  requireString,
} from "../../utils/validation.utils";
import {
  authLoginSchema,
  authRefreshSchema,
  authRegisterSchema,
  authRequestResetSchema,
  authResetSchema,
  authVerifyEmailSchema,
} from "../../schemas/auth.schema";

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
  const payload = authRegisterSchema.parse(req.body);
  const email = requireEmail(payload.email, "email");
  const password = ensurePassword(payload.password, "password");
  const name =
    payload.name !== undefined ? requireString(payload.name, "name") : undefined;
  const phoneNumber =
    payload.phoneNumber !== undefined
      ? requireString(payload.phoneNumber, "phoneNumber")
      : undefined;

  const data = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: name ?? email.split("@")[0],
      phone_number: phoneNumber ?? "",
      role_id: 1,
      is_active: true,
    },
  });

  res.status(201).json(data);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = authLoginSchema.parse(req.body);
  const email = requireEmail(payload.email, "email");
  const password = requireString(payload.password, "password");

  try {
    const data = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: req.headers as Record<string, string>,
    });

    res.json(data);
  } catch (err) {
    if (err && typeof err === "object") {
      const message =
        "message" in err && typeof err.message === "string"
          ? err.message
          : "";
      if (message.includes("Credential account not found")) {
        throw new AppError(
          "No existe una cuenta de credenciales para este correo. Registra el usuario con /api/auth/register.",
          401,
          "AUTH_CREDENTIALS_NOT_FOUND",
          { email }
        );
      }
      if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("password")) {
        throw new AppError(
          "Credenciales invalidas",
          401,
          "AUTH_INVALID_CREDENTIALS",
          { email }
        );
      }
    }
    throw err;
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await auth.api.signOut({
    headers: req.headers as Record<string, string>,
  });
  res.status(200).json({ status: "ok" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const data = await (auth.api as any).getSession({
    headers: req.headers as Record<string, string>,
  });
  res.json(data);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const payload = authRefreshSchema.parse(req.body);
  const data = await (auth.api as any).refreshToken({
    body: payload,
    headers: req.headers as Record<string, string>,
  });
  res.json(data);
});

export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = authRequestResetSchema.parse(req.body);
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
  const payload = authResetSchema.parse(req.body);
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

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const payload = authVerifyEmailSchema.parse(req.body);
  const data = await (auth.api as any).verifyEmail({
    query: payload,
    headers: req.headers as Record<string, string>,
  });
  res.json(data);
});
