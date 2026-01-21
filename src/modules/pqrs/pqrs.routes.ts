import { Router } from "express";
import { createPqrs } from "./pqrs.controller";
import { botMiddleware } from "@/middlewares/bot.middleware";

const router = Router();

router.post("/", botMiddleware, createPqrs);

export default router;
