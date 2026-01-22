import { Router } from "express";
import {
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
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
router.post(
  "/logout",
  /* #swagger.parameters['Authorization'] = { in: 'header', required: false, type: 'string', description: 'Bearer <token>' } */
  /* #swagger.parameters['Cookie'] = { in: 'header', required: false, type: 'string', description: 'better-auth.session=<token>' } */
  logout
);
router.post(
  "/password/request",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuthRequestReset' } } */
  requestPasswordReset
);
router.post(
  "/password/reset",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuthReset' } } */
  resetPassword
);

export default router;
