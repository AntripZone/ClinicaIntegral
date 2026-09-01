import { prisma } from "../config/prisma.js";

export const medicoModel = {
  getAllMedicos: async (nombreEspecialidad?: string) => {
    return await prisma.medico.findMany({
      where: nombreEspecialidad
        ? {
            especialidad: {
              nombre: { equals: nombreEspecialidad, mode: "insensitive" },
            },
          }
        : {},
      orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
      include: { especialidad: true },
    });
  },

  getMedicoById: async (id: number) => {
    return await prisma.medico.findUnique({
      where: { id },
      include: { especialidad: true },
    });
  },
};
