import type { Request, Response } from "express";
import type { CitaEstadoInput, CitaInput } from "../middlewares/validarCita.js";
import { citaModel } from "../models/citasModels.js";
import { Prisma } from "../generated/prisma/client";
import { pacienteModel } from "../models/pacientesModels.js";
import { medicoModel } from "../models/medicosModels.js";

export const citaController = {
  create: async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['Citas']
      #swagger.summary = 'Agenda una cita'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["pacienteId", "medicoId", "fechaHora"],
              properties: {
                pacienteId: { type: "integer", example: 1 },
                medicoId: { type: "integer", example: 1 },
                fechaHora: { type: "string", format: "date-time", example: "2026-09-15T10:00:00.000Z" },
                motivo: { type: "string", example: "Control de presión arterial" }
              }
            }
          }
        }
      }
      #swagger.responses[201] = { description: 'Cita agendada en estado PROGRAMADA' }
      #swagger.responses[400] = { description: 'Datos inválidos o fecha en el pasado' }
      #swagger.responses[404] = { description: 'El paciente o el médico no existe' }
      #swagger.responses[409] = { description: 'El médico ya tiene una cita a esa hora' }
    */
    try {
      const data = req.body as CitaInput;
      const paciente = await pacienteModel.getPacienteById(data.pacienteId);
      const medico = await medicoModel.getMedicoById(data.medicoId);

      if (!paciente)
        return res.status(404).json({ message: "El paciente no existe" });
      if (!medico)
        return res.status(404).json({ message: "El medico no existe" });

      const ocupado = await citaModel.choqueHorario(
        data.medicoId,
        data.fechaHora,
      );
      if (ocupado)
        return res.status(409).json({
          error: "El medico ya tiene una cita agendada en ese horario",
        });

      const cita = await citaModel.createCita(data);
      return res.status(201).json(cita);
    } catch (error) {
      console.error("POST /api/citas:", error);
      return res.status(500).json({ error: "Error al registrar la cita" });
    }
  },

  getById: async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['Citas']
      #swagger.summary = 'Una cita por id'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = { in: 'path', description: 'Id de la cita', required: true, type: 'integer' }
      #swagger.responses[404] = { description: 'Cita no encontrada' }
    */
    try {
      const id = Number(req.params.id);

      if (!id || id <= 0)
        return res
          .status(400)
          .json({ error: "El id debe ser un numero entero" });
      const cita = await citaModel.getCitaById(id);
      if (!cita) return res.status(404).json({ error: "Cita no encontrada" });

      return res.json(cita);
    } catch (error) {
      console.error("GET /api/citas/:id:", error);
      return res.status(500).json({ error: "Error al obtener la cita" });
    }
  },

  updateEstado: async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['Citas']
      #swagger.summary = 'Actualiza el estado de una cita'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = { in: 'path', description: 'Id de la cita', required: true, type: 'integer' }
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["estado"],
              properties: {
                estado: { type: "string", enum: ["COMPLETADA", "CANCELADA"], example: "COMPLETADA" }
              }
            }
          }
        }
      }
      #swagger.responses[200] = { description: 'Estado actualizado' }
      #swagger.responses[404] = { description: 'Cita no encontrada' }
    */
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0)
        return res
          .status(400)
          .json({ error: "El id debe ser un numero entero" });

      const { estado } = req.body as CitaEstadoInput;
      const cita = await citaModel.updateEstado(id, estado);
      return res.json(cita);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025")
          return res.status(404).json({ error: "Cita no encontrada" });
      }

      console.error("PATCH /api/citas/:id/estado:", error);
      return res
        .status(500)
        .json({ error: "Error al actualizar el estado de la cita" });
    }
  },

  corteDiario: async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['Citas']
      #swagger.summary = 'Corte operativo diario: citas completadas y canceladas en una fecha'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['fecha'] = { in: 'query', description: 'Fecha en formato YYYY-MM-DD', required: true, type: 'string', example: '2026-09-06' }
      #swagger.responses[200] = { description: 'Resumen del día' }
      #swagger.responses[400] = { description: 'Fecha ausente o inválida' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
    */
    try {
      const raw = req.query.fecha;

      if (typeof raw !== "string" || raw.trim() === "") {
        return res
          .status(400)
          .json({ error: "El parámetro 'fecha' es obligatorio (YYYY-MM-DD)" });
      }

      const fecha = new Date(raw);
      if (Number.isNaN(fecha.getTime())) {
        return res
          .status(400)
          .json({ error: "La fecha no es válida. Usa el formato YYYY-MM-DD" });
      }

      const resumen = await citaModel.resumenDelDia(fecha);
      return res.json(resumen);
    } catch (error) {
      console.error("GET /api/citas/reportes/corte-diario:", error);
      return res.status(500).json({ error: "Error al generar el reporte" });
    }
  },
};
