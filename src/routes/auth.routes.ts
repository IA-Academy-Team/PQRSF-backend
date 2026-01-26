import { Router } from "express";
import {
  login,
  logout,
  me,
  refresh,
  register,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from "../controllers/auth/auth.controller";

const router = Router();

router.post(
  "/register",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuthRegister' } } */
  register
);
router.post(
  "/login",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuthLogin' } } */
  login
);
router.get(
  "/me",
  /* #swagger.parameters['Authorization'] = { in: 'header', required: false, type: 'string', description: 'Bearer <token>' } */
  /* #swagger.parameters['Cookie'] = { in: 'header', required: false, type: 'string', description: 'better-auth.session=<token>' } */
  me
);
router.post(
  "/refresh",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuthRefresh' } } */
  refresh
);
router.post(
  "/logout",
  /* #swagger.parameters['Authorization'] = { in: 'header', required: false, type: 'string', description: 'Bearer <token>' } */
  /* #swagger.parameters['Cookie'] = { in: 'header', required: false, type: 'string', description: 'better-auth.session=<token>' } */
  logout
);
router.post(
  "/forgot-password",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuthRequestReset' } } */
  requestPasswordReset
);
router.post(
  "/reset-password",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuthReset' } } */
  resetPassword
);
router.post(
  "/verify-email",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuthVerifyEmail' } } */
  verifyEmail
);

export default router;
