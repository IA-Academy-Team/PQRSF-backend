import { Router } from "express";
import {
  createArea,
  deleteArea,
  getAreaById,
  listAreas,
  updateArea,
} from "../controllers/area.controller";
import {
  createResponsable,
  deleteResponsable,
  getAllResponsables,
  getAllResponsablesDetailed,
  getResponsableById,
  getResponsablesByArea,
  updateResponsable,
} from "../controllers/responsable.controller";

const router = Router();

router.get("/responsible", getAllResponsables);
router.get("/responsible/summary", getAllResponsablesDetailed);
router.get("/:areaId/responsible", getResponsablesByArea);
router.post(
  "/responsible",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateResponsable' } } */
  createResponsable
);
router.get("/responsible/:id", getResponsableById);
router.put(
  "/responsible/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateResponsable' } } */
  updateResponsable
);
router.delete("/responsible/:id", deleteResponsable);

router.get("/", listAreas);
router.get("/:id", getAreaById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateArea' } } */
  createArea
);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateArea' } } */
  updateArea
);
router.delete("/:id", deleteArea);

export default router;
