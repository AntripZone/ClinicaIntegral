import type { Request, Response } from "express";
import { pacienteModel } from "../models/pacientesModels";
import type { PacienteInput } from "../middlewares/validarPaciente";

export const pacienteController = {
  create: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Pacientes']
      #swagger.summary = 'Registra un paciente nuevo'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nombre", "apellido", "email", "telefono", "fechaNacimiento"],
              properties: {
                nombre: { type: "string", example: "Valeria" },
                apellido: { type: "string", example: "Ccahuana" },
                email: { type: "string", example: "valeria@example.com" },
                telefono: { type: "string", example: "976543210" },
                fechaNacimiento: { type: "string", format: "date", example: "1988-02-29" },
                direccion: { type: "string", example: "Av. Larco 1450, Trujillo" }
              }
            }
          }
        }
      }
      #swagger.responses[201] = { description: 'Paciente creado' }
      #swagger.responses[400] = { description: 'Datos inválidos' }
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
      #swagger.responses[409] = { description: 'El correo ya está registrado' }
    */
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

  getAll: async (req: Request, res: Response) => {
    try {
      /*
    #swagger.tags = ['Pacientes']
    #swagger.summary = 'Lista todos los pacientes'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.autoHeaders = false
    #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
    #swagger.responses[403] = { description: 'El rol no tiene permiso' }
  */
      const pacientes = await pacienteModel.getAllPacientes();
      return res.json(pacientes);
    } catch (error) {
      console.error("GET /api/pacientes:", error);
      return res.status(500).json({ error: "Error al obtener los pacientes" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      /*
    #swagger.tags = ['Pacientes']
    #swagger.summary = 'Expediente completo: datos personales + historial de citas'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.autoHeaders = false
    #swagger.parameters['id'] = { in: 'path', description: 'Id del paciente', required: true, type: 'integer' }
    #swagger.responses[404] = { description: 'Paciente no encontrado' }
  */
      const id = Number(req.params.id);

      if (!id || id <= 0) {
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
