import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  updateRole,
} from "../controllers/rol.controller";

const router = Router();

// UNUSED (frontend)
router.get("/", listRoles);
// UNUSED (frontend)
router.get("/:id", getRoleById);
// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateRol' } } */
  createRole
);
// UNUSED (frontend)
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateRol' } } */
  updateRole
);
// UNUSED (frontend)
router.delete("/:id", deleteRole);

export default router;
