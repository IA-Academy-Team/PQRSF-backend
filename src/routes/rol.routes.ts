import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  updateRole,
} from "../controllers/rol.controller";

const router = Router();

router.get("/", listRoles);
router.get("/:id", getRoleById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateRol' } } */
  createRole
);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateRol' } } */
  updateRole
);
router.delete("/:id", deleteRole);

export default router;
