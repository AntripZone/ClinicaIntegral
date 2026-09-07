import { prisma } from "../config/prisma.js";
import type { EspecialidadInput } from "../middlewares/validarEspecialidad.js";

export const especialidadModel = {
  findAll: async () => {
    return await prisma.especialidad.findMany({
      orderBy: { nombre: "asc" },
      include: {
        _count: { select: { medicos: true } },
      },
    });
  },

  findById: async (id: number) => {
    return await prisma.especialidad.findUnique({
      where: { id },
      include: { medicos: true },
    });
  },

  create: async (data: EspecialidadInput) => {
    return await prisma.especialidad.create({
      data: { nombre: data.nombre, descripcion: data.descripcion ?? null },
    });
  },

  findByNombre: async (nombre: string) => {
    return await prisma.especialidad.findFirst({
      where: { nombre: { equals: nombre, mode: "insensitive" } },
    });
  },
};
