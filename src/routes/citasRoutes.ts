import { Router } from "express";
import { citaController } from "../controllers/citasController.js";
import { validarCita, validarCitaEstado } from "../middlewares/validarCita.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";

const router = Router();

router.post(
  "/",
  verificarToken,
  autorizar("RECEPCIONISTA", "MEDICO"),
  validarCita,
  citaController.create,
);
router.get(
  "/:id",
  verificarToken,
  autorizar("RECEPCIONISTA", "MEDICO"),
  citaController.getById,
);
router.patch(
  "/:id/estado",
  verificarToken,
  autorizar("MEDICO"),
  validarCitaEstado,
  citaController.updateEstado,
);

export default router;
