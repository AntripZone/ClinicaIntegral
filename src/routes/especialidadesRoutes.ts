import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";
import { especialidadesController } from "../controllers/especialidadesController.js";
import { validarEspecialidad } from "../middlewares/validarEspecialidad.js";

const router = Router();

router.get(
  "/",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  especialidadesController.getAll,
);

router.post(
  "/",
  verificarToken,
  autorizar("GERENCIA"),
  validarEspecialidad,
  especialidadesController.create,
);

export default router;
