import { Router } from "express";
import { medicoController } from "../controllers/medicosController";
import { verificarToken } from "../middlewares/authMiddleware";
import { autorizar } from "../middlewares/authRolMiddleware";

const router = Router();

router.get(
  "/",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  medicoController.getAll,
);
router.get(
  "/:id",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  medicoController.getById,
);

export default router;
