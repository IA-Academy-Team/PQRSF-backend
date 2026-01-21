import { Router } from "express";
import {
  createPqrs,
  deletePqrs,
  getPqrsById,
  listPqrs,
  updatePqrs,
} from "../controllers/pqrs.controller";

const router = Router();

router.get("/", listPqrs);
router.get("/:id", getPqrsById);
router.post("/", createPqrs);
router.patch("/:id", updatePqrs);
router.delete("/:id", deletePqrs);

export default router;
