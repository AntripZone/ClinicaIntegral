import type { Request, Response } from "express";
import { medicoModel } from "../models/medicosModels";

export const medicoController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const raw = req.query.especialidad;
      const especialidad =
        typeof raw === "string" && raw.trim() !== "" ? raw.trim() : undefined;

      const medicos = await medicoModel.getAllMedicos(especialidad);
      return res.json(medicos);
    } catch (error) {
      console.error("GET /api/medicos:", error);
      return res.status(500).json({ error: "Error al obtener los médicos" });
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
      const medico = await medicoModel.getMedicoById(id);
      if (!medico) {
        return res.status(404).json({ error: "Médico no encontrado" });
      }
      return res.json(medico);
    } catch (error) {
      console.error("GET /api/medicos/:id:", error);
      return res.status(500).json({ error: "Error al obtener el médico" });
    }
  },
};
