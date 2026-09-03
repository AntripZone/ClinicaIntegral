import { prisma } from "../config/prisma.js";
import type { CitaInput } from "../middlewares/validarCita.js";

export const citaModel = {
  createCita: async (data: CitaInput) => {
    return await prisma.cita.create({
      data: {
        pacienteId: data.pacienteId,
        medicoId: data.medicoId,
        fechaHora: data.fechaHora,
        motivo: data.motivo ?? null,
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            especialidad: {
              select: { id: true, nombre: true },
            },
          },
        },
      },
    });
  },

  getCitaById: async (id: number) => {
    return await prisma.cita.findUnique({
      where: { id },
      include: {
        paciente: true,
        medico: true,
      },
    });
  },

  choqueHorario: async (medicoId: number, fechaHora: Date) => {
    return await prisma.cita.findFirst({
      where: {
        medicoId,
        fechaHora,
        estado: { not: "CANCELADA" },
      },
    });
  },

  updateEstado: async (id: number, estado: "COMPLETADA" | "CANCELADA") => {
    return await prisma.cita.update({
      where: { id },
      data: { estado },
    });
  },
};
