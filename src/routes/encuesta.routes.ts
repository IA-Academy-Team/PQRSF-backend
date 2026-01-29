import { Router } from "express";
import {
  createEncuesta,
  createPublicSurveyByTicket,
  deleteEncuesta,
  getPublicSurveyByTicket,
  getEncuestaById,
  listEncuestasDetailed,
  updateEncuesta,
} from "../controllers/encuesta.controller";

const router = Router();

router.get("/admin", listEncuestasDetailed);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateEncuesta' } } */
  createEncuesta
);
router.get("/public/:ticketNumber", getPublicSurveyByTicket);
router.post(
  "/public/:ticketNumber",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateEncuesta' } } */
  createPublicSurveyByTicket
);
router.get("/:id", getEncuestaById);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateEncuesta' } } */
  updateEncuesta
);
router.delete("/:id", deleteEncuesta);

export default router;
