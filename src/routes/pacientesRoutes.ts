import { Router } from "express";
import { pacienteController } from "../controllers/pacientesController.js";
import { validatePaciente } from "../middlewares/validarPaciente.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";

const router = Router();

router.post(
  "/",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  validatePaciente,
  pacienteController.create,
);
router.get(
  "/",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  pacienteController.getAll,
);
router.get(
  "/:id",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  pacienteController.getById,
);

export default router;
