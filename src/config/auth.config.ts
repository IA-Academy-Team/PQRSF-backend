import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { createFieldAttribute } from "better-auth/db";
import bcrypt from "bcrypt";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "../utils/mailer.utils";
import prisma from "./db.config";

const ALLOWED_EMAIL_DOMAINS = new Set([
  "campuslands.com",
  "fundacioncampuslands.com",
]);

const DOMAIN_ERROR_CODE = "EMAIL_DOMAIN_NOT_ALLOWED";
const DOMAIN_ERROR_MESSAGE =
  "No puedes ingresar porque tu correo no termina en @campuslands.com o @fundacioncampuslands.com";

const isAllowedEmail = (email?: string | null) => {
  if (!email) return false;
  const domain = email.split("@").pop()?.toLowerCase();
  return Boolean(domain && ALLOWED_EMAIL_DOMAINS.has(domain));
};

export const auth = betterAuth({
  appName: "Hubux",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),

  logger: {
    level: "debug",
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/auth/handler",

  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],

  user: {
    modelName: "users",
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
      twoFactorEnabled: "two_factor_enabled",
    },
    additionalFields: {
      phone_number: createFieldAttribute("string", {
        fieldName: "phone_number",
        required: false,
      }),
      role_id: createFieldAttribute("number", {
        fieldName: "role_id",
        required: false,
        defaultValue: 1,
      }),
      is_active: createFieldAttribute("boolean", {
        fieldName: "is_active",
        required: false,
        returned: false,
      }),
    },
  },

  account: {
    modelName: "accounts",
    fields: {
      providerId: "provider_id",
      accountId: "provider_account_id",
      userId: "user_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      allowDifferentEmails: false,
      updateUserInfoOnLink: true,
    },
  },

  session: {
    modelName: "sessions",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  verification: {
    modelName: "verifications",
    fields: {
      token: "value",
      identifier: "identifier",
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => bcrypt.hash(password, 10),
      verify: async ({ hash, password }) => bcrypt.compare(password, hash),
    },
    sendResetPassword: async ({ user, url, token }) => {
      const subject = "Restablece tu contraseña";
      const text = `Hola${user.name ? ` ${user.name}` : ""},\n\nUsa este enlace para restablecer tu contraseña:\n${url}\n\nSi no solicitaste este cambio, puedes ignorar este mensaje.`;
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color:#0ea5e9;">Restablece tu contraseña</h2>
          <p>Hola${user.name ? ` ${user.name}` : ""},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>
            <a href="${url}" style="color:#0ea5e9; font-weight:bold;">Haz clic aqui para continuar</a>
          </p>
          <p style="color:#6b7280;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
          <p style="color:#9ca3af; font-size:12px;">Token: ${token}</p>
        </div>
      `;
      console.info('[Auth] reset-password:send', { email: user.email, url });
      if (process.env.NODE_ENV === "production") {
        void sendEmail({ to: user.email, subject, text, html });
      } else {
        await sendEmail({ to: user.email, subject, text, html });
      }    
    },
    onPasswordReset: async ({ user }) => {
      console.info('[Auth] reset-password:done', { email: user.email });
    },
  },

  socialProviders: {},

  plugins: [],

  databaseHooks: {
    user: {
      create: {
        async before(user, ctx) {
          const email = typeof user.email === "string" ? user.email : "";
          if (isAllowedEmail(email)) {
            return { data: user };
          }

          throw new APIError("FORBIDDEN", {
            message: DOMAIN_ERROR_CODE,
            code: DOMAIN_ERROR_CODE,
          });
        },
      },
    },
    session: {
      create: {
        async before(session, ctx) {
          if (!ctx) return;
          const user = await ctx.context.internalAdapter.findUserById(
            session.userId
          );
          if (!user || isAllowedEmail(user.email)) return;

          throw new APIError("FORBIDDEN", {
            message: DOMAIN_ERROR_CODE,
            code: DOMAIN_ERROR_CODE,
          });
        },
      },
    },
  },
});
