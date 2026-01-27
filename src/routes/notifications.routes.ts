import { Router } from "express";
import {
  listNotificacionesByResponsable,
  markAllNotificacionesAsRead,
  markNotificacionAsRead,
} from "../controllers/notificacion.controller";

const router = Router();

// UNUSED (frontend)
router.get("/", listNotificacionesByResponsable);
// UNUSED (frontend)
router.patch("/mark-all-read", markAllNotificacionesAsRead);
// UNUSED (frontend)
router.patch("/:id", markNotificacionAsRead);

export default router;
