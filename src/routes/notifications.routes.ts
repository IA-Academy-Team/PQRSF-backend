import { Router } from "express";
import {
  listNotificacionesByResponsable,
  markAllNotificacionesAsRead,
  markNotificacionAsRead,
} from "../controllers/notificacion.controller";

const router = Router();

router.get("/", listNotificacionesByResponsable);
router.patch("/mark-all-read", markAllNotificacionesAsRead);
router.patch("/:id", markNotificacionAsRead);

export default router;
