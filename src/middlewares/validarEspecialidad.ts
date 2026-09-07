import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const especialidadSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  descripcion: z.string().trim().max(255).optional(),
});

export type EspecialidadInput = z.infer<typeof especialidadSchema>;

export const validarEspecialidad = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const resultado = especialidadSchema.safeParse(req.body);

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
  return next();
};
