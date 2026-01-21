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
router.post("/mark-read", markNotificacionesAsRead);
router.get("/", listNotificacionesByResponsable);
router.get("/:id", getNotificacionById);
router.post("/", createNotificacion);
router.patch("/:id", updateNotificacion);
router.delete("/:id", deleteNotificacion);

export default router;
