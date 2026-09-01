import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const pacienteSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  apellido: z.string().trim().min(1, "El apellido es obligatorio"),
  email: z.string().trim().email("El correo no tiene un formato válido"),
  telefono: z
    .string()
    .trim()
    .min(6, "El teléfono es obligatorio")
    .max(20, "El teléfono es demasiado largo"),
  fechaNacimiento: z.coerce
    .date({ message: "La fecha de nacimiento no es una fecha válida" })
    .max(new Date(), "La fecha de nacimiento no puede ser futura"),
  direccion: z.string().trim().max(255).optional(),
});
export type PacienteInput = z.infer<typeof pacienteSchema>;

export const validatePaciente = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const resultado = pacienteSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: resultado.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });
  }
  req.body = resultado.data;
  next();
};
