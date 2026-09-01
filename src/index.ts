import "dotenv/config";
import express from "express";
import { prisma } from "../src/config/prisma";
import pacienteRoutes from "./routes/pacientesRoutes.js";
import medicoRoutes from "./routes/medicosRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/api/salud", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/especialidades", async (_req, res) => {
  try {
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
});

app.use("/api/pacientes", pacienteRoutes);
app.use("/api/medicos", medicoRoutes);

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
