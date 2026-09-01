import { Router } from "express";
import { medicoController } from "../controllers/medicosController";

const router = Router();

router.get("/", medicoController.getAll);
router.get("/:id", medicoController.getById);

export default router;
