import { Router } from "express";
import { pacienteController } from "../controllers/pacientesController.js";
import { validatePaciente } from "../middlewares/validarPaciente.js";

const router = Router();

router.post("/", validatePaciente, pacienteController.create);
router.get("/", pacienteController.getAll);
router.get("/:id", pacienteController.getById);

export default router;
