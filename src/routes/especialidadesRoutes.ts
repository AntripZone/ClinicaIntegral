import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";
import { especialidadesController } from "../controllers/especialidadesController.js";

const router = Router();

router.get(
  "/",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  especialidadesController.getAll,
);

export default router;
