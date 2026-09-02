import { prisma } from "../config/prisma.js";
import type { PacienteInput } from "../middlewares/validarPaciente.js";

export const pacienteModel = {
  createPaciente: async (data: PacienteInput) => {
    return await prisma.paciente.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        fechaNacimiento: data.fechaNacimiento,
        direccion: data.direccion ?? null,
      },
    });
  },

  getAllPacientes: async () => {
    return await prisma.paciente.findMany({
      orderBy: { apellido: "asc" },
    });
  },

  getPacienteById: async (id: number) => {
    return await prisma.paciente.findUnique({
      where: { id },
      include: {
        citas: {
          orderBy: { fechaHora: "desc" },
          include: {
            medico: {
              include: { especialidad: true },
            },
          },
        },
      },
    });
  },

  getPacienteByEmail: async (email: string) => {
    return await prisma.paciente.findUnique({ where: { email } });
  },
};
