import { Router } from "express";
import {
  createResponsable,
  deleteResponsable,
  getResponsableById,
  updateResponsable,
} from "../controllers/responsable.controller";

const router = Router();

router.get("/:id", getResponsableById);
router.post("/", createResponsable);
router.patch("/:id", updateResponsable);
router.delete("/:id", deleteResponsable);

export default router;
