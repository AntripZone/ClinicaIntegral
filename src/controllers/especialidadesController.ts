import type { Request, Response } from "express";
import { especialidadModel } from "../models/especialidadesModels";
import { prisma } from "../config/prisma";

export const especialidadesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Especialidades']
      #swagger.summary = 'Catálogo de especialidades con su número de médicos'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
    */
      const especialidades = await especialidadModel.findAll();
      res.json(especialidades);
    } catch (error) {
      console.error("GET /api/especialidades:", error);
      res.status(500).json({ error: "Error al obtener las especialidades" });
    }
  },
};
