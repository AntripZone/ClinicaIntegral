import { Router } from "express";
import { authController } from "../controllers/authController";
import { validarRegistro, validarLogin } from "../middlewares/validarAuth";
import { verificarToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", validarRegistro, authController.register);
router.post("/login", validarLogin, authController.login);
router.get("/me", verificarToken, authController.me);

export default router;
