import type { Request, Response } from "express";
import { pacienteModel } from "../models/pacientesModels";
import type { PacienteInput } from "../middlewares/validarPaciente";

export const pacienteController = {
  create: async (req: Request, res: Response) => {
    try {
      const data = req.body as PacienteInput;
      const existente = await pacienteModel.getPacienteByEmail(data.email);
      if (existente) {
        return res.status(409).json({
          error: "Ya existe un paciente registrado con ese correo",
        });
      }

      const paciente = await pacienteModel.createPaciente(data);
      return res.status(201).json(paciente);
    } catch (error) {
      console.error("POST /api/pacientes:", error);
      return res.status(500).json({ error: "Error al registrar el paciente" });
    }
  },

  getAll: async (_req: Request, res: Response) => {
    try {
      const pacientes = await pacienteModel.getAllPacientes();
      return res.json(pacientes);
    } catch (error) {
      console.error("GET /api/pacientes:", error);
      return res.status(500).json({ error: "Error al obtener los pacientes" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: "El id debe ser un número entero positivo" });
      }

      const paciente = await pacienteModel.getPacienteById(id);

      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }

      return res.json(paciente);
    } catch (error) {
      console.error("GET /api/pacientes/:id:", error);
      return res.status(500).json({ error: "Error al obtener el paciente" });
    }
  },
};
