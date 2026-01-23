import { Router } from "express";
import {
  getAdminChats,
  getAdminMetrics,
  getAreaAppeals,
  getAreaMetrics,
  getAreaPending,
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/admin/metrics", getAdminMetrics);
router.get("/admin/chats", getAdminChats);
router.get("/area/:areaId/metrics", getAreaMetrics);
router.get("/area/:areaId/pending", getAreaPending);
router.get("/area/:areaId/appeals", getAreaAppeals);

export default router;
