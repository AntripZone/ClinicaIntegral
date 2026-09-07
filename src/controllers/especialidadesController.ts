import type { Request, Response } from "express";
import { especialidadModel } from "../models/especialidadesModels";
import type { EspecialidadInput } from "../middlewares/validarEspecialidad";

export const especialidadesController = {
  create: async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['Especialidades']
      #swagger.summary = 'Registra una especialidad nueva'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nombre"],
              properties: {
                nombre: { type: "string", example: "Neurología" },
                descripcion: { type: "string", example: "Enfermedades del sistema nervioso" }
              }
            }
          }
        }
      }
      #swagger.responses[201] = { description: 'Especialidad creada' }
      #swagger.responses[400] = { description: 'Datos inválidos' }
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
      #swagger.responses[409] = { description: 'Ya existe una especialidad con ese nombre' }
    */
    try {
      const data = req.body as EspecialidadInput;
      const existente = await especialidadModel.create(data);
      if (existente) {
        return res.status(409).json({
          error: `Ya existe la especialidad "${existente.nombre}"`,
        });
      }

      const especialidad = await especialidadModel.create(data.nombre);
      return res.status(201).json(especialidad);
    } catch (error) {
      console.error("POST /api/especialidades:", error);
      return res
        .status(500)
        .json({ error: "Error al registrar una especialidad" });
    }
  },
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
