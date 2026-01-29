import { Router } from "express";
import { createPublicSurveyByTicket, getPublicSurveyByTicket } from "../controllers/encuesta.controller";

const router = Router();

router.get("/:ticketNumber", getPublicSurveyByTicket);
router.post(
  "/:ticketNumber",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateEncuesta' } } */
  createPublicSurveyByTicket
);

export default router;
