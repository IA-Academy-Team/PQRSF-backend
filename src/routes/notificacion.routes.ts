import { Router } from "express";
import {
  countNotificacionesNoLeidas,
  createNotificacion,
  deleteNotificacion,
  getNotificacionById,
  listNotificacionesByResponsable,
  markNotificacionesAsRead,
  updateNotificacion,
} from "../controllers/notificacion.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateNotificacion' } } */
  createNotificacion
);
// UNUSED (frontend)
router.get("/responsable/:responsibleId/count", countNotificacionesNoLeidas);
// UNUSED (frontend)
router.post(
  "/mark-read",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MarkNotificacionesAsRead' } } */
  markNotificacionesAsRead
);
// UNUSED (frontend)
router.get("/", listNotificacionesByResponsable);
// UNUSED (frontend)
router.get("/:id", getNotificacionById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateNotificacion' } } */
  updateNotificacion
);
// UNUSED (frontend)
router.delete("/:id", deleteNotificacion);

export default router;
