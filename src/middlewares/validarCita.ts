import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const citaSchema = z.object({
  pacienteId: z.number().int().positive("El id del paciente no es valido"),
  medicoId: z.number().int().positive("El id del medico no es valido"),
  fechaHora: z.coerce
    .date({ message: "La fecha y hora no son validas" })
    .min(new Date(), "No puedes agendar una cita en una fecha que ya pasó"),
  motivo: z.string().trim().max(255).optional(),
});

export const citaEstadoSchema = z.object({
  estado: z.enum(["COMPLETADA", "CANCELADA"], {
    message: "El estado debe ser COMPLETADA o CANCELADA",
  }),
});

export type CitaInput = z.infer<typeof citaSchema>;
export type CitaEstadoInput = z.infer<typeof citaEstadoSchema>;

export const validarCita = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const resultado = citaSchema.safeParse(req.body);
  if (!resultado.success)
    return res.status(404).json({
      error: "Datos invalidos",
      detalles: resultado.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });

  req.body = resultado.data;
  return next();
};

export const validarCitaEstado = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const resultado = citaEstadoSchema.safeParse(req.body);

  if (!resultado.success)
    return res.status(404).json({
      error: "Datos invalidos",
      detalles: resultado.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });

  req.body = resultado.data;
  return next();
};
