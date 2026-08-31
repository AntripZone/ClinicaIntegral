import "dotenv/config";
import express from "express";
import prisma from "../src/config/prisma";

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

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


