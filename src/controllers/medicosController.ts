import type { Request, Response } from "express";
import { medicoModel } from "../models/medicosModels";

export const medicoController = {
  getAll: async (req: Request, res: Response) => {
    try {
      /*
    #swagger.tags = ['Médicos']
    #swagger.summary = 'Lista médicos, opcionalmente filtrados por especialidad'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['especialidad'] = {
      in: 'query',
      description: 'Nombre de la especialidad (no distingue mayúsculas)',
      required: false,
      type: 'string',
      example: 'Pediatría'
    }
    #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
    #swagger.responses[403] = { description: 'El rol no tiene permiso' }
  */
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
      /*
    #swagger.tags = ['Médicos']
    #swagger.summary = 'Un médico por id, con su especialidad'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { in: 'path', description: 'Id del médico', required: true, type: 'integer' }
    #swagger.responses[404] = { description: 'Médico no encontrado' }
  */
      const id = Number(req.params.id);
      if (!id || id <= 0) {
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
