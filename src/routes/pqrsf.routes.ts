import { Router } from "express";
import {
  appealPqrs,
  createAnalisis,
  createDocumentForPqrs,
  createReanalisis,
  createResponseForPqrs,
  createSurvey,
  deleteDocument,
  downloadDocument,
  finalizePqrs,
  getPqrsByRadicado,
  getReanalisisById,
  getSurveyByPqrs,
  listAnalisisByPqrs,
  listApelaciones,
  listCerradas,
  listDocumentsByPqrs,
  listPqrsByArea,
  listPqrsByStatus,
  listPqrsByType,
  listPqrsByUser,
  listResponsesByPqrs,
  listSeguimiento,
  searchPqrs,
  updateAnalisis,
  updateReanalisis,
  updateSurvey,
} from "../controllers/pqrsf.controller";

const router = Router();

router.get("/radicado/:code", getPqrsByRadicado);
router.get("/status/:statusId", listPqrsByStatus);
router.get("/type/:typeId", listPqrsByType);
router.get("/user/:userId", listPqrsByUser);
router.get("/area/:areaId", listPqrsByArea);
router.get("/search", searchPqrs);

router.get("/:pqrsfId/analysis", listAnalisisByPqrs);
router.post(
  "/analysis",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateAnalisis' } } */
  createAnalisis
);
router.put(
  "/analysis/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateAnalisis' } } */
  updateAnalisis
);

router.get("/reanalysis/:id", getReanalisisById);
router.post(
  "/reanalysis",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateReanalisis' } } */
  createReanalisis
);
router.put(
  "/reanalysis/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateReanalisis' } } */
  updateReanalisis
);

router.get("/:pqrsfId/responses", listResponsesByPqrs);
router.post(
  "/:pqrsfId/responses",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateRespuesta' } } */
  createResponseForPqrs
);

router.get("/:pqrsfId/documents", listDocumentsByPqrs);
router.post(
  "/:pqrsfId/documents",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateDocumento' } } */
  createDocumentForPqrs
);
router.delete("/documents/:id", deleteDocument);
router.get("/documents/:id/download", downloadDocument);

router.get("/:pqrsfId/survey", getSurveyByPqrs);
router.post(
  "/survey",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateEncuesta' } } */
  createSurvey
);
router.put(
  "/survey/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateEncuesta' } } */
  updateSurvey
);

router.post("/:pqrsfId/finalize", finalizePqrs);
router.post("/:pqrsfId/appeal", appealPqrs);
router.get("/seguimiento", listSeguimiento);
router.get("/apelaciones", listApelaciones);
router.get("/cerradas", listCerradas);

export default router;
