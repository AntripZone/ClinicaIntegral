import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import pacienteRoutes from "./routes/pacientesRoutes.js";
import medicoRoutes from "./routes/medicosRoutes.js";
import citaRoutes from "./routes/citasRoutes";
import especialidadRoutes from "./routes/especialidadesRoutes";
import authRoutes from "./routes/authRoutes.js";

const swaggerDocument = JSON.parse(
  readFileSync(new URL("./swagger-output.json", import.meta.url), "utf-8"),
);

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api/salud", (_req, res) => {
  //#swagger.ignore = true
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/especialidades", especialidadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/medicos", medicoRoutes);
app.use("/api/citas", citaRoutes);

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
