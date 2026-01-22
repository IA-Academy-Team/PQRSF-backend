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

router.get("/responsable/:responsibleId/count", countNotificacionesNoLeidas);
router.post(
  "/mark-read",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MarkNotificacionesAsRead' } } */
  markNotificacionesAsRead
);
router.get("/", listNotificacionesByResponsable);
router.get("/:id", getNotificacionById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateNotificacion' } } */
  createNotificacion
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateNotificacion' } } */
  updateNotificacion
);
router.delete("/:id", deleteNotificacion);

export default router;
