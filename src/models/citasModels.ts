import { prisma } from "../config/prisma.js";
import { EstadoCita } from "../generated/prisma/client.js";

export const citaModel = {
  create: async (
    pacienteId: number,
    medicoId: number,
    fechaHora: Date,
    motivo?: string,
  ) => {
    return await prisma.cita.create({
      data: { pacienteId, medicoId, fechaHora, motivo: motivo ?? null },
      include: { paciente: true, medico: true },
    });
  },

  // Agenda del médico: filtrada por rango de fechas (desde / hasta).
  findByMedicoAndRango: async (medicoId: number, desde: Date, hasta: Date) => {
    return await prisma.cita.findMany({
      where: {
        medicoId,
        fechaHora: { gte: desde, lte: hasta },
      },
      orderBy: { fechaHora: "asc" },
      include: {
        paciente: {
          select: { id: true, nombre: true, apellido: true, telefono: true },
        },
      },
    });
  },

  // Gestión de estado: Programada -> Completada | Cancelada
  updateEstado: async (id: number, estado: EstadoCita, notas?: string) => {
    return await prisma.cita.update({
      where: { id },
      data: { estado, notas: notas ?? null },
    });
  },

  findById: async (id: number) => {
    return await prisma.cita.findUnique({
      where: { id },
      include: { paciente: true, medico: true },
    });
  },

  // Detecta choque de horario del mismo médico antes de agendar.
  existeEnHorario: async (medicoId: number, fechaHora: Date) => {
    return await prisma.cita.findFirst({
      where: {
        medicoId,
        fechaHora,
        estado: { not: "CANCELADA" },
      },
    });
  },

  contarPorEspecialidad: async () => {
    const especialidades = await prisma.especialidad.findMany({
      orderBy: { nombre: "asc" },
      select: {
        id: true,
        nombre: true,
        medicos: {
          select: { _count: { select: { citas: true } } },
        },
      },
    });

    return especialidades.map((e) => ({
      id: e.id,
      especialidad: e.nombre,
      totalCitas: e.medicos.reduce(
        (acc: number, m: { _count: { citas: number } }) => acc + m._count.citas,
        0,
      ),
    }));
  },

  //Corte Operativo
  resumenDelDia: async (fecha: Date) => {
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    const grupos = await prisma.cita.groupBy({
      by: ["estado"],
      where: { fechaHora: { gte: inicio, lte: fin } },
      _count: { _all: true },
    });

    const contar = (estado: EstadoCita) =>
      grupos.find((g) => g.estado === estado)?._count._all ?? 0;

    return {
      fecha: inicio.toISOString().split("T")[0],
      completadas: contar("COMPLETADA"),
      canceladas: contar("CANCELADA"),
      programadas: contar("PROGRAMADA"),
      total: grupos.reduce((acc: number, g) => acc + g._count._all, 0),
    };
  },
};
