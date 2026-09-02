import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import { prisma } from "../src/config/prisma";
import pacienteRoutes from "./routes/pacientesRoutes.js";
import medicoRoutes from "./routes/medicosRoutes.js";
import { verificarToken } from "./middlewares/authMiddleware";
import { autorizar } from "./middlewares/authRolMiddleware";
import authRoutes from "./routes/authRoutes.js";

const swaggerDocument = JSON.parse(
  readFileSync(new URL("./swagger-output.json", import.meta.url), "utf-8"),
);

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api/salud", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get(
  "/api/especialidades",
  verificarToken,
  autorizar("RECEPCIONISTA", "GERENCIA"),
  async (_req, res) => {
    try {
      /*
      #swagger.tags = ['Especialidades']
      #swagger.summary = 'Catálogo de especialidades con su número de médicos'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
    */
      const especialidades = await prisma.especialidad.findMany({
        orderBy: { nombre: "asc" },
        include: {
          _count: { select: { medicos: true } },
        },
      });
      res.json(especialidades);
    } catch (error) {
      console.error("GET /api/especialidades:", error);
      res.status(500).json({ error: "Error al obtener las especialidades" });
    }
  },
);

app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/medicos", medicoRoutes);

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
